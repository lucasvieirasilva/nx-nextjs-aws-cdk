const esbuildPluginTsc = require('esbuild-plugin-tsc');
const { readCachedProjectGraph } = require('@nx/devkit');

const graph = readCachedProjectGraph();
const projectConfig = graph.nodes[process.env['NX_TASK_TARGET_PROJECT']].data;

const banner = `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __filename = require('url').fileURLToPath(import.meta.url);
const __dirname = require('path').dirname(__filename);
`;

const external = ['@aws-sdk/*', 'react-native-fs', 'react-native-fetch-blob'];

/**
 * @type {import('esbuild').BuildOptions}
 */
module.exports = {
  bundle: true,
  platform: 'node',
  target: 'es2022',
  format: 'esm',
  outExtension: { '.js': '.mjs' },
  banner: {
    js: banner,
  },
  external,
  minify: false,
  keepNames: true,
  plugins: [
    esbuildPluginTsc({
      tsconfigPath: projectConfig.targets.build.options.tsConfig,
    }),
  ],
};
