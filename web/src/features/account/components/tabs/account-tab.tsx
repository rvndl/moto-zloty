import { AccountResponse } from "../../api/types/account";
import { UserBar } from "../user-bar";

interface Props {
  account?: AccountResponse;
}

const AccountTab = ({ account }: Props) => {
  return (
    <section>
      <UserBar account={account} />
    </section>
  );
};

export { AccountTab };
