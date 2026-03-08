import sharp from "sharp";

export async function convertToWebp(
  inputPath: string,
  resize: boolean = false
): Promise<string> {
  const outputPath = resize
    ? inputPath.replace(/\.[^.]+$/, ".small.webp")
    : inputPath.replace(/\.[^.]+$/, ".webp");

  let pipeline = sharp(inputPath);

  if (resize) {
    const metadata = await pipeline.metadata();
    if (metadata.width && metadata.height) {
      pipeline = pipeline.resize(
        Math.floor(metadata.width / 4),
        Math.floor(metadata.height / 4),
        { fit: "fill" }
      );
    }
  }

  await pipeline.webp({ lossless: true }).toFile(outputPath);

  return outputPath;
}

export async function bufferToWebp(
  buffer: Buffer | ArrayBuffer,
  resize: boolean = false
): Promise<Buffer> {
  const inputBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  let pipeline = sharp(inputBuffer);

  if (resize) {
    const metadata = await pipeline.metadata();
    if (metadata.width && metadata.height) {
      pipeline = pipeline.resize(
        Math.floor(metadata.width / 4),
        Math.floor(metadata.height / 4),
        { fit: "fill" }
      );
    }
  }

  return pipeline.webp({ lossless: true }).toBuffer();
}
