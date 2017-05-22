import content from './content.json';
// Import styles (automatically injected into <head>).
import '../styles/main.css';

// Import a couple modules for testing.
import D3NodeTree from './components/D3NodeTree';

// Import a logger for easier debugging.
import debug from 'debug';
const log = debug('app:log');

// The logger should only be enabled if we’re not in production.
if (ENV !== 'production') {

  // Enable the logger.
  debug.enable('*');
  log('Logging is enabled!');

  // Enable LiveReload
  document.write(
    '<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>'
  );
} else {
  debug.disable();
}

// Print the results on the page.
const printTarget = document.getElementsByClassName('debug__output')[0];
// TODO: somehow stuff this variable with output from build
printTarget.innerText = `\nRootNode: ${content.name}`;
printTarget.innerText += `\nChildren: ${content.children.length}`;

const canvas = {
  bounds: [1024, 1000],
  margin: [20, 220, 20, 60]
};

// eslint-disable-next-line
const tree = new D3NodeTree(canvas, content);
