import React, { Component } from 'react';
import DataStore from '../../stores/DataStore';

export default class RiverFront extends Component {
  getLines() {
    if (!this.props.violenceIds.length) {
      return null;
    }
    let taxonomies = DataStore.getTaxonomies().violencia;
    let len = 20;
    let lines = [];

    for (let i = 0; i <= len; i++) {
      let y = i * 4;
      let delay = (i + 1) * 2;
      let violenceId = this.props.violenceIds[
        i % this.props.violenceIds.length
      ];
      let c = taxonomies.find(taxObj => taxObj.id == violenceId).color;

      lines.push(
        <use
          key={`line${i}`}
          href='#violenceWave'
          stroke={c}
          x='50'
          y={i}
          style={{
            animationDelay: `-${delay}s`,
            animationDuration: `${delay + 2}s`
          }}
        />
      );
    }

    return lines;
  }

  onScroll = () => {
    if (window.scrollY > 0 && window.scrollY < window.innerHeight) {
      this.refs.river.style.height = this.refs.wave.style.height = `${100 +
        window.scrollY}px`;
    } else if (window.scrollY === 0) {
      this.refs.river.style.height = this.refs.wave.style.height = `${100}px`;
    } else if (window.scrollY >= window.innerHeight) {
      this.refs.river.style.height = this.refs.wave.style.height = `${100 +
        window.innerHeight}px`;
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    let lines = this.getLines();

    return (
      <section className='projectRiver' ref='river'>
        <svg
          ref='wave'
          className='wave'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 24 150 28'
          preserveAspectRatio='none'
        >
          <defs>
            <path
              id='violenceWave'
              d='m -160,44.4 c 30,0 58,-18 87.7,-18 30.3,0 58.3,18 87.3,18 30,0 58,-18 88,-18 30,0 58,18 88,18 l 0,34.5 -351,0 z'
            />
          </defs>
          <g
            ref='infiniteRiver'
            className='infiniteRiver'
            fill='transparent'
            strokeWidth='.7'
          >
            {lines}
          </g>
        </svg>
      </section>
    );
  }
}
