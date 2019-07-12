import React, { Component } from 'react';
import YouTube from 'react-youtube';
import {
  sizeFromPercentage,
  fitElement,
  getVideoId
} from '../../utils/helpers';

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoReady: false,
      duration: null,
      videoTime: 0,
      d: null,
      options: null
    };
    this.player = {};
  }

  stateChange = e => {
    if (e.data === YT.PlayerState.PLAYING) {
    }
  };

  videoReady = e => {
    this.player = e.target;
    this.duration = this.player.getDuration();

    this.setState({
      videoReady: true,
      duration: this.player.getDuration()
    });

    this.refs.youtube.internalPlayer.getIframe().then(iframe => {
      const padLR = sizeFromPercentage(30, window.innerWidth) | 0;
      const padTB = sizeFromPercentage(20, window.innerHeight) | 0;
      const newSize = fitElement(
        1280,
        720,
        window.innerWidth - padLR,
        window.innerHeight - padTB
      );

      iframe.width = newSize.w;
      iframe.height = newSize.h;
      iframe.style.left = `${(window.innerWidth - newSize.w) / 2}px`;
      //iframe.style.top = `${(window.innerHeight - newSize.h) / 2}px`;
      iframe.style.opacity = 1;
    });
  };

  getVideoELement() {
    let video = null;

    if (this.props.videoURL) {
      const videoOpts = {
        width: 1280 | 0,
        height: 720 | 0,
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          controls: 1,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0
        }
      };

      video = (
        <YouTube
          ref='youtube'
          videoId={this.videoID}
          // className={string}                // defaults -> null
          opts={videoOpts}
          onReady={this.videoReady}
          // onPlay={func}                     // defaults -> noop
          // onPause={func}                    // defaults -> noop
          // onEnd={func}                      // defaults -> noop
          // onError={func}                    // defaults -> noop
          onStateChange={this.stateChange}
          // onPlaybackRateChange={func}       // defaults -> noop
          // onPlaybackQualityChange={func}    // defaults -> noop
        />
      );
    }

    return video;
  }

  componentDidMount() {
    this.videoID = getVideoId(this.props.videoURL).id;

    // axios.get('/assets/captions.srt').then(res => {
    //   let d = parse(res.data);
    //   let options = [];

    //   d.forEach(info => {
    //     let words = info.text.trim().split(',');

    //     words.forEach(word => {
    //       let slug = word
    //         .trim()
    //         .toLowerCase()
    //         .replace(/\s/g, '');
    //       let test = options.findIndex(
    //         obj => obj.hasOwnProperty('slug') && obj.slug === slug
    //       );

    //       if (slug) {
    //         if (test < 0) {
    //           options.push({ name: word.trim(), slug: slug, d: [info] });
    //         } else {
    //           options[test].d.push(info);
    //         }
    //       }
    //     });
    //   });

    //   this.setState({
    //     d: d,
    //     options: options
    //   });
    // });
  }

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

  render() {
    if (!this.props.playVideo) {
      return null;
    }
    let timelineEles = this.getTimelineEles();

    return (
      <div className='videoWrapper' ref='videoWrapper'>
        <span className='close' onClick={this.props.closeVideo}>
          X
        </span>
        {this.getVideoELement()}
        <div ref='timeline' className='timeline'>
          <div className='wrapper'>{timelineEles}</div>
        </div>
        <div ref='tip' className='tip' />
      </div>
    );
  }
}
