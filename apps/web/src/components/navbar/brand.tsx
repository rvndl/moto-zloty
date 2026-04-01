import { m } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "@assets/img/mz-logo-black.png";
import { transitionInstant, transitionSpring } from "@utils/transition";

interface Props {
  isFloating: boolean;
  hasMounted: boolean;
}

const Brand = ({ isFloating, hasMounted }: Props) => {
  const router = useRouter();

  const handleOnLogoClick = () => {
    router.push("/");
  };

  return (
    <m.div layout="position" className="flex items-center flex-shrink-0">
      <m.div
        initial={false}
        animate={{ height: isFloating ? 16 : 20 }}
        transition={hasMounted ? transitionSpring : transitionInstant}
      >
        <Image
          className="w-auto h-full cursor-pointer"
          src={Logo.src}
          alt="Moto Zloty"
          title="Moto Zloty"
          onClick={handleOnLogoClick}
          width={512}
          height={203}
        />
      </m.div>
    </m.div>
  );
};

export { Brand };
