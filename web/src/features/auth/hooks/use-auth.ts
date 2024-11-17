import { AccountRank } from "types/account";
import { UserState, useUserStore } from "../store";

const permittedRanks: AccountRank[] = ["ADMIN", "MOD"];

type NonNullableUser = {
  [K in keyof UserState]-?: NonNullable<UserState[K]>;
};

const useAuth = <TSignedIn extends boolean = false>() => {
  const { logout, setState, user } = useUserStore((state) => state);

  const isAuthenticated = Boolean(user.id);
  const isPermitted = user?.rank && permittedRanks.includes(user.rank);
  const isAdmin = user?.rank === "ADMIN";
  const isOwner = (id?: string) => user.id === id;

  const userWithRequiredFields = user as TSignedIn extends true
    ? NonNullableUser
    : UserState;

  return {
    isAuthenticated,
    isOwner,
    isPermitted,
    isAdmin,
    setState,
    logout,
    user: userWithRequiredFields,
  };
};

export { useAuth };
