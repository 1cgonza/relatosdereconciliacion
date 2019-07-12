import React, { Component } from 'react';
import DataStore from '../../../stores/DataStore';

export default class RiverFront extends Component {
  getLines() {
    let ids = this.props.violenceIds;
    if (!ids || !ids.length) {
      ids = DataStore.getActiveTaxonomies('violencia');
    }
    let taxonomies = DataStore.getActiveTaxonomies('violencia');

    return taxonomies.map((obj, i) => {
      let delay = (i + 1) * 2;
      let c = obj.color;

      return (
        <use
          key={`line${obj.id}`}
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
    });
  }

  render() {
    let lines = this.getLines();

    return (
      <section className='homeRiver projectRiver'>
        <svg
          className='wave'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 24 150 28'
          preserveAspectRatio='none'
          style={{ height: '80px' }}
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
            strokeWidth='.4'
          >
            {lines}
          </g>
        </svg>
      </section>
    );
  }
}
