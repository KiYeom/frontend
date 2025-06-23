import { NativeModule, requireNativeModule } from 'expo';
import type { StyleProp, ViewStyle } from 'react-native';

// 🔸 이벤트 페이로드 타입 정의
export type ChangeEventPayload = {
  value: string;
};

export type AudioBuffer = {
  samples: number[];
};

export type AudioBufferEvent = {
  samples: number[];
};

export type OnLoadEventPayload = {
  url: string;
};

// 🔸 Native Event 정의
export type MyModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
  onAudioBuffer: (params: AudioBufferEvent) => void;
};

// 🔸 Native View Props 정의
export type MyModuleViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

// 🔸 Native Module 정의
declare class MyModule extends NativeModule<MyModuleEvents> {
  PI: number;

  hello(): string;
  setValueAsync(value: string): Promise<void>;

  startRecording(): void;
  stopRecording(): void;
  getSampleRate(): number;
}

// ✅ 모듈 불러오기
export default requireNativeModule<MyModule>('MyModule');
