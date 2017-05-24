/* eslint-disable */
import * as d3Lib from 'd3';

export default class D3Component {

  constructor() {
    // TODO: work out why this is needed 
    this.d3 = d3Lib.__moduleExports;
  }

  setupCanvas(canvas) {
    return this.d3.select(document.body).append('svg')
      .attr('width', canvas.bounds[0])
      .attr('height', canvas.bounds[1])
      .append('g')
      .attr('transform', `translate(${canvas.margin[3]}, ${canvas.margin[0]})`);
  }


  // const getCanvasBounds = () => this.

}
/* eslint-enable */
