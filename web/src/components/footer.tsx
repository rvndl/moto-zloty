import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-row items-center justify-center w-full gap-8 p-2 border-t shadow-sm text-primary">
      <p className="text-sm font-medium">&copy; Moto-Zloty.pl</p>
      <div className="flex items-center justify-center gap-3 text-sm text-muted">
        <Link href="/privacy">Polityka prywatności</Link>
        <Link href="/contact">Kontakt</Link>
      </div>
    </footer>
  );
};

export { Footer };
