import React, { Component } from 'react';
import DataStore from '../../stores/DataStore';

export default class Player extends Component {
  getThemePoints() {
    const themes = DataStore.getThemesData();
    const stageW = window.innerWidth;

    return themes.map(theme => {
      const name = theme.name;
      const stepX = stageW / theme.longest;
      const stepY = 140 / theme.projects.length;

      return theme.projects.map((project, line) => {
        const y = `${line * stepY}px`;

        return project.d.map((obj, i) => {
          const x = `${obj.startTime * stepX}px`;

          return (
            <span
              className='themePoint'
              key={`theme${i}`}
              data-i={i}
              style={{
                transform: `translate(${x}, ${y})`
              }}
            />
          );
        });
      });
    });
  }

  render() {
    const points = this.getThemePoints();

    return <div className='player'>{points}</div>;
  }
}
