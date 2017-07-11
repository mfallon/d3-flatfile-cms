import content from './content.json';
// our main entry point for scss
import '../styles/main.scss';

// Import a couple modules for testing.
import D3NodeTree from './components/D3NodeTree';
import Split from 'split.js';

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

Split(['#left-pane', '#right-pane'], {
  sizes: [80, 20],
  elementStyle: (dimension, size, gutterSize) => ({
    'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'
  }),
  gutterStyle: (dimension, size, gutterSize) => ({
    'flex-basis':  gutterSize + 'px'
  })
});

const canvas = {
  bounds: [800, 500],
  margin: [10, 120, 10, 20],
  elements: ['#d3-canvas', '#d3-content']
};

// eslint-disable-next-line
const tree = new D3NodeTree(canvas, content);
