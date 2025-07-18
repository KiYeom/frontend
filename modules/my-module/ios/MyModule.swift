import ExpoModulesCore
import AVFoundation

let BUF_PER_SEC = 15

public class MyModule: Module {
  // MARK: - Audio session & engines
  private let audioSession = AVAudioSession.sharedInstance()
  private var sessionConfigured = false          // ✅ 세션은 최초 1회만 설정
   private var sessionActive = false  // 세션 활성화 상태 추적
  private let sampleRate: Double = 24_000        // 원하는 출력(재생) 샘플레이트
  private let channels: UInt32 = 1

  private let audioEngine = AVAudioEngine()       // 녹음용 엔진
  private var converter: AVAudioConverter?

  private let playerEngine = AVAudioEngine()      // 재생용 엔진
  private var sourceNode: AVAudioSourceNode?
  private var isPlaying = false

  // MARK: - Buffer & queue
  private var pcmDataQueue = DispatchQueue(label: "pcm.audio.queue", qos: .userInteractive)
  private var pcmBufferQueue = [Data]()
  private let maxQueueLength = 100

  private var currentPCMData: UnsafeMutablePointer<Int16>?
  private var currentDataLength: Int = 0
  private var currentReadPosition: Int = 0

  private var previousSample: Float = 0.0
  private let fadeLength: Int = 64
  private var isFirstBlock = true

  private var silenceFramesGenerated: Int = 0
  private let maxSilenceFrames: Int = 1024

  private var didInitialRouteChangeHandled = false

  private var lastFrameEventTime: CFTimeInterval = 0

  private var waitingForPrebuffer = false
  private let minBuffersToStart = 2   // 필요시 1~3 사이에서 조정


