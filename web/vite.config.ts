import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import Unfonts from "unplugin-fonts/vite";
import cookiebot from "./plugins/cookiebot";
import adsense from "./plugins/adsense";
import robots from "./plugins/robots";
import Sitemap from "vite-plugin-sitemap";
import prerender from "@prerenderer/rollup-plugin";
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
    VitePluginRadar({
      analytics: {
        id: "GTM-5DVLF4R5",
      },
    }),
    prerender({
      routes: ["/"],
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        renderAfterDocumentEvent: "pre-render",
      },
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html
          .replace(/http:/gi, "https:")
          .replace(
            /(https:\/\/)?(localhost|127\.0\.0\.1):\d*/gi,
            process.env.CI_ENVIRONMENT_URL || ""
          );
      },
    }),
    cookiebot(),
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
