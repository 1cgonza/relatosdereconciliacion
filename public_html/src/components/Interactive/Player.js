import React, { Component } from 'react';

export default class Project extends Component {
  constructor(props) {
    super(props);
  }

  getTimelineEles() {
    return null;
  }

  render() {
    let timelineEles = this.getTimelineEles();

    return <main />;
  }
}
