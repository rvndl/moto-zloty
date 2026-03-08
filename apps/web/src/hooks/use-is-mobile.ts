import { useMediaQuery } from "./use-mediaquery";

const useIsMobile = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile;
};

export { useIsMobile };
