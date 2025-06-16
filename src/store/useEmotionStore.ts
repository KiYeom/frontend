import { create } from 'zustand';
import { MAX_SELECTED_EMOTION_COUNT } from '../constants/Constants';

const useEmotionStore = create((set, get) => ({
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
  //clearEmotions: () => set({ selectedEmotionKeywords: new Set(), allSelectedEmotions: []
  clearEmotions: () =>
    set(() => ({
      selectedEmotionKeywords: new Set(),
      allSelectedEmotions: [],
      selectedCount: 0, // 개수 초기화
    })),
  setDiaryText: (value: string) => set({ diaryText: value }),
  clearDiaryText: () => set({ diaryText: '' }),
  addImage: (url) => set((state) => ({ image: [...state.image, url] })),
  removeImage: (url) => set((state) => ({ image: state.image.filter((i) => i !== url) })),
  clearImage: () => set({ image: [] }),
}));
export default useEmotionStore;
