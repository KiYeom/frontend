import { create } from 'zustand';

const useIsSignInState = create((set) => ({
  isSignIn: false, //로그인 여부 초기 설정
  setIsSignIn: (value) => set((state) => ({ isSignIn: value })),
}));
export default useIsSignInState;
