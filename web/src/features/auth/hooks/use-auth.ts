import { UserState, useUserStore } from "../store";

type NonNullableUser = {
  [K in keyof UserState]-?: NonNullable<UserState[K]>;
};

const useAuth = <TSignedIn extends boolean = false>() => {
  const { logout, setState, user } = useUserStore((state) => state);

  const isAuthenticated = Boolean(user.id);
  const isOwner = (id?: string) => user.id === id;

  const userWithRequiredFields = user as TSignedIn extends true
    ? NonNullableUser
    : UserState;

  return {
    isAuthenticated,
    isOwner,
    setState,
    logout,
    user: userWithRequiredFields,
  };
};

export { useAuth };
