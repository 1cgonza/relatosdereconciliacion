import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  random,
  fitElement,
  getPercent,
  sizeFromPercentage
} from '../../utils/helpers';
export default class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    let imgW = 531;
    let imgH = 500;
    let treeW = imgW / 3;
    let treeH = imgH / 3;
    this.scale = random(50, 80);
    let per = getPercent(this.scale, treeW);
    let _w = sizeFromPercentage(per, treeW);
    let _h = sizeFromPercentage(per, treeH);
    this.dims = fitElement(treeW, treeH, _w, _h);
    const i = random(0, 9);
    const xi = i % 3;
    const yi = (i / 3) | 0;
    this.x = xi * this.dims.w;
    this.y = yi * this.dims.h;
  }

  render() {
    let x = this.props.x;
    let cl = 'marker';

    if (x < 300) {
      cl += ' pushRight';
    } else if (x > window.innerWidth - 300) {
      cl += ' pushLeft';
    }

    return (
      <Link
        className={cl}
        ref={this.props.slug}
        data-slug={this.props.slug}
        to={this.props.path}
        style={{
          left: `${this.props.x}px`,
          top: `${this.props.y}px`,
          height: `${window.innerHeight - this.props.y}px`,
          width: `${this.scale}px`
        }}
      >
        <span className='markerTitle'>{this.props.title}</span>
        <span
          className='markerCential'
          style={{
            width: `${this.scale - 2}px`
          }}
        />
        <span
          className='markerFrontal'
          style={{
            width: `${this.dims.w}px`,
            height: `${this.dims.h}px`,
            backgroundSize: `${this.dims.w * 3}px, ${this.dims.h * 3}px`,
            backgroundPosition: `-${this.x}px -${this.y}px`,
            transform: 'scale(1.3)'
          }}
        />
      </Link>
    );
  }
}
