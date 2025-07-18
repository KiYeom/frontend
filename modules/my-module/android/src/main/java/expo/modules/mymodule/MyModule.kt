package expo.modules.mymodule

import android.content.Context
import android.content.pm.PackageManager
import android.media.*
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.*
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.ConcurrentLinkedQueue
import android.media.audiofx.AcousticEchoCanceler

class MyModule : Module() {
  enum class MicState {
    IDLE,
    RECORDING,
    MUTED_AUTO,
    MUTED_MANUAL
  }
  @Volatile private var micState = MicState.IDLE
  @Volatile private var waitingForPrebuffer = true
  private val BUF_PER_SEC = 15
  private val sampleRate = 24000
  private val channels = 1
  private val maxQueueLength = 100
  private val fadeLength = 64
  private val maxSilenceFrames = 1024

  private var audioTrack: AudioTrack? = null
  private var audioRecord: AudioRecord? = null
  private var isPlaying = false
  private var isFirstBlock = true
  private var silenceFramesGenerated = 0
  private var previousSample: Float = 0f

  private val pcmBufferQueue: ConcurrentLinkedQueue<ByteArray> = ConcurrentLinkedQueue()
  private val taggedBufferQueue: ConcurrentLinkedQueue<TaggedAudio> = ConcurrentLinkedQueue()

  private var playbackJob: Job? = null
  private var recordJob: Job? = null
  private var micAutoControlJob: Job? = null

  private var currentPCMData: ShortArray? = null
  private var currentDataLength: Int = 0
  private var currentReadPosition: Int = 0

  //@Volatile private var isRecording = false
  private var micManuallyMuted = false

  private var lastPlaybackEventTime = System.currentTimeMillis()

  private val minBuffersToStart = 2 


  data class TaggedAudio(val data: ByteArray, val isSilent: Boolean)

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Constants("BUF_PER_SEC" to BUF_PER_SEC)

    Events("onChange", "onAudioBuffer", "onMicAudio", "onRecordingSaved", "onAudioRouteChange", "onRecordingReady")

