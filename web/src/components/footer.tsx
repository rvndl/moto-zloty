import Image from "next/image";
import Logo from "@assets/img/mz-logo-black.png";
import Link from "next/link";
import clsx from "clsx";

interface Props {
  variant?: "light" | "dark";
}

const Footer = ({ variant = "light" }: Props) => {
  return (
    <footer
      className={clsx(
        "w-full mt-auto border-t shadow-sm text-primary bg-white",
        variant === "dark" && "invert",
      )}
    >
      <div className="grid w-full gap-4 px-6 md:px-8 py-6 mx-auto text-sm font-normal max-w-7xl">
        <div className="flex gap-4 text-sm font-normal">
          <Image
            src={Logo}
            alt="Moto-Zloty.pl"
            title="Moto-Zloty.pl"
            className="h-fit"
            width={50}
            height={20}
          />
          <Link href="/">Strona główna</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/prywatnosc">Polityka prywatności</Link>
        </div>
        <p className="text-xs text-muted font-medium">&copy; Moto-Zloty.pl</p>
      </div>
    </footer>
  );
};

export { Footer };
