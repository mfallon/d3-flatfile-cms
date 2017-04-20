// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

// Import app config here
import config from './app.config';

// TODO: run tasks to process files here
import build from '../scripts/build';
// potentially use build to output a varname to use

export default {
  entry: 'src/js/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        cssnano(),
      ],
      extensions: [ '.css' ],
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      CONTENTVAR: config.content.varname
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
