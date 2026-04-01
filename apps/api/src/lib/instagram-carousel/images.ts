import sharp from "sharp";

const DEFAULT_EVENT_IMAGE_SIZE = 160;
const FALLBACK_IMAGE_BACKGROUND = "#111827";

const buildPlaceholderImage = async (size: number) => {
  const buffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: FALLBACK_IMAGE_BACKGROUND,
    },
  })
    .png()
    .toBuffer();

  return `data:image/png;base64,${buffer.toString("base64")}`;
};

export const prepareEventImageDataUrl = async (
  imageUrl: string,
  size = DEFAULT_EVENT_IMAGE_SIZE,
) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return buildPlaceholderImage(size);
    }

    const reponseArrayBuffer = await response.arrayBuffer();
    const reponseBuffer = Buffer.from(reponseArrayBuffer);

    const buffer = await sharp(reponseBuffer)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();

    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return buildPlaceholderImage(size);
  }
};
