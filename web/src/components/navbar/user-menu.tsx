import { Dropdown } from "@components/dropdown";
import { LogoutIcon, UserIcon } from "@components/icons";
import { Button } from "@components/ui";
import { UserState } from "@store/user-store";
import { rankToString } from "@utils/user";
import { useNavigate } from "react-router-dom";

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
          onClick: () => navigate(`/profile/${user.id}`),
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
