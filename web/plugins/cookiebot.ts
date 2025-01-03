import { loadEnv, Plugin } from "vite";

export default function cookiebotPlugin(): Plugin {
  const env = loadEnv(process.env.NODE_ENV || "", process.cwd());
  const apiKey = env.VITE_COOKIEBOT_API_KEY;

  return {
    name: "cookiebot",
    transformIndexHtml: (html) => {
      if (!apiKey) {
        return html;
      }

      return [
        {
          tag: "script",
          injectTo: "head-prepend",
          attrs: {
            id: "Cookiebot",
            src: "https://consent.cookiebot.com/uc.js",
            "data-cbid": apiKey,
            "data-blockingmode": "auto",
          },
        },
      ];
    },
  };
}
