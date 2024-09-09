import { create } from 'zustand';

const useEmotionStore = create((set) => ({
  selectedEmotions: [],
  addEmotion: (emotion) =>
    set((state) => ({
      selectedEmotions: [...state.selectedEmotions, emotion],
    })),
  removeEmotion: (emotionDetail) =>
    set((state) => ({
      selectedEmotions: state.selectedEmotions.filter((e) => e.detail !== emotionDetail),
    })),
  clearEmotions: () => set({ selectedEmotions: [] }),
}));

export default useEmotionStore;
