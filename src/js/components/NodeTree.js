// TODO: implement our class to represent the D3 Node Tree
// 1. Use JSON data generated from build
// 2. import D3 lib as node module
// 3. Generate D3 Hierarchy from JSON data
// 4. Output visual of hierarchy

/**
 * D3 Node Tree
 * @param  {type}
 * @return {type}
 */

import d3 from 'd3';
import { hierarchy } from 'd3-hierarchy';

export default class NodeTree {
  constructor(data = null) {
    this.root = hierarchy(data);
    // eslint-disable-next-line
    console.log(d3);
  }

  hello() {
    return `Hello ${this.root.children.length}`;
  }
}
