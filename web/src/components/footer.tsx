import Image from "next/image";
import Logo from "@assets/img/mz-logo-black.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full mt-auto border-t shadow-sm text-primary">
      <div className="grid w-full gap-4 px-8 py-6 mx-auto text-sm font-normal max-w-7xl">
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
        <p className="text-xs text-muted">&copy; Moto-Zloty.pl</p>
      </div>
    </footer>
  );
};

export { Footer };
