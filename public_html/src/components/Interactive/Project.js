import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DataStore from '../../stores/DataStore';
import Tree from './Tree';
import Video from './Video';
import Docs from './Docs';
import RiverColors from './graphics/RiverColors';
import Bosque from './graphics/Bosque';
import Flock from './graphics/Flock';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 'tree'
    };
  }

  closeVideo = () => {
    this.setState({
      playVideo: false
    });
  };

  getVideo(url) {
    if (url) {
      return (
        <Video
          playVideo={this.state.playVideo}
          videoURL={url}
          closeVideo={this.closeVideo}
        />
      );
    }
    return null;
  }

  render() {
    let project = DataStore.getPageBySlug(this.props.slug, 'projects');
    let quote = project.quote ? (
      <p className='projectQuote'>{project.quote}</p>
    ) : null;
    let video = !!project.oembed ? this.getVideo(project.oembed) : null;
    let prevNext = DataStore.getPrevNextProjects(this.props.slug);
    let next = prevNext.next ? (
      <Link className='arrow arrowRight' to={`/${prevNext.next}`} />
    ) : null;
    let prev = prevNext.prev ? (
      <Link className='arrow arrowLeft' to={`/${prevNext.prev}`} />
    ) : null;
    let flock = DataStore.userAnim ? <Flock img={DataStore.userAnim} /> : null;

    return (
      <main>
        {flock}
        {next}
        {prev}
        <section className='projectSection sectionForest' ref='main'>
          <div className='projectSummary' style={{ zIndex: 9 }}>
            <h1 className='projectTitle'>{project.title}</h1>
            {quote}
          </div>

          <Tree
            treeImg='/assets/arbol.png'
            colorImgs={project.gallery}
            violence={project.violencia}
          />
          <Bosque />
          <RiverColors violenceIds={project.violencia} />
        </section>
        <section className='projectSection sectionVideo'>{video}</section>
        <Docs project={project} />
      </main>
    );
  }
}
