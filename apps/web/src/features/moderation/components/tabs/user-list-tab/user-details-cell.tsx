import { UserIcon } from "lucide-react";
import Link from "next/link";
import { AccountWithoutPassword } from "types/account";

interface Props {
  account: AccountWithoutPassword;
}

const UserDetailsCell = ({ account }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/uzytkownik/${account.id}`}>
        <div className="flex items-center justify-center p-2 rounded-full bg-accent">
          <UserIcon />
        </div>
      </Link>

      <div className="flex flex-col">
        <Link href={`/uzytkownik/${account.id}`}>{account.username}</Link>
        <p className="text-sm font-normal text-muted">{account.email}</p>
      </div>
    </div>
  );
};

export { UserDetailsCell };
