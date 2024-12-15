import { LogoutIcon, UserIcon, Button, Dropdown } from "@components";
import { rankToString } from "@utils/user";
import { useNavigate } from "react-router-dom";
import { UserState } from "@features/auth";

interface Props {
  user: UserState;
  logout: () => void;
}

const UserMenu = ({ user, logout }: Props) => {
  const navigate = useNavigate();

  return (
    <Dropdown
      trigger={
        <Button variant="ghost">
          <UserIcon />
        </Button>
      }
      items={[
        {
          label: "Profil",
          icon: <UserIcon />,
          onClick: () => navigate(`/account/${user.id}`),
        },
        {
          label: "Wyloguj",
          icon: <LogoutIcon />,
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
