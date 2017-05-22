// TODO: implement our class to represent the D3 Node Tree
// 1. Use JSON data generated from build
// 2. import D3 lib as node module
// 3. Generate D3 Hierarchy from JSON data
// 4. Output visual of hierarchy

/* eslint-disable */

/**
 * D3 Node Tree
 * @param  {type}
 * @return {type}
 */

import * as d3Lib from 'd3';
// TODO: imports not working as expected
const d3 = d3Lib.__moduleExports;
// TODO: this works:
// import { hierarchy } from 'd3-hierarchy';

import debug from 'debug';
const log = debug('app:log');

export default class NodeTree {

  constructor(json = null) {
    if (ENV !== 'production') {
      log(`D3 v${d3.version} loaded`);
    }

    const margin = {top: 20, right: 220, bottom: 20, left: 60};
    const bounds = {
      width: 1024 - margin.left - margin.right,
      height: 2000 - margin.top - margin.bottom
    };

    this.root = d3.hierarchy(json, d => d.children);
    this.root.x0 = bounds.height / 2;
    this.root.y0 = 0;

    this.canvas = this.setupCanvas(bounds, margin);
    this.tree = d3.tree()
      .size([bounds.height, bounds.width]);

    // this.drawTree();

    // Collapse all but first 3
    const collapse = d => {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    };
    this.root.children.forEach(collapse);

    this.update(this.root);
  }

  hello() {
    return `Hello ${this.root.children.length}`;
  }

  setupCanvas(bounds, margin) {
    const svg = d3.select(document.body).append('svg')
      .attr('width', bounds.width + margin.right + margin.left)
      .attr('height', bounds.height + margin.top + margin.bottom);

    return svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }

  // creates a curved diagonal path from parent to the child node
  diagonal(d) {
    /*
    return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;
    */
    return `M${d.y},${d.x}C${((d.y + d.parent.y)/2)},${d.x} ${((d.y + d.parent.y)/2)},${d.parent.x} ${d.parent.y},${d.parent.x}`;


  drawTree() {
    // Link
    let link = this.canvas.selectAll('.link')
      .data(this.tree(this.root).descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => `M${d.y},${d.x}C${((d.y + d.parent.y)/2)},${d.x} ${((d.y + d.parent.y)/2)},${d.parent.x} ${d.parent.y},${d.parent.x}`);

    // Node
    let node = this.canvas.selectAll('node')
      .data(this.root.descendants())
      .enter().append('g')
      .attr('class', d => (`node${(d.children ? ' node--internal' : ' node--leaf')}`))
      .attr('transform', d => `translate(${d.y},${d.x})`);
    node.append('circle')
      .attr('r', 5);

    // Text Node
    node.append('text')
      .attr('dy', 3)
      .attr('x', d => (d.children ? -8 : 8))
      .style('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => (d.data.name ? d.data.name : 'node'));

    const collapse = d => {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    };

  }

  update(source) {
    let treeData = this.tree(this.root);

    // compute new tree layout
    let nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    let i = 0,
      duration = 750;

    // normalize for fixed depth
    nodes.forEach(d => {
      d.y = d.depth * 180;
    });

    // update the nodes
    let node = this.canvas.selectAll('g.node')
      .data(nodes, d => ( d.id || (d.id = ++i)));

    // enter any new nodes at parent's previous position
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${source.y0},${source.x0})`)
      .on('click', d => {
        log('node clicked: ', d.data.name);
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.update(d);
      });

    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', d => d._children ? '#aaa' : '#eee');

    nodeEnter.append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children || d._children ? -10 : 10)
      .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
      .text(d => (d.data.name ? d.data.name : 'node'));

    // Transition Nodes to new position
    let nodeUpdate = nodeEnter.merge(node);
    
    nodeUpdate.transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    nodeUpdate.select('circle.node')
      .attr('r', 4.5)
      .style('fill', d => d._children ? '#aaa' : '#eee')
      .attr('cursor', 'pointer');

    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Transition exiting nodes to parents new position
    let nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', d => `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    let link = this.canvas.selectAll('path.link')
      .data(links, d => d.id);

    let linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        let o = {x: source.x0, y: source.y0};
        return this.diagonal(o, o);
      });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
      .duration(duration)
      .attr('d', d => this.diagonal(d, d.parent));

    let linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', d => {
        let o = {x: source.x, y: source.y};
        return this.diagonal(o, o);
      })
      .remove();

    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

}

/* eslint-enable */
