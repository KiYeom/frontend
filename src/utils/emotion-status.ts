import { create } from 'zustand';

const useEmotionStore = create((set) => ({
  selectedEmotions: [],
  setSelectedEmotions: (value) => set({ selectedEmotions: value }),
  addEmotion: (emotion) =>
    set((state) => ({
      selectedEmotions: [...state.selectedEmotions, emotion],
    })),
  removeEmotion: (emotionDetail) =>
    set((state) => ({
      selectedEmotions: state.selectedEmotions.filter((e) => e.keyword !== emotionDetail),
    })),
  clearEmotions: () => set({ selectedEmotions: [] }),
}));
export default useEmotionStore;