  // MARK: - Module definition
  public func definition() -> ModuleDefinition {
    Name("MyModule")
    Constants([
      "BUF_PER_SEC": BUF_PER_SEC
    ])

    Events("onChange", "onAudioBuffer", "onMicAudio", "onRecordingSaved", "onAudioRouteChange", "onRecordingReady", "onPlaybackFrame")

    // public API
    Function("startRecording") { self.startRecording() }
    Function("stopRecording") { self.stopRecording() }
    Function("startRealtimePlayback") { self.startRealtimePlayback() }
    Function("stopRealtimePlayback") { self.stopRealtimePlayback() }
    Function("pauseRealtimePlayback") { self.pauseRealtimePlayback() }
    Function("resumeRealtimePlayback") { self.resumeRealtimePlayback() }
    Function("streamPCMData") { (data: Data) in self.streamPCMData(data) }
    Function("playPCMBuffer") { (data: Data) in self.playPCMBuffer(data) }
    Function("activateAudioSession") { self.activateAudioSession() }
    Function("deactivateAudioSession") { self.deactivateAudioSession() }

    // 최초 생성 시 단 한 번 오디오 세션 구성 & 노티 등록
    OnCreate {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.handleAudioRouteChange(_:)),
        name: AVAudioSession.routeChangeNotification,
        object: nil
      )
      print("🔧 MyModule 생성됨 (AudioSession은 아직 비활성)")
    }
  }

  deinit {
    pauseRealtimePlayback()
    stopRecording()
    deactivateAudioSession()
    NotificationCenter.default.removeObserver(self, name: AVAudioSession.routeChangeNotification, object: nil)
  }

  func activateAudioSession() {
    guard !sessionActive else {
      print("⚠️ AudioSession 이미 활성화됨")
      return
    }
    
    do {
      try setupAudioSessionIfNeeded()
      try audioSession.setActive(true)
      sessionActive = true
      print("✅ AudioSession 활성화 완료")
    } catch {
      print("❌ AudioSession 활성화 실패: \(error)")
    }
  }

  func deactivateAudioSession() {
    guard sessionActive else {
      print("⚠️ AudioSession 이미 비활성화됨")
      return
    }
    
    // 진행 중인 작업 정리
    if isPlaying {
      stopRealtimePlayback()
    }
    if audioEngine.isRunning {
      stopRecording()
    }
    
    do {
      try audioSession.setActive(false, options: .notifyOthersOnDeactivation)
      sessionActive = false
      print("✅ AudioSession 비활성화 완료")
    } catch {
      print("⚠️ AudioSession 비활성화 실패 (다른 앱이 사용 중일 수 있음): \(error)")
    }
  }

  // MARK: - AudioSession (one‑time)
  private func setupAudioSessionIfNeeded() throws {
    guard !sessionConfigured else { return }

    try audioSession.setCategory(.playAndRecord,
                                 mode: .voiceChat,
                                 options: [.defaultToSpeaker, .allowBluetooth, .mixWithOthers])
    try audioSession.setPreferredSampleRate(sampleRate)
    try audioSession.setPreferredIOBufferDuration(0.005)

    sessionConfigured = true
    print("🔧 AudioSession configured once (actual SR: \(audioSession.sampleRate))")
  }

  // MARK: - Route‑change handler
  @objc private func handleAudioRouteChange(_ notification: Notification) {
    guard sessionActive else { return } // 세션이 활성화되지 않았으면 무시
    guard let userInfo = notification.userInfo,
          let reasonValue = userInfo[AVAudioSessionRouteChangeReasonKey] as? UInt,
          let reason = AVAudioSession.RouteChangeReason(rawValue: reasonValue) else { return }

    // 첫 route‑change (세션 활성화 직후) 무시
    if !didInitialRouteChangeHandled {
      didInitialRouteChangeHandled = true
      print("👋 최초 오디오 경로 변경 무시 (reason: \(reason))")
      return
    }

    let routeDescription = audioSession.currentRoute.outputs.map { $0.portType.rawValue }.joined(separator: ", ")
    sendEvent("onAudioRouteChange", ["reason": "\(reason)", "newRoute": routeDescription])
  }

  // MARK: - 녹음 -------------------------------------------------------------
  func startRecording() {
    audioSession.requestRecordPermission { granted in
      guard granted else {
        print("❌ 마이크 권한 거부됨")
        return
      }

      DispatchQueue.main.async {
        do {
          if !self.sessionActive {
            self.activateAudioSession()
          }

          let inputNode = self.audioEngine.inputNode
          try? inputNode.setVoiceProcessingEnabled(true)

          let hwFormat = inputNode.inputFormat(forBus: 0)            // 실제 HW 포맷(48 kHz 등)
          let outputFormat = AVAudioFormat(commonFormat: .pcmFormatInt16,
                                           sampleRate: 16_000,
                                           channels: 1,
                                           interleaved: true)!
          self.converter = AVAudioConverter(from: hwFormat, to: outputFormat)

          if inputNode.outputFormat(forBus: 0).channelCount > 0 {
            inputNode.removeTap(onBus: 0)
          }

          inputNode.installTap(onBus: 0, bufferSize: 256, format: hwFormat) { buffer, _ in
            guard let converter = self.converter else { return }

            let frameCapacity = AVAudioFrameCount(Float(buffer.frameLength) * Float(outputFormat.sampleRate / hwFormat.sampleRate))
            guard let convertedBuffer = AVAudioPCMBuffer(pcmFormat: outputFormat, frameCapacity: frameCapacity) else { return }

            var error: NSError?
            let status = converter.convert(to: convertedBuffer, error: &error) { _, outStatus in
              outStatus.pointee = .haveData
              return buffer
            }
            guard status == .haveData, let channelData = convertedBuffer.int16ChannelData else { return }

            let pcmData = Data(bytes: channelData[0], count: Int(convertedBuffer.frameLength) * MemoryLayout<Int16>.size)
            self.sendEvent("onMicAudio", ["pcm": pcmData])
          }

          try self.audioEngine.start()
          print("🎙️ 녹음 시작됨")
          self.sendEvent("onRecordingReady", [:])
        } catch {
          print("❌ 녹음 설정 실패: \(error)")
        }
      }
    }
  }

  func stopRecording() {
    audioEngine.inputNode.removeTap(onBus: 0)
    audioEngine.stop()
    converter = nil
    print("⏹️ 녹음 중지됨")
  }

  // MARK: - 실시간 재생 ------------------------------------------------------
  func startRealtimePlayback() {
    DispatchQueue.main.async {
      do {
        // 재생 시작 시 세션 활성화
        if !self.sessionActive {
          self.activateAudioSession()
        }
        // 🎯[업데이트] 최초 시작 시 무음 버퍼 한 개 삽입 (24 kHz 기준 1/BUF_PER_SEC 초 분량)
        let silenceSampleCount = Int(self.sampleRate / Double(BUF_PER_SEC))
        let silenceData = Data(count: silenceSampleCount * MemoryLayout<Int16>.size)
        self.pcmDataQueue.async {
        if self.pcmBufferQueue.isEmpty {
          self.pcmBufferQueue.append(silenceData)
          print("🔇 무음 버퍼 선삽입 완료 (\(silenceSampleCount) samples)")
          }
        }
        // 🎯[업데이트] 
        self.prepareOutputEngine()
        try self.playerEngine.start()
        self.isPlaying = true
        self.isFirstBlock = true
        self.silenceFramesGenerated = 0
        print("🚀 실시간 재생 시작 (sampleRate: \(self.sampleRate))")
      } catch {
        print("❌ 실시간 재생 시작 실패: \(error)")
      }
    }
  }

  func stopRealtimePlayback() {
    print("⏹️ 실시간 재생 중지")
    isPlaying = false

    if playerEngine.isRunning { playerEngine.stop() }
    if let node = sourceNode {
      playerEngine.disconnectNodeInput(node)
      playerEngine.detach(node)
    }
    sourceNode = nil

    pcmDataQueue.sync {
      currentPCMData?.deallocate(); currentPCMData = nil
      currentDataLength = 0; currentReadPosition = 0
      pcmBufferQueue.removeAll()
      isFirstBlock = true; silenceFramesGenerated = 0
    }

    print("✅ 실시간 재생 정리 완료 (AudioSession 유지)")
  }

  func pauseRealtimePlayback() {
    print("⏸️ 실시간 재생 일시 중지")
    isPlaying = false
    if playerEngine.isRunning { playerEngine.stop() }
    if let node = sourceNode {
      playerEngine.disconnectNodeInput(node)
      playerEngine.detach(node)
    }
    sourceNode = nil
    print("✅ 재생 엔진만 정지 (버퍼 보존됨)")
  }

  func resumeRealtimePlayback() {
    print("▶️ 실시간 재생 재개 시도")
    DispatchQueue.main.async {
      do {
        if !self.sessionActive {
          self.activateAudioSession()
        }
        self.prepareOutputEngine()
        try self.playerEngine.start()
        self.isPlaying = true
        self.isFirstBlock = true
        print("✅ 실시간 재생 재개 성공")
      } catch {
        print("❌ 재생 재개 실패: \(error)")
      }
    }
  }

  private func prepareOutputEngine() {
    // 기존 노드 정리
    if let existing = sourceNode {
      playerEngine.disconnectNodeInput(existing)
      playerEngine.detach(existing)
    }

    // Float32 포맷으로 SourceNode 생성 (24 kHz)
    let format = AVAudioFormat(commonFormat: .pcmFormatFloat32,
                               sampleRate: sampleRate,
                               channels: channels,
                               interleaved: false)!

    sourceNode = AVAudioSourceNode(format: format) { [weak self] _, _, frameCount, audioBufferList in
      return self?.renderAudioFrames(frameCount: frameCount, audioBufferList: audioBufferList) ?? noErr
    }

    guard let node = sourceNode else {
      print("❌ AVAudioSourceNode 생성 실패")
      return
    }

    playerEngine.attach(node)
    playerEngine.connect(node, to: playerEngine.mainMixerNode, format: format)
    print("🎛️ AVAudioSourceNode 설정 완료 (format: \(format))")
  }

  // MARK: - PCM 스트리밍 & 렌더링 -------------------------------------------
