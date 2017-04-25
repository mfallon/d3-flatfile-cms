import content from './content.json';
// Import styles (automatically injected into <head>).
import '../styles/main.css';

// Import a couple modules for testing.
import NodeTree from './components/NodeTree';

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

const tree = new NodeTree();
log(tree.hello());

// TODO: somehow stuff this variable with output from build

printTarget.innerText = `Output: ${tree.hello()}`;
printTarget.innerText += `\nRootNode: ${content.name}`;
printTarget.innerText += `\nChildren: ${content.children.length}`;
