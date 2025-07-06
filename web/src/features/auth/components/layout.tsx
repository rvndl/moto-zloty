import { Button } from "@components/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import Logo from "@assets/img/mz-logo-black.png";
import { useRouter } from "next/navigation";

interface Props {
  secondaryLabel: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
}

const Layout = ({
  secondaryLabel,
  secondaryButtonLabel,
  secondaryButtonHref,
  children,
}: PropsWithChildren<Props>) => {
  const router = useRouter();

  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col gap-4 p-6 md:p-10 shadow bg-white">
        <div className="flex justify-center gap-2 md:justify-start relative">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Button
              variant="ghost"
              icon={<ArrowLeftIcon />}
              className="mr-4 absolute md:relative left-0 -top-1 md:top-0"
            />
            <Image
              className="w-auto h-5 cursor-pointer"
              src={Logo.src}
              alt="Moto Zloty"
              title="Moto Zloty"
              onClick={() => router.push("/")}
              width={512}
              height={203}
            />
            Moto Zloty
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
            <div className="flex flex-col gap-1 mt-6">
              <p className="text-sm text-black text-opacity-70">
                {secondaryLabel}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push(secondaryButtonHref)}
              >
                {secondaryButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="-rotate-45 fixed 300vh 300vw -bottom-full -top-full -left-full -right-full hidden lg:block col-span-2 -z-10 opacity-80"
        style={{
          backgroundImage: "url(/auth-tile.webp)",
          backgroundSize: "20vh",
        }}
      ></div>
    </div>
  );
};

export { Layout };
