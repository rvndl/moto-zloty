import sharp from "sharp";

const WEBP_QUALITY = 50;

type ResizeType = "default" | "small";

const getResizeFactor = (resize: ResizeType) => {
  return resize === "small" ? 4 : 2;
};

export async function convertToWebp(
  inputPath: string,
  resize: ResizeType = "default",
): Promise<string> {
  const outputPath =
    resize === "small"
      ? inputPath.replace(/\.[^.]+$/, ".small.webp")
      : inputPath.replace(/\.[^.]+$/, ".webp");

  let pipeline = sharp(inputPath);

  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.height) {
    const resizeFactor = getResizeFactor(resize);

    pipeline = pipeline.resize(
      Math.floor(metadata.width / resizeFactor),
      Math.floor(metadata.height / resizeFactor),
      { fit: "fill" },
    );
  }

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

  return outputPath;
}

export async function bufferToWebp(
  buffer: Buffer | ArrayBuffer,
  resize: ResizeType = "default",
): Promise<Buffer> {
  const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  let pipeline = sharp(inputBuffer);

  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.height) {
    const resizeFactor = getResizeFactor(resize);

    pipeline = pipeline.resize(
      Math.floor(metadata.width / resizeFactor),
      Math.floor(metadata.height / resizeFactor),
      { fit: "fill" },
    );
  }

  return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}
