import { writeFile } from "fs/promises";
import { join } from "path";
import { loadEnv, Plugin } from "vite";

export default function robotsPlugin(): Plugin {
  const outputDir = "dist";

  const env = loadEnv(process.env.NODE_ENV || "", process.cwd());
  const publicUrl = env.VITE_PUBLIC_URL;

  return {
    name: "robots",
    closeBundle: async () => {
      if (!publicUrl) {
        return;
      }

      await writeFile(join(outputDir, "robots.txt"), template(publicUrl));
    },
  };
}

const template = (url?: string) => `User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: ${url}/sitemap.xml
`;
