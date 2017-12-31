const {FuseBox, CSSPlugin, WebIndexPlugin, QuantumPlugin} = require('fuse-box');
const devMode = process.env.NODE_ENV === 'dev';

const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'build/$name.js',
    useTypescriptCompiler: true,
    experimentalFeatures: true,
    plugins: [
        CSSPlugin(),
        WebIndexPlugin({
            template: 'src/index.html',
            path: '.'
        }),
        !devMode && QuantumPlugin({
            treeshake: true,
            uglify: true
        })
    ],
    target: 'browser',
    sourceMaps: devMode,
    // cache: devMode,
    cache: false,
    hash: !devMode
});


const app = fuse.bundle('bundle').instructions('>index.ts');

if (devMode) {
    fuse.dev();
    app.watch().hmr();
}

fuse.run();
