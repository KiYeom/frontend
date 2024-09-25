import { create } from 'zustand';

//선택이 된 감정들
const useRecordedEmotionStore = create((set) => ({
  recordedEmotions: [],
  setRecordedEmotions: (value) => set({ recordedEmotions: value }),
}));
export default useRecordedEmotionStore;
