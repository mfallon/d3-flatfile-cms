/**
 * This could be a rollup plugin
 **/
import Config from '../config/app.config';
import Node from './components/Node';
import Tree from './components/Tree';
import FileQueue from './components/FileQueue';

const tree = new Tree({
  name: "ROOT"
});

const { dir, delim, regEx } = Config.content;
