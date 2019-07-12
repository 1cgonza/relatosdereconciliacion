import React from 'react';
import DataStore from '../../../stores/DataStore';
import { random } from '../../../utils/helpers';

let animReq;

export default class Flock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stageW: 0,
      stageH: 0
    };

    this.flock = [];
  }

  play() {
    const loop = () => {
      this.flock.forEach(bird => {
        bird.update();
        bird.draw();
      });

      animReq = requestAnimationFrame(loop);
    };

    loop();
  }

  componentDidMount() {
    this.canvas = this.refs.stage;
    this.ctx = this.canvas.getContext('2d');

    this.setState(prevState => ({
      stageW: window.innerWidth,
      stageH: window.innerHeight
    }));

    this.ctx.globalAlpha = 1;

    for (let i = 0; i < 10; i++) {
      this.flock.push(new Bird(DataStore.userAnimD, this.ctx, this.props.img));
    }

    this.play();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animReq);
  }

  render() {
    return (
      <div>
        <canvas
          id='flock'
          ref='stage'
          width={this.state.stageW}
          height={this.state.stageH}
          style={{
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }
}

class Bird {
  constructor(options, ctx, img) {
    this.options = options;
    this.ctx = ctx;
    this.img = img;
    this.firstFrameX = random(0, 7);
    this.currentFrameX = this.firstFrameX * options.frameW;
    this.cycleCounter = this.firstFrameX * options.framesPerImage;
    this.cycleNextFrame = this.cycleCounter + options.framesPerImage;
    this.cycleEnd = options.framesPerImage * options.cols;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.gravityY = 0.005;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.shuffle();
  }

  shuffle() {
    this.x = random(-this.w, 0);
    this.y = random(0, this.h);
    this.vx = (10 + random(0, 11)) | 0;
    this.vy = random(-1, 2, true);
  }

  update() {
    if (this.x > this.w) {
      this.shuffle();
    }

    this.vy += this.vy * this.gravityY;
    this.rotation = this.vy / 10;
    this.x += this.vx;
    this.y += this.vy;

    if (this.cycleCounter === this.cycleEnd) {
      this.cycleCounter = 0;
      this.currentFrameX = 0;
      this.cycleNextFrame = this.options.framesPerImage;
    } else if (this.cycleCounter === this.cycleNextFrame) {
      this.currentFrameX += this.options.frameW;
      this.cycleNextFrame += this.options.framesPerImage;
    }
    this.cycleCounter++;
  }

  draw() {
    let ctx = this.ctx;

    ctx.save();
    // FOG
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(0, 0, this.w, this.h);
    // back to normal painting before rendering the bird
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.rotate(this.rotation);

    ctx.drawImage(
      this.img,
      this.currentFrameX,
      0,
      this.options.frameW,
      this.options.frameH,
      this.x,
      this.y,
      this.options.frameW / 4,
      this.options.frameH / 4
    );
    ctx.restore();
  }
}
