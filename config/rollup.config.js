// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import sass from 'rollup-plugin-sass';

// content processing imports
import jsonfile from 'jsonfile';
import { build } from './scripts/build';
build('./content').then(result => {
  jsonfile.writeFileSync('./src/js/content.json', result);
}).catch(err => {
  console.log(`promise returned ${err}`, ' - no files to process?');
});

// will dev here but should belong to build script 
const fs = require('fs');
fs.createReadStream(`./src/index.html`)
  .pipe(fs.createWriteStream(`./build/index.html`));

/*
const indexLoader = new Promise((resolve, reject) => {
  let file = fs.createReadStream('./src/index.html');
  // when loaded event happens
  file.then();
});

indexLoader.load().then(
  console.log('index loaded!');
);
*/

export default {
  entry: 'src/js/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    sass({
      output: 'build/css/main.css'
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
      exclude: [
        'node_modules/**',
        'src/js/*.json'
      ]
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    json({
      include: 'src/**',
      exclude: 'node_modules/**',
      preferConst: true
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
