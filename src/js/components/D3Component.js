/* eslint-disable */
import * as d3Lib from 'd3';
import * as markedLib from 'marked';

export default class D3Component {

  constructor() {
    // TODO: work out why this is needed 
    this.d3 = d3Lib.__moduleExports;
    this.marked = markedLib.__moduleExports;
  }

  setupCanvas(canvas) {
    // query for element if provided
    const { element, bounds, margin } = canvas;
    
    return this.d3.select(element).append('svg')
      .attr('width', bounds[0])
      .attr('height', bounds[1])
      .append('g')
      .attr('transform', `translate(${margin[3]}, ${margin[0]})`);
  }

}
/* eslint-enable */
