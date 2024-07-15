import { create } from "zustand";
const useNotificationState = create((set) => ({
  isSwitchOn : false,
  setIsSwitchOn : (value) => set((state) => ({isSwitchOn : value})),
}));
export default useNotificationState;