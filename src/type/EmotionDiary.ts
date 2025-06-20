//감정 객체 타입 정의
export interface Emotion {
  group: string;
  keyword: string;
  type: 'custom' | 'default';
}
