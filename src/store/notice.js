import { create } from 'zustand';

const useNoticeState = create((set) => ({
  notice: null,
  setNotice: (value) => set((state) => ({ notice: value })),
}));
export default useNoticeState;
