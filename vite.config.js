import { defineConfig } from 'vite';
import fenom from 'vite-plugin-fenom';
import path from "path";
import postcss from "@vituum/vite-plugin-postcss";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {

    const buildOptions = {
        modulePreload: {
            polyfill: false,
        },
        minify: "terser",
        terserOptions: {
            keep_fnames: true,
            keep_classnames: true,
            compress: {
                keep_classnames: true,
                keep_fnames: true,
            },
            mangle: {
                reserved: ["$", "jQuery"],
            },
        },
        rollupOptions: {
            input: ['src/scripts/scripts.ts', 'src/styles/styles.scss'],
            output: {
                entryFileNames: `js/[name].js`,
                assetFileNames: `[ext]/[name].[ext]`,
            },
        },
    };

    const plugins = [
        fenom({
            pages: 'src/templates/',
            data: 'src/data/**/*.json',
            root: 'src/',
        }),
        postcss({
            autoprefixer: {
                overrideBrowserslist: ["last 6 versions", "Android >= 4"],
            },
        }),
    ];

    return {
        css: {
            preprocessorOptions: {
                scss: {
                    sourceMap: true,
                },
            },
        },
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "src"),
            },
            extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs"],
        },
        server: {
            watch: {
                additionalPaths: (watcher) => {
                    watcher.add("src/**");
                },
            },
        },
        base: "./",
        plugins: plugins,
        build: buildOptions,
    };
});
