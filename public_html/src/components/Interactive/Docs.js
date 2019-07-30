import React, { Component } from 'react';
import Gallery from './ui/Gallery';

export default class Docs extends Component {
  constructor(props) {
    super(props);
  }

  buildSynopsis(content) {
    if (content) {
      return (
        <div className='contentSection'>
          <h2>Sinopsis</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    return null;
  }

  buildTranscript(content) {
    if (content) {
      return (
        <div className='contentSection'>
          <h2>Transcripción</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    return null;
  }

  render() {
    const project = this.props.project;
    const synosis = this.buildSynopsis(project.synopsis);
    const transcript = this.buildTranscript(project.transcript);

    return (
      <section id='info' className='projectSection sectionDocs'>
        <div className='contentWrapper'>
          <div className='content'>
            {synosis}
            {transcript}
          </div>
        </div>

        <Gallery items={project.gallery} />
      </section>
    );
  }
}
