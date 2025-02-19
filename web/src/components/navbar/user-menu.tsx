import { Button, Dropdown } from "@components";
import { rankToString } from "@utils/user";
import { UserState } from "@features/auth";
import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";

interface Props {
  user: UserState;
  logout: () => void;
}

const UserMenu = ({ user, logout }: Props) => {
  const router = useRouter();

  return (
    <Dropdown
      trigger={
        <Button variant="ghost" className="shrink-0">
          <UserIcon className="shrink-0" />
        </Button>
      }
      items={[
        {
          label: "Profil",
          icon: <UserIcon />,
          onClick: () => router.push(`/account/${user.id}`),
        },
        {
          label: "Wyloguj",
          icon: <LogOutIcon />,
          onClick: logout,
        },
      ]}
      header={
        <div className="px-2 py-1 leading-tight">
          <p className="text-sm font-semibold text-black">{user.username}</p>
          <p className="text-xs text-black text-opacity-70">
            {rankToString(user.rank)}
          </p>
        </div>
      }
    />
  );
};

export { UserMenu };
