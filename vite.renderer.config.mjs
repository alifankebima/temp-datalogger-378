import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config.mjs';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  /** @type {import('vite').UserConfig} */
  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      rollupOptions: {
        input: {
          main_window: resolve(__dirname, "index.html"),
          setting_window: resolve(__dirname, "setting.html"),
          pdf_window: resolve(__dirname, "pdf.html"),
        }
      }
    },
    plugins: [pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  };
});


// export default defineConfig({
//   root: resolve(__dirname, "src", "window", "main"),
// });