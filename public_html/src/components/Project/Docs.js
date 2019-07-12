import React, { Component } from 'react';

export default class Docs extends Component {
  constructor(props) {
    super(props);
  }

  buildGallery(items) {
    if (items) {
      let gall = Object.keys(items);
      return gall.map(imgID => {
        return (
          <div key={imgID} className='galleryImg'>
            <span className='polaroid' />
            <img src={items[imgID].medium} />
            <span className='black' />
          </div>
        );
      });
    }

    return null;
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
    let project = this.props.project;
    let synosis = this.buildSynopsis(project.synopsis);
    let transcript = this.buildTranscript(project.transcript);
    let gallery = this.buildGallery(project.gallery);

    return (
      <section id='info' className='projectSection sectionDocs'>
        <div className='contentWrapper'>
          <div className='content'>
            {synosis}
            {transcript}
          </div>
        </div>

        <div className='gallery'>{gallery}</div>
      </section>
    );
  }
}
