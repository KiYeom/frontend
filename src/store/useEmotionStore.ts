import { create } from 'zustand';

const useEmotionStore = create((set) => ({
  selectedEmotionKeywords: new Set(),
  allSelectedEmotions: [], //[{'group' : 'sad', 'keyword': '우울한', 'type': 'default'}]
  diaryText: '',
  image: [],
  addEmotion: (emotion) =>
    set((state) => {
      const updatedSet = new Set(state.selectedEmotionKeywords);
      if (!updatedSet.has(emotion.keyword)) {
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
    })),
  setDiaryText: (value: string) => set({ diaryText: value }),
  clearDiaryText: () => set({ diaryText: '' }),
  addImage: (url) => set((state) => ({ image: [...state.image, url] })),
  removeImage: (url) => set((state) => ({ image: state.image.filter((i) => i !== url) })),
  clearImage: () => set({ image: [] }),
}));
export default useEmotionStore;
