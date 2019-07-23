import React, { Component } from 'react';
import DataStore from '../../stores/DataStore';

export default class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inProject: null
    };
  }

  getTimelineEles() {
    let projects = DataStore.getAllProjects();

    projects.forEach(project => {
      let start = 0;
      let end = 0;
      const techs = project.techniquesSrt;
      const themes = project.themesSrt;

      techs.forEach(obj => {
        end = obj.endTime > end ? obj.endTime : end;
      });
      themes.forEach(obj => {
        end = obj.endTime > end ? obj.endTime : end;
      });

      // console.log(techs, themes, end);
    });
    // console.log(projects);
    return null;
  }

  render() {
    let timelineEles = this.getTimelineEles();

    return <main />;
  }
}
