import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      "~/components": "/app/components",
      "~/features": "/app/features",
      "~/hooks": "/app/hooks",
      "~/lib": "/app/lib",
      "~/stores": "/app/stores",
      "~/types": "/app/types",
      "~/utils": "/app/utils",
      "~/providers": "/app/providers",
      "~/test": "/app/test",
    }
  }
});
