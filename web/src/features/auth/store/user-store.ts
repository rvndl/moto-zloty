import { AccountRank } from "types/account";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  id?: string;
  username?: string;
  rank?: AccountRank;
  token?: string;
}

interface StoreState {
  user: UserState;
  setState: (userState: UserState) => void;
  logout: () => void;
}

const useUserStore = create(
  persist<StoreState>(
    (set) => ({
      user: {},
      setState: (userState: UserState) => set({ user: userState }),
      logout: () => set({ user: {} }),
    }),
    {
      name: "user-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUserStore, type UserState };
