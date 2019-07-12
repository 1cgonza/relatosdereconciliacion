import React, { Component } from 'react';
import { random, sizeFromPercentage, Debouncer } from '../../utils/helpers';
import { trees } from './graphics/sprites';

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stageW: 0,
      stageH: 0,
      totalAssets: 2,
      tree: {}
    };
    this.loadedAssets = 0;
    this.tree = new Image();
    this.grass = new Image();
    this.colors = [];
    this.debouncer = new Debouncer();
  }

  onResize = e => {
    this.canvas.style.opacity = 0;
    this.debouncer.debounce().then(() => {
      this.setCanvasDimensions();
      this.renderCanvas();
    });
  };

  setCanvasDimensions() {
    this.setState(prevState => ({
      stageW: document.body.clientWidth,
      stageH: window.innerHeight
    }));
  }

  drawTree() {
    let tree = this.state.tree;
    this.ctx.drawImage(
      this.tree,
      tree.x,
      tree.y,
      tree.w,
      tree.h,
      30,
      this.canvas.height - tree.h - 110,
      tree.w * 1.5,
      tree.h * 1.5
    );
  }

  drawGrass() {
    let img = this.grass;
    let w = this.canvas.width;
    let iw = this.grass.naturalWidth;
    let right = w - iw;
    let ctx = this.ctx;

    let y = this.state.stageH - 120;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(img, 0, y);
    ctx.drawImage(img, iw / 2, y);
    ctx.drawImage(img, iw, y);
    ctx.drawImage(img, right - iw / 2, y);
    ctx.drawImage(img, right, y);

    ctx.restore();
  }

  assetLoaded() {
    this.loadedAssets++;
    this.renderCanvas();
  }

  renderCanvas() {
    console.log(this.loadedAssets >= this.state.totalAssets);
    if (this.loadedAssets >= this.state.totalAssets) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawTree();
      this.renderColor();
      this.drawGrass();
      this.canvas.style.opacity = 1;
    }
  }

  renderColor() {
    let ctx = this.ctx;
    let treeX1 = 30;
    let treeY1 = this.canvas.height - this.state.tree.h;
    let treeY2 = this.canvas.height - sizeFromPercentage(60, this.state.tree.h);
    let x1 = treeX1 - 100;
    let x2 = treeX1 + 100;
    let x3 = treeX1 + 200;
    let x4 = treeX1 + 400;
    let y1 = treeY1 - 100;

    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = 0.4;

    this.colors.forEach(color => {
      ctx.drawImage(color, random(x1, treeX1), random(y1, treeY2));
      ctx.drawImage(color, random(treeX1, x2), random(y1, treeY2));
      ctx.drawImage(color, random(x2, x3), random(y1, treeY2));
      ctx.drawImage(color, random(x3, x4), random(y1, treeY2));

      ctx.drawImage(color, random(x1, treeX1), random(y1, treeY2));
      ctx.drawImage(color, random(treeX1, x2), random(y1, treeY2));
      ctx.drawImage(color, random(x2, x3), random(y1, treeY2));
      ctx.drawImage(color, random(x3, x4), random(y1, treeY2));

      ctx.drawImage(color, random(x1, treeX1), random(y1, treeY2));
      ctx.drawImage(color, random(treeX1, x2), random(y1, treeY2));
      ctx.drawImage(color, random(x2, x3), random(y1, treeY2));
      ctx.drawImage(color, random(x3, x4), random(y1, treeY2));
    });

    ctx.globalCompositeOperation = 'luminosity';
    ctx.globalAlpha = 1;
    this.drawTree();
    ctx.restore();
  }

  componentDidMount() {
    let totalColors = this.props.colorImgs
      ? Object.keys(this.props.colorImgs).length
      : 0;

    this.canvas = this.refs.stage;
    this.ctx = this.canvas.getContext('2d');

    this.tree.onload = this.assetLoaded.bind(this);
    this.grass.onload = this.assetLoaded.bind(this);
    this.tree.src = trees.url;
    this.grass.src = '/assets/bg/pasto1.png';

    if (totalColors > 0) {
      for (var imgID in this.props.colorImgs) {
        let img = new Image();
        this.colors.push(img);
        img.onload = this.assetLoaded.bind(this);
        img.src = this.props.colorImgs[imgID].medium;
      }
    }

    this.setCanvasDimensions();

    this.setState(prevState => ({
      totalAssets: prevState.totalAssets + totalColors,
      tree: trees.frames[random(0, trees.frames.length)]
    }));

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div className='projectTree'>
        <canvas
          id='stage'
          ref='stage'
          width={this.state.stageW}
          height={this.state.stageH}
          style={{ zIndex: 1, bottom: 0, transition: 'opacity 2s', opacity: 0 }}
        />
      </div>
    );
  }
}
