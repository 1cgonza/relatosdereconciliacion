import React, { Component } from 'react';
import { random, Debouncer } from '../../../utils/helpers';
import { trees } from './sprites';

export default class Bosque extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stageW: 0,
      stageH: 0,
      floorH: 0,
      totalAssets: 2,
      trees: trees
    };

    this.tree = new Image();
    this.canvas;
    this.ctx;
    this.debouncer = new Debouncer();
  }

  onResize = e => {
    this.canvas.style.opacity = 0;
    this.debouncer.debounce().then(() => {
      this.setCanvasDimensions();
      this.draw();
    });
  };

  setCanvasDimensions() {
    this.setState(prevState => ({
      stageW: document.body.clientWidth,
      stageH: window.innerHeight
    }));
  }

  draw() {
    let len = 12;
    let ctx = this.ctx;
    ctx.globalCompositeOperation = 'darken';
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let rows = 3;
    let stepX = this.canvas.width / len;
    let stepY = this.canvas.height / rows;
    let treesTotal = trees.frames.length;
    ctx.globalAlpha = 0.3;
    let stepA = (0.2 - ctx.globalAlpha) / rows;

    for (var z = rows; z >= 1; z--) {
      ctx.globalAlpha += stepA;
      for (var i = 0; i < len; i++) {
        let tree = trees.frames[random(0, treesTotal)];
        let x = (i * stepX + random(-stepX, stepX / 2)) | 0;
        let y = this.canvas.height - tree.h + 20;

        ctx.drawImage(
          this.tree,
          tree.x,
          tree.y,
          tree.w,
          tree.h,
          x,
          y,
          tree.w,
          tree.h
        );
      }
    }
    this.canvas.style.opacity = 1;
  }

  componentDidMount() {
    this.canvas = this.refs.stage;
    this.ctx = this.canvas.getContext('2d');
    this.tree.onload = this.draw.bind(this);
    this.tree.src = trees.url;

    this.setCanvasDimensions();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div ref='forest' style={{ overflow: 'hidden' }}>
        <canvas
          id='forest'
          ref='stage'
          width={this.state.stageW}
          height={this.state.stageH}
          style={{ zIndex: 1, bottom: 0, transition: 'opacity 2s', opacity: 0 }}
        />
      </div>
    );
  }
}
