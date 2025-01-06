import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import Unfonts from "unplugin-fonts/vite";
import cookiebot from "./plugins/cookiebot";
import adsense from "./plugins/adsense";
import robots from "./plugins/robots";
import Sitemap from "vite-plugin-sitemap";
import { VitePluginRadar } from "vite-plugin-radar";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    Unfonts({
      custom: {
        families: [{ name: "Geist", src: "./src/assets/fonts/*.woff2" }],
      },
    }),
    adsense(),
    robots(),
    Sitemap({ hostname: "https://moto-zloty.pl" }),
    cookiebot(),
    VitePluginRadar({
      analytics: {
        id: "GTM-5DVLF4R5",
        consentDefaults: {
          // @ts-ignore
          ad_personalization: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
          security_storage: "granted",
          wait_for_update: 500,
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ["lodash"],
        },
      },
    },
  },
});
