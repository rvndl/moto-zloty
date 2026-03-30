import { type Font } from "satori";

export const INSTAGRAM_WIDTH = 1080;
export const INSTAGRAM_HEIGHT = 1350;

const LOGO_PATH = new URL("../../assets/logo.png", import.meta.url);
const TILE_PATH = new URL("../../assets/tile.png", import.meta.url);

const GEIST_FONT_SOURCES = [
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Thin.ttf", import.meta.url),
    weight: 100,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-ThinItalic.ttf", import.meta.url),
    weight: 100,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-ExtraLight.ttf", import.meta.url),
    weight: 200,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL(
      "../../assets/geist/Geist-ExtraLightItalic.ttf",
      import.meta.url,
    ),
    weight: 200,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Light.ttf", import.meta.url),
    weight: 300,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-LightItalic.ttf", import.meta.url),
    weight: 300,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Regular.ttf", import.meta.url),
    weight: 400,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Italic.ttf", import.meta.url),
    weight: 400,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Medium.ttf", import.meta.url),
    weight: 500,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-MediumItalic.ttf", import.meta.url),
    weight: 500,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-SemiBold.ttf", import.meta.url),
    weight: 600,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL(
      "../../assets/geist/Geist-SemiBoldItalic.ttf",
      import.meta.url,
    ),
    weight: 600,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Bold.ttf", import.meta.url),
    weight: 700,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-BoldItalic.ttf", import.meta.url),
    weight: 700,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-ExtraBold.ttf", import.meta.url),
    weight: 800,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL(
      "../../assets/geist/Geist-ExtraBoldItalic.ttf",
      import.meta.url,
    ),
    weight: 800,
    style: "italic",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-Black.ttf", import.meta.url),
    weight: 900,
    style: "normal",
  },
  {
    name: "Geist",
    path: new URL("../../assets/geist/Geist-BlackItalic.ttf", import.meta.url),
    weight: 900,
    style: "italic",
  },
] as const;

interface CarouselAssets {
  fonts: Font[];
  logoSrc: string;
  tileSrc: string;
}

let cachedAssets: CarouselAssets | null = null;

const fileToDataUrl = async (path: URL, mimeType: string) => {
  const buffer = Buffer.from(await Bun.file(path).arrayBuffer());
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const loadCarouselAssets = async (): Promise<CarouselAssets> => {
  if (cachedAssets) {
    return cachedAssets;
  }

  const [fonts, logoSrc, tileSrc] = await Promise.all([
    Promise.all(
      GEIST_FONT_SOURCES.map(async ({ path, ...font }) => ({
        ...font,
        data: await Bun.file(path).arrayBuffer(),
      })),
    ),
    fileToDataUrl(LOGO_PATH, "image/png"),
    fileToDataUrl(TILE_PATH, "image/png"),
  ]);

  cachedAssets = { fonts, logoSrc, tileSrc };
  return cachedAssets;
};
