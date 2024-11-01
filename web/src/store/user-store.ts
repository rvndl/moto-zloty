import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  id?: string;
  login?: string;
  rank?: string;
  token?: string;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      setState: (userState: UserState) => set(userState),
    }),
    {
      name: "user-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUserStore, type UserState };
