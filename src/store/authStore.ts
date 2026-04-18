import { create } from "zustand";

interface AuthState {
  jwtToken: string;
  playerId: string;
  isLoginOpen: boolean;

  setAuth: (token: string, playerId: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  jwtToken: "",
  playerId: "",
  isLoginOpen: false,

  setAuth: (jwtToken, playerId) => set({ jwtToken: jwtToken, playerId }),

  openLogin: () => set({ isLoginOpen: true }),

  closeLogin: () => set({ isLoginOpen: false }),
}));
