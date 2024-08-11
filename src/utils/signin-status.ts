import { create } from 'zustand';

type SigninStatus = {
  SigninStatus: boolean;
  setSigninStatus: (newState: boolean) => void;
};

export const UseSigninStatus = create<SigninStatus>()((set) => ({
  SigninStatus: false,
  setSigninStatus: (newState) => {
    set(() => ({ SigninStatus: newState }));
  },
}));
