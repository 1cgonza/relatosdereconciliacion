import React, { Component } from 'react';
import { fitElement, getVideoId } from '../../utils/helpers';
import Player from './ui/Player';
import PlayPause from './ui/PlayPause';

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoReady: false,
      playbackReady: false,
      duration: 0,
      onTech: null,
      onTheme: null,
      position: null,
      playing: false
    };

    this.intervalID;
  }

  onResize = () => {
    if (!this.state.playbackReady) return;

    const dims = fitElement(
      1280,
      720,
      document.body.clientWidth,
      window.innerHeight
    );

    this.player.width = `${dims.w}px`;
    this.player.height = `${dims.h}px`;

    if (this.state.playing) {
      window.scrollTo({
        top: this.refs.videoWrapper.offsetHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // https://developer.dailymotion.com/player#player-api-events
  onPlaybackReady = e => {
    // add play button
    this.setState({
      playbackReady: true
    });
  };

  onPlay = e => {
    this.setState({
      playing: true
    });

    window.scrollTo({
      top: this.refs.videoWrapper.offsetHeight,
      left: 0,
      behavior: 'smooth'
    });
  };

  onPause = () => {
    this.setState({
      playing: false
    });
  };

  onLoadedMeta = () => {
    this.setState({
      videoReady: true,
      duration: this.player.duration
    });
  };

  onTimeUpdate = () => {
    console.log('on time update');
    if (this.state.position) {
      if (this.state.position.endTime <= currentTime) {
      }
      console.log(currentTime);
    }
  };

  getCurrentTime = () => {
    return this.player.currentTime;
  };

  updatePosition = position => {
    this.setState({
      position: position
    });
  };

  seekTo = time => {
    console.log(time >= this.player.duration);
    this.player.seek(time);
  };

  videoScriptLoaded = () => {
    const dims = fitElement(
      1280,
      720,
      document.body.clientWidth,
      window.innerHeight
    );

    this.player = DM.player(this.refs.player, {
      video: 'k7iU4FjoQRxDxuuf2oK',
      width: `${dims.w}px`,
      height: `${dims.h}px`,
      params: {
        autoplay: false,
        controls: false,
        quality: '720',
        'sharing-enable': false,
        'ui-logo': false,
        'ui-start-screen-info': false,
        fullscreen: false,
        mute: false
      }
    });

    this.player.addEventListener('playback_ready', this.onPlaybackReady);
    this.player.addEventListener('loadedmetadata', this.onLoadedMeta);
    this.player.addEventListener('play', this.onPlay);
    this.player.addEventListener('pause', this.onPause);
    this.player.addEventListener('timeupdate', this.onTimeUpdate);
    // this.player.addEventListener('controlschange', this.onContolsChange);
    // this.player.addEventListener('start', this.onVideoStart);
    // this.player.addEventListener('progress', this.onProgress);
    // this.player.addEventListener('playing', this.onPlaying);
    // this.player.addEventListener('waiting', this.onBuffering);
    // this.player.addEventListener('apiready', this.videoApiReady);
  };

  componentDidMount() {
    // Load DailyMotion SDK
    const dailyMotionS = document.createElement('script');
    dailyMotionS.async = true;
    dailyMotionS.src = 'https://api.dmcdn.net/all.js';
    const siteS = document.getElementsByTagName('script')[0];
    siteS.parentNode.insertBefore(dailyMotionS, siteS);
    window.dmAsyncInit = this.videoScriptLoaded;

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.player.removeEventListener('playback_ready', this.onPlaybackReady);
    this.player.removeEventListener('loadedmetadata', this.onLoadedMeta);
    this.player.removeEventListener('play', this.onPlay);
    this.player.removeEventListener('pause', this.onPause);
    this.player.removeEventListener('timeupdate', this.onTimeUpdate);

    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div id='videoWrapper' ref='videoWrapper'>
        <div ref='player' />
        <PlayPause
          ready={this.state.playbackReady}
          playing={this.state.playing}
        />
        <Player
          slug={this.props.slug}
          duration={this.state.duration}
          seekTo={this.seekTo}
          getCurrentTime={this.getCurrentTime}
          updatePosition={this.updatePosition}
        />
      </div>
    );
  }
}
