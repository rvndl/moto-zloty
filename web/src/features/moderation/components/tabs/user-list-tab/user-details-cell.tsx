import { UserIcon } from "@components/icons";
import { Link } from "react-router-dom";
import { AccountWithoutPassword } from "types/account";

interface Props {
  account: AccountWithoutPassword;
}

const UserDetailsCell = ({ account }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Link to={`/account/${account.id}`}>
        <div className="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-accent">
          <UserIcon />
        </div>
      </Link>

      <div className="flex flex-col">
        <Link to={`/account/${account.id}`}>{account.username}</Link>
        <p className="text-sm font-normal text-muted">{account.email}</p>
      </div>
    </div>
  );
};

export { UserDetailsCell };