func streamPCMData(_ data: Data) {
  guard data.count > 0,
        data.count % MemoryLayout<Int16>.size == 0 else { return }

  pcmDataQueue.async {
    if self.pcmBufferQueue.count < self.maxQueueLength {
      self.pcmBufferQueue.append(data)
    }

    // 아직 재생 준비 중이면, 조건 충족 시 자동 시작
    if self.waitingForPrebuffer,
       self.pcmBufferQueue.count >= self.minBuffersToStart {
      self.waitingForPrebuffer = false
      DispatchQueue.main.async { self.startRealtimePlayback() }
    }
  }
}


func playPCMBuffer(_ pcmData: Data) {
  print("🎧 playPCMBuffer 호출 (\(pcmData.count)B)")

  pcmDataQueue.async {
    self.pcmBufferQueue.append(pcmData)
    // 아직 엔진이 꺼져 있다면 → “대기 모드” 전환
    if !self.isPlaying && !self.waitingForPrebuffer {
      self.waitingForPrebuffer = true
    }

    // Pre-buffer 충족 즉시 startRealtimePlayback() 이 호출될 것
    if self.waitingForPrebuffer,
       self.pcmBufferQueue.count >= self.minBuffersToStart {
      self.waitingForPrebuffer = false
      DispatchQueue.main.async { self.startRealtimePlayback() }
    }
  }
}


  // MARK: - 내부 버퍼 로딩 / 샘플 렌더 --------------------------------------
  private func loadNextBuffer() {
    currentPCMData?.deallocate(); currentPCMData = nil

    if pcmBufferQueue.isEmpty {
      // 무음 채우기 (24 kHz 기준 1/BUF_PER_SEC 초 분량)
      let silenceSampleCount = Int(sampleRate / Double(BUF_PER_SEC))
      let silenceData = Data(count: silenceSampleCount * MemoryLayout<Int16>.size)
      pcmBufferQueue.append(silenceData)
    }

    guard let nextData = pcmBufferQueue.first else {
      currentDataLength = 0; currentReadPosition = 0; return
    }
    pcmBufferQueue.removeFirst()

    let sampleCount = nextData.count / MemoryLayout<Int16>.size
    guard sampleCount > 0 else {
      currentDataLength = 0; currentReadPosition = 0; return
    }

    currentPCMData = UnsafeMutablePointer<Int16>.allocate(capacity: sampleCount)
    currentDataLength = sampleCount
    currentReadPosition = 0

    nextData.withUnsafeBytes { bytes in
      let int16Ptr = bytes.bindMemory(to: Int16.self)
      currentPCMData?.initialize(from: int16Ptr.baseAddress!, count: sampleCount)
    }
  }

  private func renderAudioFrames(frameCount: AVAudioFrameCount, audioBufferList: UnsafeMutablePointer<AudioBufferList>) -> OSStatus {
    let ablPointer = UnsafeMutableAudioBufferListPointer(audioBufferList)
    var accumulatedEnergy: Float = 0.0
    var peakSample: Float = 0.0
    pcmDataQueue.sync {
      for buffer in ablPointer {
        let frameData = buffer.mData!.bindMemory(to: Float.self, capacity: Int(frameCount))

        for frame in 0..<Int(frameCount) {
          var sample: Float = 0.0

          if currentPCMData == nil || currentReadPosition >= currentDataLength {
            loadNextBuffer()
          }

          if let pcm = currentPCMData, currentReadPosition < currentDataLength {
            let int16Sample = pcm[currentReadPosition]
            sample = Float(int16Sample) / 32768.0
            // Soft‑clip headroom
            sample = max(min(sample, 0.95), -0.95)
            currentReadPosition += 1
            silenceFramesGenerated = 0
          } else {
            // 무음 또는 잔향
            sample = (silenceFramesGenerated < maxSilenceFrames) ? 0.0 : previousSample * 0.95
            silenceFramesGenerated += 1
          }

          // 첫 블록 페이드‑인
          if isFirstBlock && frame < fadeLength { sample *= Float(frame) / Float(fadeLength) }

          frameData[frame] = sample
          previousSample = sample

          accumulatedEnergy += sample * sample
          peakSample = max(peakSample, abs(sample))
        }
      }

      if isFirstBlock { isFirstBlock = false }
      let now = CACurrentMediaTime()
      let rms = sqrt(accumulatedEnergy / Float(frameCount))
      if now - lastFrameEventTime > 1.0 / 60.0 && rms > 0  {
        self.sendEvent("onPlaybackFrame", ["level": rms])
        lastFrameEventTime = now
      }
    }
    return noErr
  }
}