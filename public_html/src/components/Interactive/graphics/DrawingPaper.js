import React, { Component } from 'react';
import { pajaros } from './sprites';
import { fitElement } from '../../../utils/helpers';
export default class Paper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    let frame = pajaros.frames[0];
    let dims = fitElement(frame.w, frame.h, this.props.w, this.props.h);
    let ctx = this.ctx2;
    let d = pajaros.frames[+this.props.frame];
    ctx.clearRect(0, 0, this.props.w, this.props.h);
    ctx.globalAlpha = 0.2;
    ctx.drawImage(this.props.img, d.x, d.y, d.w, d.h, 0, 50, dims.w, dims.h);
  }

  componentDidMount() {
    this.canvas = this.refs.stage;
    this.ctx = this.canvas.getContext('2d');
    this.onion = this.refs.onion;
    this.ctx2 = this.onion.getContext('2d');

    this.img = new Image();
    this.img.onload = () => {
      this.ctx.drawImage(this.img, 0, 0, this.props.w, this.props.h);
    };
    this.img.src = '/assets/bg/papel-dibujo.png';

    let ctx = this.ctx2;
  }

  render() {
    return (
      <div>
        <canvas
          id='drawingPaper'
          ref='stage'
          width={this.props.w}
          height={this.props.h}
          style={{
            zIndex: this.props.zIndex,
            pointerEvents: 'none'
          }}
        />

        <canvas
          id='onion'
          ref='onion'
          width={this.props.w}
          height={this.props.h}
          style={{
            zIndex: +this.props.zIndex + 1,
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }
}
