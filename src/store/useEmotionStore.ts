import { create } from 'zustand';
import { MAX_SELECTED_EMOTION_COUNT } from '../constants/Constants';
//사용자가 선택한 Emotion 타입 정의
export type EmotionGroup = 'angry' | 'sad' | 'happy' | 'calm';
export interface Emotion {
  group: EmotionGroup;
  keyword: string;
  type: 'custom' | 'default';
}

//감정 목록 테이블 타입
export interface SelectableEmotion {
  group: EmotionGroup;
  keyword: string;
  desc: string;
}

// 서버 데이터 타입 정의
export interface ServerData {
  emotions?: Emotion[];
  Keywords?: Emotion[];
  text?: string;
  todayFeeling?: string;
  images?: string[];
}

interface EmotionStore {
  selectedEmotionKeywords: Set<string>;
  allSelectedEmotions: Emotion[];
  diaryText: string;
  image: string[];

  addEmotion: (emotion: Emotion) => void;
  removeEmotion: (keyword: string) => void;
  initializeFromServerData: (serverData: ServerData) => void;
  clearEmotions: () => void;
  setDiaryText: (value: string) => void;
  clearDiaryText: () => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  clearImage: () => void;

  getSelectedEmotionCount: () => number;
}

const useEmotionStore = create<EmotionStore>((set, get) => ({
  selectedEmotionKeywords: new Set(),
  allSelectedEmotions: [], //[{'group' : 'sad', 'keyword': '우울한', 'type': 'default'}]
  diaryText: '',
  image: [],
  addEmotion: (emotion) =>
    set((state) => {
      const updatedSet = new Set(state.selectedEmotionKeywords);
      if (
        !updatedSet.has(emotion.keyword) &&
        state.selectedEmotionKeywords.size < MAX_SELECTED_EMOTION_COUNT
      ) {
        updatedSet.add(emotion.keyword);
        return {
          selectedEmotionKeywords: updatedSet,
          allSelectedEmotions: [...state.allSelectedEmotions, emotion],
        };
      }
      return state;
    }),
  removeEmotion: (keyword) =>
    set((state) => {
      const updatedSet = new Set(state.selectedEmotionKeywords);
      if (updatedSet.has(keyword)) {
        updatedSet.delete(keyword);
        return {
          selectedEmotionKeywords: updatedSet,
          allSelectedEmotions: state.allSelectedEmotions.filter((e) => e.keyword !== keyword),
        };
      }
      return state;
    }),
  // 서버 데이터로 폼 초기화
  initializeFromServerData: (serverData) => {
    console.log('🔄 스토어 초기화 시작:', serverData);

    try {
      // 서버 데이터 구조에 맞게 변환
      const emotions = serverData.emotions || serverData.Keywords || [];
      const diaryText = serverData.text || serverData.todayFeeling || '';
      const images = serverData.images || [];
      const keywordsSet = new Set(emotions.map((emotion) => emotion.keyword));

      set({
        selectedEmotionKeywords: keywordsSet,
        allSelectedEmotions: emotions,
        diaryText: diaryText,
        image: images,
      });

      console.log('🔄 스토어 초기화 완료');
      console.log('설정된 감정 키워드 Set:', keywordsSet);
      console.log('설정된 감정들:', emotions);
      console.log('설정된 일기 텍스트:', diaryText);
    } catch (error) {
      console.error('🔄 스토어 초기화 중 에러:', error);
      throw error;
    }
  },
  clearEmotions: () =>
    set(() => ({
      selectedEmotionKeywords: new Set(),
      allSelectedEmotions: [],
    })),
  setDiaryText: (value: string) => set({ diaryText: value }),
  clearDiaryText: () => set({ diaryText: '' }),
  addImage: (url) => set((state) => ({ image: [...state.image, url] })),
  removeImage: (url) => set((state) => ({ image: state.image.filter((i) => i !== url) })),
  clearImage: () => set({ image: [] }),

  getSelectedEmotionCount: () => get().selectedEmotionKeywords.size,
}));
export default useEmotionStore;
