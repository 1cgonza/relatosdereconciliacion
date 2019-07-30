import React, { Component } from 'react';
import DataStore from '../../../stores/DataStore';
import { sizeFromPercentage, random } from '../../../utils/helpers';
import { themesData, techniquesData } from '../../../utils/categories';

export default class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themeOptions: null,
      tehcsOptions: null,
      themesD: null
    };
  }

  onResize = e => {};

  timelineClick = e => {
    let coords = e.target.getBoundingClientRect();
    const pos = e.clientX - coords.left;
    const s = pos * (this.props.duration / Math.round(coords.width));
    this.props.seekTo(s);
  };

  handleMouseEnter = e => {
    let coords = e.target.getBoundingClientRect();
    this.refs.tip.style.left = `${coords.x}px`;
    this.refs.tip.style.top = `${coords.y + 20}px`;
    this.refs.tip.innerText = e.target.dataset.name;
    this.refs.tip.classList.add('active');
  };

  handleMouseLeave = () => {
    this.refs.tip.innerText = '';
    this.refs.tip.classList.remove('active');
  };

  handleClick = e => {
    this.player.seekTo(e.target.dataset.start);
  };

  getTimelineEles() {
    if (!this.state.d || !this.state.duration) {
      return null;
    }

    let h = sizeFromPercentage(18, window.innerHeight) | 0;
    let w = sizeFromPercentage(90, window.innerWidth) | 0;
    let stepH = h / this.state.options.length;
    let stepW = w / (this.state.duration * 1000);

    return this.state.options.map((option, i) => {
      return option.d.map((node, j) => {
        return (
          <span
            key={option.slug + i + j}
            className={`timelineEle ${option.slug}`}
            data-name={option.name}
            data-start={node.start / 1000}
            style={{
              left: node.start * stepW + 'px',
              top: i * stepH + 'px'
            }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          />
        );
      });
    });
  }

  getTimelineEles() {
    let projects = DataStore.getAllProjects();

    projects.forEach(project => {
      let start = 0;
      let end = 0;
      const techs = project.techniquesSrt.d;
      const themes = project.themesSrt.d;

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

  optionClick = e => {
    const theme = e.target.innerText;
    const rel = themesData.find(t => t.name === theme).projects;
    let copy = [...rel];
    copy.splice(copy.indexOf(this.props.slug), 1);
    const next = copy[random(0, copy.length)];
    const jumpTo = this.state.themesD;
    // console.log(next, theme, jumpTo);

    const currentTime = this.props.getCurrentTime();
    let position = this.state.themesD.find(point => {
      return point.startTime >= currentTime && point.terms.indexOf(theme) >= 0;
    });

    if (!position) {
      position = this.state.themesD.find(
        point => point.terms.indexOf(theme) >= 0
      );
    }

    this.props.seekTo(position.startTime);

    this.props.updatePosition(position);
  };

  getOptions() {
    if (!this.state.themeOptions) {
      return null;
    }

    return this.state.themeOptions.map((option, i) => {
      return (
        <span
          key={`op${i}`}
          className='timelineOption'
          data-name={option}
          onClick={this.optionClick}
        >
          {option}
        </span>
      );
    });
  }

  componentDidMount() {
    const projects = DataStore.getAllProjects();
    const project = DataStore.getPageBySlug(this.props.slug, 'projects');
    const themes = project.themesSrt;
    const techs = project.techniquesSrt;

    const projectW = this.refs.timeline.clientWidth / projects.length;
    const projectI = projects.findIndex(proj => proj.slug === this.props.slug);

    Object.assign(this.refs.timelinePos.style, {
      width: `${projectW}px`,
      left: `${projectI * projectW + this.refs.timeline.offsetLeft}px`
    });

    console.log(themes.d);

    this.setState({
      themeOptions: themes.options,
      tehcsOptions: techs.options,
      themesD: themes.d
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    let timelineEles = this.getTimelineEles();
    let options = this.getOptions();

    return (
      <div className='player'>
        <div ref='timelinePos' className='timelinePos' />
        <div ref='timeline' className='timeline' onClick={this.timelineClick}>
          <div ref='progress' className='progress' />
          <div ref='header' className='header' />
        </div>

        <div className='options' ref='options'>
          {options}
        </div>
        <div ref='tip' className='tip' />
      </div>
    );
  }
}
