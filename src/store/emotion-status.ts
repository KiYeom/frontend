import { create } from 'zustand';

const useEmotionStore = create((set) => ({
  selectedEmotions: [],
  diaryText: '',
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
  setDiaryText: (value) => set({ diaryText: value }),
}));
export default useEmotionStore;
