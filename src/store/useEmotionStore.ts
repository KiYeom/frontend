import { create } from 'zustand';

const useMemosStore = create((set) => ({
  selectedEmotionKeywords: new Set(),
  allSelectedEmotions: [],
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
}));
export default useMemosStore;
