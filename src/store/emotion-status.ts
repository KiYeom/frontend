import { create } from 'zustand';

//Emotion 객체 타입 정의
export interface Emotion {
  desc?: string;
  group: string;
  keyword: string;
  type?: string; //어떻게 입력된 감정인지 (기본값과 커스텀으로 나뉨 : default, custom)
}

//zustand 스토어 인터페이스 저의
export interface EmotionStore {
  selectedEmotions: Emotion[]; //{"desc": "너무 많거나 강해 감당하기 힘든", "group": "angry", "keyword": "압도된"}
  diaryText: string;
  setSelectedEmotions: (value: Emotion[]) => void;
  addEmotion: (emotion: Emotion) => void;
  removeEmotion: (emotionDetail: string) => void;
  clearEmotions: () => void;
  setDiaryText: (value: string) => void;
}

const useEmotionStore = create<EmotionStore>((set) => ({
  selectedEmotions: [],
  diaryText: '',
  setSelectedEmotions: (value: Emotion[]) => set({ selectedEmotions: value }),
  addEmotion: (emotion) =>
    set((state) => ({
      selectedEmotions: [...state.selectedEmotions, emotion],
    })),
  removeEmotion: (emotionDetail: string) =>
    set((state) => ({
      selectedEmotions: state.selectedEmotions.filter((e) => e.keyword !== emotionDetail),
    })),
  clearEmotions: () => set({ selectedEmotions: [] }),
  setDiaryText: (value: string) => set({ diaryText: value }),
}));
export default useEmotionStore;
