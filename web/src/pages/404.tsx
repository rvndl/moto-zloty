import { Button } from "@components/button";
import { Metadata } from "@components";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <Metadata title="Nie znaleziono strony" />
      <div className="flex flex-col items-center justify-center mt-16">
        <h1 className="text-4xl font-bold text-center">404</h1>
        <p className="text-center text-muted">Strona nie została znaleziona</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Wróć do strony głównej
        </Button>
      </div>
    </>
  );
}
