import { writeFile } from "fs/promises";
import { join } from "path";
import { loadEnv, Plugin } from "vite";

export default function adsensePlugin(): Plugin {
  const outputDir = "dist";

  const env = loadEnv(process.env.NODE_ENV || "", process.cwd());
  const apiKey = env.VITE_ADSENSE_API_KEY;

  return {
    name: "adsense",
    transformIndexHtml: (html) => {
      if (!apiKey) {
        return html;
      }

      return [
        {
          tag: "script",
          injectTo: "head",
          attrs: {
            async: true,
            src:
              "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
              apiKey,
            crossorigin: "anonymous",
          },
        },
      ];
    },
    closeBundle: async () => {
      if (!apiKey) {
        return;
      }

      await writeFile(
        join(outputDir, "ads.txt"),
        `google.com, ${apiKey.substring(3)}, DIRECT, f08c47fec0942fa0`
      );
    },
  };
}
