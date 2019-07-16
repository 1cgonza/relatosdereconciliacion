import React, { Component } from 'react';
import Painter from './graphics/Painter';
import {
  Debouncer,
  rgbToHex,
  sizeFromPercentage,
  getPercent
} from '../../utils/helpers';
import { pajaros } from './graphics/sprites';
import { Route } from 'react-router-dom';
import DataStore from '../../stores/DataStore';

export default class Drawing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lineWidth: 3,
      lineOp: 100,
      lineTone: 0,
      frame: 0,
      onion: 100,
      drawingMode: 1,
      style: 1,
      birdsLoaded: false,
      eraseAll: false,
      play: false,
      ready: false
    };

    this.debouncer = new Debouncer();
  }

  onResize = e => {
    this.debouncer.debounce().then(() => {});
  };

  changeWidth = e => this.setState({ lineWidth: e.target.value });
  changeOp = e => this.setState({ lineOp: e.target.value });
  changeTone = e => this.setState({ lineTone: e.target.value });
  handleBrushClick = e => this.setState({ style: +e.target.value });
  handleFrameSelect = e => this.setState({ frame: e.target.value });
  handleDrawModeClick = e => this.setState({ drawingMode: +e.target.value });
  handleEraseAllClick = e => this.setState({ eraseAll: true });
  resetEraseAll = e => this.setState({ eraseAll: false });

  playAnimation = e => {
    this.setState({
      play: !this.state.play
    });
  };

  buildFramesPreview() {
    if (this.state.birdsLoaded) {
      let pad = 5;
      let totalW =
        this.refs.drawingContainer.clientWidth -
        400 -
        pajaros.frames.length * (pad * 2);
      let frameW = totalW / pajaros.frames.length;
      let frameH = sizeFromPercentage(
        getPercent(frameW, pajaros.frames[0].w),
        pajaros.frames[0].h
      );
      let spriteW = frameW * (pajaros.frames.length / pajaros.rows);
      let spriteH = sizeFromPercentage(
        getPercent(spriteW, pajaros.width),
        pajaros.height
      );
      let x = 0;
      let y = 0;

      return (
        <fieldset className='frames' style={{ margin: 0, padding: 0 }}>
          {pajaros.frames.map((frame, i) => {
            x = i % pajaros.cols;

            let ret = (
              <input
                key={`frame${i}`}
                type='radio'
                name='frame'
                className='frameBtn'
                onChange={this.handleFrameSelect}
                value={i}
                checked={this.state.frame == i ? true : false}
                style={{
                  width: `${frameW}px`,
                  height: `${frameH}px`,
                  margin: `${0} ${pad}px`,
                  backgroundSize: `${spriteW}px ${spriteH}px`,
                  backgroundPosition: `${-frameW * x}px ${-frameH * y}px`
                }}
              />
            );

            y = x === pajaros.cols - 1 ? y + 1 : y;

            return ret;
          })}
        </fieldset>
      );
    }

    return null;
  }

  readyToSend = frames => {
    this.setState({
      ready: true,
      frames: frames
    });
  };

  getPainter() {
    if (!this.state.birdsLoaded) {
      return null;
    }

    return (
      <Painter
        grid='m-100 t-60 d-60 ld-60'
        totalFrames={pajaros.frames.length}
        drawingMode={this.state.drawingMode}
        lineWidth={this.state.lineWidth}
        lineOp={this.state.lineOp}
        lineTone={this.state.lineTone}
        style={this.state.style}
        frame={this.state.frame}
        birdsImg={this.birds}
        eraseAll={this.state.eraseAll}
        play={this.state.play}
        readyToSend={this.readyToSend}
      />
    );
  }

  componentDidMount() {
    this.birds = new Image();
    this.birds.onload = e => {
      this.setState({ birdsLoaded: true });
    };
    this.birds.src = pajaros.url;

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  handleSend = history => {
    let frames = this.state.frames;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let w = frames[0].canvas.width;
    let h = frames[0].canvas.height;
    canvas.width = w * 4;
    canvas.height = h * 2;

    ctx.drawImage(frames[0].canvas, 0, 0);
    ctx.drawImage(frames[1].canvas, w, 0);
    ctx.drawImage(frames[2].canvas, w * 2, 0);
    ctx.drawImage(frames[3].canvas, w * 3, 0);
    ctx.drawImage(frames[4].canvas, 0, h);
    ctx.drawImage(frames[5].canvas, w, h);
    ctx.drawImage(frames[6].canvas, w * 2, h);
    ctx.drawImage(frames[7].canvas, w * 3, h);

    let d = {
      w: w * 4,
      h: h * 2,
      frameW: w,
      frameH: h,
      cols: 4,
      rows: 2,
      cellOffsetX: w / 2,
      cellOffsetY: h / 2,
      framesPerImage: 4,
      loopEnd: 4 * 4
    };

    canvas.toBlob(blob => {
      let url = (URL || webkitURL).createObjectURL(blob);
      let anim = new Image();
      anim.onload = () => {
        DataStore.userAnim = anim;
        DataStore.userAnimD = d;
        history.push('/');
      };
      anim.src = url;
    });
  };

  getReadyBtn() {
    if (!this.state.ready) {
      return null;
    }

    return (
      <Route
        render={({ history }) => (
          <span
            className='send'
            type='button'
            onClick={() => {
              this.handleSend(history);
            }}
          >
            Enviar
          </span>
        )}
      />
    );
  }

  render() {
    let lineWidth = this.state.lineWidth;
    let step = 50 / 150;
    let w = lineWidth * step;
    w = w <= 2 ? 2 : w;
    let hex = rgbToHex(this.state.lineTone) || '#0000';
    let frames = this.buildFramesPreview();
    let painter = this.getPainter();
    let playPause = !this.state.play ? 'play' : 'pause';
    let ready = this.getReadyBtn();

    return (
      <div
        className='drawingContainer gridWrapper gridJustifyCenter'
        ref='drawingContainer'
      >
        {painter}

        <div className='drawingControls m-100 t-40 d-40 ld-30'>
          <div className='controlsControl'>
            <span className='controlsLabel'>Dibujar / Borrar</span>
            <fieldset>
              <input
                type='radio'
                name='drawingMode'
                className='drawBtn uiBtn'
                onChange={this.handleDrawModeClick}
                value='1'
                checked={this.state.drawingMode == 1 ? true : false}
              />
              <input
                type='radio'
                name='drawingMode'
                className='eraseBtn uiBtn'
                onChange={this.handleDrawModeClick}
                value='0'
                checked={this.state.drawingMode == 0 ? true : false}
              />
              <input
                type='button'
                name='drawingMode'
                className='eraseAllBtn uiBtn'
                onClick={this.handleEraseAllClick}
                value=''
              />
            </fieldset>
          </div>

          <div className='controlsControl'>
            <span className='controlsLabel'>Pincel</span>
            <fieldset className='brushes'>
              <input
                type='radio'
                name='brushStyle'
                className='uiBtn brush brush1'
                onChange={this.handleBrushClick}
                value='0'
                checked={this.state.style == 0 ? true : false}
              />
              <input
                type='radio'
                name='brushStyle'
                className='uiBtn brush brush2'
                onChange={this.handleBrushClick}
                value='1'
                checked={this.state.style == 1 ? true : false}
              />
              <input
                type='radio'
                name='brushStyle'
                className='uiBtn brush brush3'
                onChange={this.handleBrushClick}
                value='2'
                checked={this.state.style == 2 ? true : false}
              />
            </fieldset>
          </div>

          <div className='controlsControl'>
            <span className='controlsLabel'>Tamaño</span>
            <input
              id='lineSlider'
              className='uiSlider'
              name='lineSlider'
              type='range'
              min='1'
              max='150'
              step='1'
              value={this.state.lineWidth}
              onChange={this.changeWidth}
            />
            <span className='controlsValue'>{this.state.lineWidth} px</span>
          </div>

          <div className='controlsControl'>
            <span className='controlsLabel'>Opacidad</span>
            <input
              id='opSlider'
              className='uiSlider'
              name='opSlider'
              type='range'
              min='1'
              max='100'
              step='1'
              value={this.state.lineOp}
              onChange={this.changeOp}
            />
            <span className='controlsValue'>{this.state.lineOp}</span>
          </div>

          <div className='controlsControl'>
            <span className='controlsLabel'>Tono</span>
            <input
              id='toneSlider'
              className='uiSlider'
              name='toneSlider'
              type='range'
              min='0'
              max='240'
              step='1'
              value={this.state.lineTone}
              onChange={this.changeTone}
              style={{ direction: 'rtl' }}
            />
            <span className='controlsValue'>{hex}</span>
          </div>

          <div className='controlsControl'>
            <span className='controlsLabel'>Reproductor</span>
            <input
              id='play'
              ref='playPause'
              name='toneSlider'
              type='button'
              value={playPause}
              onClick={this.playAnimation}
            />
          </div>
          {ready}
        </div>

        <div className='drawingControls animationControls'>
          <div className='controlsControl'>{frames}</div>
        </div>
      </div>
    );
  }
}