    Function("startRecording") { startRecording() }
    Function("stopRecording") { stopRecording() }
    Function("startRealtimePlayback") { startRealtimePlayback() }
    Function("stopRealtimePlayback") { stopRealtimePlayback() }
    Function("streamPCMData") { data: ByteArray -> streamPCMData(data) }
    Function("playPCMBuffer") { data: ByteArray -> playPCMBuffer(data) }
    Function("pauseRealtimePlayback") { pauseRealtimePlayback() }
    Function("resumeRealtimePlayback") { resumeRealtimePlayback() }
    Function("hello") { "Hello world! 👋" }
  }

  private fun hasRecordAudioPermission(): Boolean {
    val context = appContext.reactContext
    return context?.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) ==
      PackageManager.PERMISSION_GRANTED
  }

  private fun startRealtimePlayback() {
    Log.d("MyModule", "▶️ startRealtimePlayback() 호출됨")
    muteMicrophone()

    // ✅ AudioTrack만 초기화하고 재생은 하지 않음
    val bufferSize = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT)
    val actualBufferSize = maxOf(bufferSize, sampleRate / 10)

    audioTrack = AudioTrack(
      AudioManager.STREAM_MUSIC,
      sampleRate,
      AudioFormat.CHANNEL_OUT_MONO,
      AudioFormat.ENCODING_PCM_16BIT,
      actualBufferSize,
      AudioTrack.MODE_STREAM
    )

    // ✅ 재생은 버퍼가 충분히 쌓일 때까지 대기
    isPlaying = false
    waitingForPrebuffer = true
  }

  private fun resumeRealtimePlayback() {
    Log.d("MyModule", "🔄 resumeRealtimePlayback() 시작")
    audioTrack?.play()
    val hasAudioBuffers = taggedBufferQueue.any { !it.isSilent }
    Log.d("MyModule", "📊 버퍼 상태 - 음성 버퍼 존재: $hasAudioBuffers, 큐 크기: ${taggedBufferQueue.size}")
    // MUTED_MANUAL 상태를 MUTED_AUTO로 변경
    if (micState == MicState.MUTED_MANUAL || micState == MicState.IDLE) {
      micState = MicState.MUTED_AUTO
      Log.d("MyModule", "🔄 micState를 MUTED_AUTO로 변경 (이전: $micState)")
    }
    if (playbackJob == null || !playbackJob!!.isActive) {
      Log.d("MyModule", "🎵 새로운 playbackJob 시작")
      isPlaying = true
      playbackJob = CoroutineScope(Dispatchers.IO).launch {
        val frameSize = 1024
        val outputBuffer = ShortArray(frameSize)
        while (isPlaying) {
          val samplesWritten = renderAudioFrames(outputBuffer, frameSize)
          if (samplesWritten > 0) {
            audioTrack?.write(outputBuffer, 0, samplesWritten)
          } else {
            delay(5)
          }
        }
      }
    } else {
      Log.d("MyModule", "♻️ 기존 playbackJob 재사용")
      isPlaying = true
    }
    Log.d("MyModule", "🎯 startMicAutoController 호출 전 - micAutoControlJob: ${micAutoControlJob?.isActive}, isPlaying: $isPlaying")
    startMicAutoController()
  }

  private fun pauseRealtimePlayback() {
    Log.d("MyModule", "⏸️ pauseRealtimePlayback() 시작 - 현재 micState: $micState")
    isPlaying = false
    audioTrack?.pause()
    Log.d("MyModule", "🛑 micAutoControlJob 취소")
    micAutoControlJob?.cancel()

    if (micState == MicState.RECORDING) {
      stopRecording()
      micState = MicState.MUTED_MANUAL
      Log.d("MyModule", "🔚 수동으로 마이크 끝내지기")
    }
    Log.d("MyModule", "📊 일시정지 시 버퍼 상태 - pcm: ${pcmBufferQueue.size}, tagged: ${taggedBufferQueue.size}")
  }

  private fun stopRealtimePlayback() {
    Log.d("MyModule", "⏹️ stopRealtimePlayback() 호출됨")
    isPlaying = false
    playbackJob?.cancel()
    micAutoControlJob?.cancel()
    audioTrack?.stop()
    audioTrack?.release()
    audioTrack = null
    playbackJob = null
    micAutoControlJob = null
    pcmBufferQueue.clear()
    taggedBufferQueue.clear()
    currentPCMData = null
    currentReadPosition = 0
    currentDataLength = 0
    isFirstBlock = true
    silenceFramesGenerated = 0

    unmuteMicrophone()
    waitingForPrebuffer = true
  }

  private fun streamPCMData(data: ByteArray) {
    if (data.isEmpty() || data.size % 2 != 0) return

    if (pcmBufferQueue.size < maxQueueLength) {
      val isSilent = isSilentBuffer(data)
      taggedBufferQueue.offer(TaggedAudio(data, isSilent))
      pcmBufferQueue.offer(data)
      silenceFramesGenerated = 0
      Log.d("MyModule", "📡 ${if (isSilent) "무음" else "음성"} 버퍼 추가됨 (${data.size} bytes) - 현재 큐 크기: ${pcmBufferQueue.size}")

      // ✅ 버퍼가 충분히 쌓이고 대기 중이면 자동 시작
      if (waitingForPrebuffer && pcmBufferQueue.size >= minBuffersToStart) {
        waitingForPrebuffer = false
        Log.d("MyModule", "✅ 버퍼 ${pcmBufferQueue.size}개 확보 → 재생 시작")
        
        // AudioTrack 준비 및 재생 시작
        audioTrack?.play()
        isPlaying = true

        playbackJob = CoroutineScope(Dispatchers.IO).launch {
          val frameSize = 1024
          val outputBuffer = ShortArray(frameSize)
          while (isPlaying) {
            val samplesWritten = renderAudioFrames(outputBuffer, frameSize)
            if (samplesWritten > 0) {
              audioTrack?.write(outputBuffer, 0, samplesWritten)
            } else {
              delay(5)
            }
          }
        }

        startMicAutoController()
      }
    } else {
      Log.w("MyModule", "⚠️ 버퍼 가득 참 → 새 데이터 무시")
    }
  }

  private fun playPCMBuffer(data: ByteArray) {
    Log.d("MyModule", "🎧 playPCMBuffer 호출됨 (${data.size} bytes)")
    
    // ✅ AudioTrack이 없으면 초기화
    if (audioTrack == null) {
      startRealtimePlayback()
    }
    
    // ✅ 데이터를 큐에 추가 (streamPCMData가 자동으로 재생 시작을 처리)
    streamPCMData(data)
  }

  private fun renderAudioFrames(outputBuffer: ShortArray, frameCount: Int): Int {
    if (!isPlaying) return 0
    var samplesProvided = 0
    var accumulatedEnergy = 0.0

    for (frame in 0 until frameCount) {
      var sample: Float = 0f
      var hasData = false

      if (currentPCMData == null || currentReadPosition >= currentDataLength) {
        loadNextBuffer()
      }

      currentPCMData?.let { pcmData ->
        if (currentReadPosition < currentDataLength) {
          val int16Sample = pcmData[currentReadPosition]
          sample = int16Sample / 32768f
          currentReadPosition++
          hasData = true
          samplesProvided++
          sample = sample.coerceIn(-0.95f, 0.95f)
          silenceFramesGenerated = 0
        }
      }

      if (!hasData) {
        sample = if (silenceFramesGenerated < maxSilenceFrames) {
          silenceFramesGenerated++
          0f
        } else {
          previousSample * 0.95f
        }
      }

      if (isFirstBlock && frame < fadeLength) {
        sample *= frame.toFloat() / fadeLength
      }

      outputBuffer[frame] = (sample * 32767).toInt().toShort()
      previousSample = sample
      accumulatedEnergy += (sample * sample)
    }

    if (isFirstBlock && samplesProvided > 0) {
      isFirstBlock = false
      Log.d("MyModule", "🎵 첫 번째 오디오 블록 재생 시작")
    }
    
    val rms = kotlin.math.sqrt(accumulatedEnergy / frameCount)
    val now = System.currentTimeMillis()
    if (rms > 0.0002 && now - lastPlaybackEventTime > 16) {
      emit("onPlaybackFrame", mapOf("level" to rms))
      lastPlaybackEventTime = now
    }

    return frameCount
  }

  private fun loadNextBuffer() {
    currentPCMData = null

    if (pcmBufferQueue.isEmpty()) {
      val silenceSampleCount = sampleRate / BUF_PER_SEC
      val silenceBuffer = ByteArray(silenceSampleCount * 2)
      pcmBufferQueue.offer(silenceBuffer)
      taggedBufferQueue.offer(TaggedAudio(silenceBuffer, true))
      //Log.d("MyModule", "🤫 버퍼 없음 → 무음 추가됨 (${silenceBuffer.size} bytes)")
    }

    val nextData = pcmBufferQueue.poll() ?: return
    val sampleCount = nextData.size / 2

    if (sampleCount <= 0) {
      Log.w("MyModule", "⚠️ 빈 PCM 데이터 건너뜀")
      currentDataLength = 0
      currentReadPosition = 0
      return
    }

    val byteBuffer = ByteBuffer.wrap(nextData).order(ByteOrder.LITTLE_ENDIAN)
    currentPCMData = ShortArray(sampleCount)
    byteBuffer.asShortBuffer().get(currentPCMData!!)

    currentDataLength = sampleCount
    currentReadPosition = 0

    Log.d("MyModule", "🔄 새 버퍼 로드: $sampleCount 샘플 (${nextData.size} bytes)")
  }

  private fun isSilentBuffer(data: ByteArray): Boolean {

    val shortBuffer = ShortArray(data.size / 2)
    ByteBuffer.wrap(data).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer().get(shortBuffer)

    val rms = shortBuffer
      .map { it.toFloat() / 32768f }
      .map { it * it }
      .average()
    Log.d("MyModule", "isSilentBuffer 반환값 : ${rms < 0.0002}")
    return rms < 0.0002
  }

  private fun startMicAutoController() {
    // 기존 Job이 활성화되어 있으면 취소
    if (micAutoControlJob?.isActive == true) {
      Log.d("MyModule", "⚠️ 기존 micAutoControlJob 활성화 중 - 취소 후 재시작")
      micAutoControlJob?.cancel()
    }
    micAutoControlJob = CoroutineScope(Dispatchers.Default).launch {
      var silentCounter = 0
      val silentThreshold = 5
      Log.d("MyModule", "🧠 startMicAutoController 루프 시작됨")
      while (isPlaying) {
        val tagged = taggedBufferQueue.poll()
        if (tagged != null) {
          Log.d("MyModule", "tagged.isSilent : ${tagged.isSilent}")
          if (tagged.isSilent) {
            silentCounter++
            //Log.d("MyModule", "🤫 무음 감지됨 ($silentCounter / $silentThreshold)")
            if (silentCounter >= silentThreshold && micState == MicState.MUTED_AUTO) {
              Log.d("MyModule", "🔊 무음 지속 → 마이크 자동 켜짐 시도")
              unmuteMicrophone()
            }
          } else {
            Log.d("MyModule", "🎤 음성 감지됨")
            if (micState == MicState.RECORDING) {
              Log.d("MyModule", "🔇 음성 감지 → 마이크 자동 끔 시도")
              muteMicrophone()
            }
            silentCounter = 0
          }
        } else {
          Log.d("MyModule", "📭 taggedBufferQueue 비어 있음")
        }
        delay(50)
      }
    }
  }

  private fun startRecording() {
    if (!hasRecordAudioPermission()) {
      Log.e("MyModule", "❌ RECORD_AUDIO 권한이 없습니다.")
      emit("onMicAudio", mapOf("error" to "permission_denied"))
      return
    }
    if (micState == MicState.RECORDING) {
      Log.d("MyModule", "⚠️ 이미 논음 중")
      return
    }

    val minBuffer = AudioRecord.getMinBufferSize(16000, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
    audioRecord = AudioRecord(
      MediaRecorder.AudioSource.VOICE_COMMUNICATION,
      16000,
      AudioFormat.CHANNEL_IN_MONO,
      AudioFormat.ENCODING_PCM_16BIT,
      minBuffer
    )
    if (AcousticEchoCanceler.isAvailable()) {
      AcousticEchoCanceler.create(audioRecord!!.audioSessionId)?.enabled = true
      Log.d("MyModule", "🔇 AEC 활성화됨")
    }
    audioRecord?.startRecording()
    micState = MicState.RECORDING
    emit("onRecordingReady", emptyMap<String, Any?>())
    recordJob = CoroutineScope(Dispatchers.IO).launch {
      val buffer = ByteArray(1024)
      while (isActive && micState == MicState.RECORDING) {
        val localRecorder = audioRecord
        if (localRecorder == null) {
          Log.w("MyModule", "⚠️ audioRecord is null — 루프 중단")
          break
        }

        val read = localRecorder.read(buffer, 0, buffer.size, AudioRecord.READ_NON_BLOCKING)
        //Log.d("MyModule", "🎹 read=$read, micState=$micState")
        if (read > 0) {
          emit("onMicAudio", mapOf("pcm" to buffer.copyOf(read)))
        }
      }
      Log.d("MyModule", "🧵 recordJob 루프 종료")
    }
  }
  
  private fun stopRecording() {
    Log.d("MyModule", "🔵 stopRecording() 호출됨, 이전 상태: $micState")

    try {
      audioRecord?.stop()
      audioRecord?.release()
    } catch (e: Exception) {
      Log.e("MyModule", "❌ 마이크 중징 실패: ${e.message}")
    }

    recordJob?.cancel()
    audioRecord = null
    micState = MicState.IDLE

    Log.d("MyModule", "🚩 마이크 상태 → IDLE")
  }

  private fun muteMicrophone() {
    if (micState == MicState.RECORDING) {
      stopRecording()
      micState = MicState.MUTED_AUTO
      Log.d("MyModule", "🔇 자동 음소거")
    }
  }

  private fun unmuteMicrophone() {
    Log.d("MyModule", "🎙️ unmuteMicrophone() 호출 - 현재 상태: $micState")
    if (micState == MicState.MUTED_AUTO) {
      Log.d("MyModule", "✅ MUTED_AUTO 상태 확인 → 마이크 시작")
      startRecording()
      micState = MicState.RECORDING
      Log.d("MyModule", "🎙️ 자동으로 마이크 재시작")
    } else {
      Log.d("MyModule", "🙅️ 수동 음소거 상태이로 재시작 안함..")
    }
  }
  
  private fun emit(event: String, data: Any?) {
    try {
      when (data) {
        is Map<*, *> -> {
          @Suppress("UNCHECKED_CAST")
          sendEvent(event, data as Map<String, Any?>)
        }
        null -> sendEvent(event, mapOf<String, Any?>())
        else -> sendEvent(event, mapOf("value" to data))
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}