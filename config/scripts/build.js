const fs = require('fs');
/**
 * This could be a rollup plugin
 **/
import config from '../app.config';
import Tree from './components/Tree';
import FileQueue from './components/FileQueue';

/**
* Read all the files crawling starting from a certain folder path
* @param  { String } path directory path
* @returns { Array } files path list
*/
const listFiles = (path) => {
  print(`Listing all the files in the folder: ${path}`, 'confirm')
  var files = []
  if (fs.existsSync(path)) {
    var tmpFiles = fs.readdirSync(path).sort()
    tmpFiles.forEach((file) => {
      var curPath = path + '/' + file
      files.push(curPath)
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        listFiles(curPath)
      }
    })
  }
  return files
};

const capitalize = (str, delim = ' ') => (
  str.toLowerCase()
    .split(delim).map(word => [
      word.charAt(0).toUpperCase(),
      word.substring(1)
    ].join('')).join(' ')
);

/**
* Log messages in the terminal using custom colors
* @param  { String } msg - message to output
* @param  { String } type - message type to handle the right color
*/
const print = (msg, type) => {
  var color;
  switch (type) {
    case 'error':
      color = '\x1B[31m';
      break;
    case 'warning':
      color = '\x1B[33m';
      break;
    case 'confirm':
      color = '\x1B[32m';
      break;
    case 'cool':
      color = '\x1B[36m';
      break;
    default:
      color = '';
  }
  console.log(`${color} ${msg} \x1B[39m`);
}

export const build = (path) => {
  // read content dir and create a sorted array based on filename convention
  const { delim, regEx } = config;
  const content = listFiles(`${ path }`);
  const q = new FileQueue();
  // iterate over directory files
  content.forEach((file, index) => {
    // get address part of filename
    const rematch = regEx.exec(file);
    if (rematch && rematch.length === 4) {
      let [ match, addr, name, ext ] = rematch;
      addr = addr.substring(0, addr.length - 1).split(delim);
      name = capitalize(name, delim);
      // add file to FileQueue, but check if resolved later
      q.readFile(file, data => {
        return {
          addr,
          name,
          ext,
          content: JSON.stringify(data)
        }
      });
    } else {
      print(`Error: cannot match file ${ file }`, 'warning');
    }
  });

  // Instantiate tree data structure
  const tree = new Tree({
    name: 'ROOT'
  });

  // Now ask q to return when all promises have fulfilled
  // return this promise rather than current return value
  return new Promise((resolve, reject) => {
    q.checkResolved().then(
      allFilesResolved => {
        if (allFilesResolved.length) {
          allFilesResolved.forEach(fileData => {
            const { addr, name, ext, content } = fileData;
            tree.add(addr, {
              name,
              ext,
              content
            });
          });
          resolve(tree.toJSON());
        } else {
          reject('error');
        }
      });
    });
};

