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
            input: ['/src/scripts/scripts.ts', '/src/styles/styles.scss'],
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
        postcss(),
        // замена путей background-image '/src/' -> '../src/'
        {
            name: 'rewrite-css-urls',
            apply: 'build',
            enforce: 'post',
            generateBundle(_, bundles) {
                if (mode === 'production') {
                    for (const [fileName, bundle] of Object.entries(bundles)) {
                        if (bundle.type === 'asset' && fileName.endsWith('.css')) {
                            bundle.source = bundle.source.toString()
                                .replace(/url\(['"]?\/([^'")]+)['"]?\)/g, 'url("../$1")');
                        }
                    }
                }
            }
        }
    ];

    return {
        css: {
            preprocessorOptions: {
                scss: {
                    sourceMap: mode === 'development',
                },
            },
        },
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "src"),
            },
        },
        plugins: plugins,
        build: buildOptions,
    };
});
