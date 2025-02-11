import { UserIcon } from "@components/icons";
import Link from "next/link";
import { AccountWithoutPassword } from "types/account";

interface Props {
  account: AccountWithoutPassword;
}

const UserDetailsCell = ({ account }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/account/${account.id}`}>
        <div className="flex items-center justify-center p-2 rounded-full bg-accent">
          <UserIcon className="scale-[0.68]" />
        </div>
      </Link>

      <div className="flex flex-col">
        <Link href={`/account/${account.id}`}>{account.username}</Link>
        <p className="text-sm font-normal text-muted">{account.email}</p>
      </div>
    </div>
  );
};

export { UserDetailsCell };
