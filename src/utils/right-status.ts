import { create } from 'zustand';

type RightStatus = {
  RightStatus: boolean;
  setRightStatus: (newState: boolean) => void;
};

export const UseRightStatus = create<RightStatus>()((set) => ({
  RightStatus: false,
  setRightStatus: (newState) => {
    set(() => ({ RightStatus: newState }));
  },
}));
