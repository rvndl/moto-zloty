import { Button } from "@components/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <h1 className="text-4xl font-bold text-center">404</h1>
      <p className="text-center text-muted">Strona nie została znaleziona</p>
      <Button className="mt-6" onClick={() => navigate("/")}>
        Wróć do strony głównej
      </Button>
    </div>
  );
};

export { NotFoundPage };
