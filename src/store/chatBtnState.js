import { create } from 'zustand';
import { USER } from '../constants/Constants';
const useChatBtnState = create((set) => ({
  chatDisable: true,
  setChatDisable: (value) => set((state) => ({ chatDisable: value })),
}));
export default useChatBtnState;
