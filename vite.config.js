import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

const runtimeAssetTargets = [
    { from: 'tabs', to: 'tabs' },
    { from: 'components', to: 'components' },
    { from: 'locales', to: 'locales' },
    { from: 'resources', to: 'resources' },
    { from: 'images', to: 'images' },
    {
        from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
        to: 'webfonts',
    },
    {
        from: 'css/opensans_webfontkit',
        to: 'assets',
        contentsOnly: true,
    },
];

function copyRuntimeAssets() {
    let root;
    let outDir;

    return {
        name: 'copy-runtime-assets',
        apply: 'build',
        configResolved(config) {
            root = config.root;
            outDir = path.resolve(config.root, config.build.outDir);
        },
        closeBundle() {
            for (const target of runtimeAssetTargets) {
                const source = path.resolve(root, target.from);

                if (!fs.existsSync(source)) {
                    continue;
                }

                const destination = path.resolve(outDir, target.to);

                if (target.contentsOnly) {
                    for (const child of fs.readdirSync(source)) {
                        fs.cpSync(path.join(source, child), path.join(destination, child), {
                            recursive: true,
                            force: true,
                        });
                    }

                    continue;
                }

                if (target.from === 'tabs') {
                    fs.mkdirSync(destination, { recursive: true });

                    for (const child of fs.readdirSync(source)) {
                        const sourceChild = path.join(source, child);
                        const destinationChild = path.join(destination, child);

                        if (child === 'receiver_msp.html' && fs.existsSync(destinationChild)) {
                            continue;
                        }

                        fs.cpSync(sourceChild, destinationChild, {
                            recursive: true,
                            force: true,
                        });
                    }

                    continue;
                }

                fs.cpSync(source, destination, {
                    recursive: true,
                    force: true,
                });
            }
        },
    };
}

export { runtimeAssetTargets };

export default defineConfig({
    base: './',
    build: {
        // Keep linked CSS and referenced assets as files so legacy relative paths
        // like ../images/... still resolve after deployment.
        assetsInlineLimit: 0,
        rollupOptions: {
            input: {
                main: path.resolve(projectRoot, 'index.html'),
                receiver_msp: path.resolve(projectRoot, 'tabs/receiver_msp.html'),
            },
        },
    },
    plugins: [copyRuntimeAssets()],
});
