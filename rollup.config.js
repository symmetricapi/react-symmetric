const fs = require('fs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { builtinModules } = require('module');

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
babelrc.presets[0][1].modules = false;

const dynamicModules = new Array('react', 'symmetric-js', ...builtinModules);

export default {
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: pkg.name,
    sourcemap: true,
    globals: Object.fromEntries(dynamicModules.map(name => [name, `require("${name}")`])),
  },
  external: dynamicModules,
  plugins: [
    resolve(),
    babel(
      Object.assign(babelrc, {
        babelrc: false,
        exclude: 'node_modules/**',
      }),
    ),
  ],
};
