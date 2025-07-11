import ExpoModulesCore
import AVFoundation

let BUF_PER_SEC = 15

public class MyModule: Module {
  // MARK: - Audio session & engines
  private let audioSession = AVAudioSession.sharedInstance()
  private var sessionConfigured = false          // ✅ 세션은 최초 1회만 설정
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

    // 최초 생성 시 단 한 번 오디오 세션 구성 & 노티 등록
    OnCreate {
      do {
        try self.setupAudioSessionIfNeeded()
      } catch {
        print("❌ AudioSession 초기화 실패: \(error)")
      }

      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.handleAudioRouteChange(_:)),
        name: AVAudioSession.routeChangeNotification,
        object: nil
      )
    }
  }

  deinit {
    pauseRealtimePlayback()
    stopRecording()
    NotificationCenter.default.removeObserver(self, name: AVAudioSession.routeChangeNotification, object: nil)
  }

  // MARK: - AudioSession (one‑time)
  private func setupAudioSessionIfNeeded() throws {
    guard !sessionConfigured else { return }

    try audioSession.setCategory(.playAndRecord,
                                 mode: .voiceChat,
                                 options: [.defaultToSpeaker, .allowBluetooth, .mixWithOthers])
    try audioSession.setPreferredSampleRate(sampleRate)
    try audioSession.setPreferredIOBufferDuration(0.005)
    try audioSession.setActive(true)               // 👉 단 한 번만 활성화

    sessionConfigured = true
    print("🔧 AudioSession configured once (actual SR: \(audioSession.sampleRate))")
  }

  // MARK: - Route‑change handler
  @objc private func handleAudioRouteChange(_ notification: Notification) {
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
          try self.setupAudioSessionIfNeeded()   // 이미 구성됐다면 no‑op

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
        try self.setupAudioSessionIfNeeded()     // 이미 구성됐다면 no‑op
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
        try self.setupAudioSessionIfNeeded()   // no‑op if already done
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
    guard isPlaying else {
      print("⚠️ 재생 중이 아니므로 데이터 무시됨")
      return
    }
    guard data.count > 0 && data.count % MemoryLayout<Int16>.size == 0 else {
      print("❌ 잘못된 PCM 데이터 형식")
      return
    }

    pcmDataQueue.async {
      if self.pcmBufferQueue.count < self.maxQueueLength {
        self.pcmBufferQueue.append(data)
        self.silenceFramesGenerated = 0
      } else {
        print("⚠️ 버퍼 가득 참 → 새 데이터 무시")
      }
    }
  }

  func playPCMBuffer(_ pcmData: Data) {
    print("🎧 playPCMBuffer 호출됨 (\(pcmData.count) bytes)")
    if !isPlaying {
      startRealtimePlayback()
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        self.streamPCMData(pcmData)
      }
    } else {
      streamPCMData(pcmData)
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