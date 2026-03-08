import { Account } from "@features/account/types/account";
import { UserBar } from "../user-bar";

interface Props {
  account?: Account;
}

const AccountTab = ({ account }: Props) => {
  return (
    <section>
      <UserBar account={account} />
    </section>
  );
};

export { AccountTab };
