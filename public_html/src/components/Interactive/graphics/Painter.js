import React, { Component } from 'react';
import DrawingPaper from './DrawingPaper';
import { getXY, random } from '../../../utils/helpers';
import Vector from '../../../utils/Vector';
import { TWO_PI } from '../../../utils/const';
let animReq;
export default class Painter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stageW: 0,
      stageH: 0,
      loggedIn: true,
      ready: false
    };

    this.prevPoint; // save the position (Vector) of the previous position of the line being drawn
    this.frames = []; // array of ctx's for each drawing frame

    this.brushes = [this.brushSimple, this.brushSketch, this.brushSpray];

    this.drawnFrames = [false, false, false, false, false, false, false, false];
  }

  stopDraw = () => {
    this.mouseDown = false;
    this.ctxO.clearRect(0, 0, this.overlay.width, this.overlay.height);

    let _drawn = 0;
    this.drawnFrames.forEach(drawn => {
      if (drawn) {
        _drawn++;
      }
    });

    if (_drawn === 8) {
      this.props.readyToSend(this.frames);
    }
  };

  initDraw = e => {
    let coords = getXY(e);
    this.prevPoint = new Vector(coords.x, coords.y);
    this.mouseDown = true;
  };

  brushSimple = (x, y, dist) => {
    let ctx = this.ctx;
    ctx.lineWidth = this.props.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.prevPoint.x, this.prevPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  brushSketch = (x, y, dist) => {
    let ctx = this.ctx;
    ctx.lineWidth = this.props.lineWidth / dist;
    ctx.beginPath();
    ctx.moveTo(this.prevPoint.x, this.prevPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  brushSpray = (x, y, dist) => {
    let ctx = this.ctx;

    for (var i = 0; i < this.props.lineWidth * 10; i++) {
      let r = random(0, this.props.lineWidth, true);
      let offX = random(-r, r);
      let offY = random(-r, r);
      let angle = random(0, TWO_PI, true);

      ctx.globalAlpha = random(0, this.props.lineOp / 100, true);
      ctx.fillRect(
        x + offX * Math.cos(angle),
        y + offY * Math.sin(angle),
        random(1, 2, true),
        random(1, 2, true)
      );
    }
  };

  defineMode() {
    if (this.props.mode === 1) {
      this.ctx.globalCompositeOperation = 'source-over';
    } else if (this.props.mode === 0) {
      this.ctx.globalCompositeOperation = 'destination-out';
    }
  }

  draw = e => {
    if (this.props.play) {
      return;
    }

    let ctx;
    let coords = getXY(e);

    // Draw circle around mouse pointer to describe erasing area
    if (this.props.drawingMode == 0) {
      ctx = this.ctxO;
      ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.arc(coords.x, coords.y, this.props.lineWidth, 0, TWO_PI);
      ctx.stroke();
      ctx.restore();
    }

    // Get out if user is not drawing
    if (!this.mouseDown) {
      return;
    }

    ctx = this.ctx;
    let v = new Vector(coords.x, coords.y);
    let dist = v.distanceTo(this.prevPoint);
    let tone = this.props.lineTone;
    ctx.strokeStyle = ctx.fillStyle = `rgb(${tone},${tone},${tone})`;
    ctx.globalAlpha = this.props.lineOp / 100;

    this.brushes[this.props.style](coords.x, coords.y, dist);
    this.prevPoint = v;
    this.drawnFrames[+this.props.frame] = true;
  };

  createCanvases(total) {
    if (!total) {
      return null;
    }

    let canvases = [];

    for (let i = 0; i < total; i++) {
      let name = `frame${i}`;
      let display = i === 0 ? 'inline-block' : 'none';
      canvases.push(
        <canvas
          key={name}
          id={name}
          ref={name}
          className='drawingCanvas'
          width={this.state.stageW}
          height={this.state.stageH}
          style={{
            display: display,
            zIndex: 2
          }}
        />
      );
    }
    return canvases;
  }

  play() {
    let f = 0;
    let tick = 0;

    this.frames[this.props.frame].canvas.style.display = 'none';

    const loop = () => {
      if (tick === 4) {
        f = (f + 1) % 8;
        this.ctxO.clearRect(0, 0, this.state.stageW, this.state.stageH);
        this.ctxO.drawImage(this.frames[f].canvas, 0, 0);
        tick = 0;
      }
      tick++;
      animReq = requestAnimationFrame(loop);
    };

    loop();
  }

  componentDidMount() {
    this.overlay = this.refs.overlay;
    this.ctxO = this.overlay.getContext('2d');

    if (this.props.totalFrames > 0) {
      for (let i = 0; i < this.props.totalFrames; i++) {
        let frame = this.refs[`frame${i}`];
        this.frames.push({
          canvas: frame,
          ctx: frame.getContext('2d')
        });

        frame.addEventListener('mousedown', this.initDraw, false);
        frame.addEventListener('mousemove', this.draw, false);
        frame.addEventListener('mouseup', this.stopDraw, false);
        frame.addEventListener('mouseout', this.stopDraw, false);
      }
    }

    this.setState(prevState => ({
      stageW: 709,
      stageH: 500
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.frame !== this.props.frame) {
      let prev = prevProps.frame;
      this.frames[prev].canvas.style.display = 'none';
      this.frames[this.props.frame].canvas.style.display = 'inline-block';
    }
  }

  render() {
    let canvases = this.createCanvases(this.props.totalFrames);

    if (this.frames.length) {
      this.ctx = this.frames[this.props.frame].ctx;
    }

    if (this.ctx) {
      if (this.props.eraseAll) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      if (this.props.drawingMode === 1) {
        this.ctx.globalCompositeOperation = 'source-over';
      } else if (this.props.drawingMode === 0) {
        this.ctx.globalCompositeOperation = 'destination-out';
      }

      if (this.props.play) {
        this.play();
      } else {
        this.frames[this.props.frame].canvas.style.display = 'inline-block';
        window.cancelAnimationFrame(animReq);
      }
    }

    return (
      <div
        className={`stages ${this.props.grid}`}
        style={{
          width: this.state.stageW,
          height: this.state.stageH
        }}
      >
        {canvases}

        <canvas
          id='overlay'
          ref='overlay'
          className='overlayCanvas'
          width={this.state.stageW}
          height={this.state.stageH}
          style={{
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        <DrawingPaper
          w={this.state.stageW}
          h={this.state.stageH}
          zIndex='1'
          img={this.props.birdsImg}
          frame={this.props.frame}
        />
      </div>
    );
  }
}
