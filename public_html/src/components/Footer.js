import React, { Component } from 'react';
import Drawing from './Interactive/Drawing';

export default class Top extends Component {
  render() {
    const pathname = location.pathname;
    const showDrawing =
      pathname === '/' ||
      pathname === '/largometraje' ||
      pathname === '/relatos';
    const drawing = !showDrawing ? (
      <section className='drawingSection'>
        <Drawing />
      </section>
    ) : null;

    return drawing;
  }
}
