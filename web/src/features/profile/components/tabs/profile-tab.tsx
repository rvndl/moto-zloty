import { ProfileResponse } from "../../api/types/profile";
import { UserBar } from "../user-bar";

interface Props {
  account?: ProfileResponse;
}

const ProfileTab = ({ account }: Props) => {
  return (
    <section>
      <UserBar account={account} />
    </section>
  );
};

export { ProfileTab };
