import { RegisterPage, useUserStore } from "@features/auth";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const isLoggedIn = !isEmpty(user);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return null;
  }

  return <RegisterPage />;
}
