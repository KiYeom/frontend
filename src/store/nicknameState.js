import { create } from "zustand";
import { USER } from "../constants/Constants";
const useNicknameState = create((set) => ({
  nickname : USER.nickname,
  setNickname : (value) => set((state) => ({nickname : value})),
}));
export default useNicknameState;

