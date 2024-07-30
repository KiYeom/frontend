import { create } from 'zustand';

const useBirthdateState = create((set) => ({
  birthdate: '',
  setBirthdate: (value) => set((state) => ({ birthdate: value })),
}));
export default useBirthdateState;
