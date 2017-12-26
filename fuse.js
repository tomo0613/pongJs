const {FuseBox, CSSPlugin, JSONPlugin, WebIndexPlugin, QuantumPlugin} = require('fuse-box');
const devMode = process.env.NODE_ENV === 'dev';

const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'build/$name.js',
    useTypescriptCompiler: true,
    experimentalFeatures: true,
    plugins: [
        CSSPlugin(),
        JSONPlugin(),
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
    cache: devMode,
    hash: !devMode
});


const app = fuse.bundle('bundle').instructions('>index.tsx');

if (devMode) {
    fuse.dev();
    app.watch().hmr();
}

fuse.run();
