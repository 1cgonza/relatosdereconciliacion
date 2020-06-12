import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Painter from './graphics/Painter';
import {
  Debouncer,
  rgbToHex,
  sizeFromPercentage,
  getPercent
} from '../../utils/helpers';
import { pajaros } from './graphics/sprites';
import { fitElement } from '../../utils/helpers';
import DataStore from '../../stores/DataStore';
import GIFEncoder from '../../../public/js/GIFEncoder';
import encode64 from '../../../public/js/b64';

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
      ready: false,
      downloading: false
    };

    this.debouncer = new Debouncer();
  }

  onResize = e => {
    this.debouncer.debounce().then(() => {});
    this.handleFrameSelect({ target: document.querySelector('input[type="radio"][name="frame"]:checked') });
  };

  changeWidth = e => this.setState({ lineWidth: e.target.value });
  changeOp = e => this.setState({ lineOp: e.target.value });
  changeTone = e => this.setState({ lineTone: e.target.value });
  handleBrushClick = e => this.setState({ style: +e.target.value });
  handleFrameSelect = e => this.setState({ frame: e.target.value });
  handleDrawModeClick = e => this.setState({ drawingMode: +e.target.value });
  handleEraseAllClick = e => this.setState({ eraseAll: true }, this.resetEraseAll);
  resetEraseAll = e => this.setState({ eraseAll: false, ready: false });

  playAnimation = e => {
    this.setState({
      play: !this.state.play
    });
  };

  downloadAnimation = e => {
    /*if (this.state.frames) {
      const encoder = new GIFEncoder();

      encoder.setRepeat(0);
      encoder.setDelay(100);
      encoder.start();

      this.state.frames?.forEach(frame => 
        encoder.addFrame(frame.ctx)
      );

      encoder.finish();
      encoder.download('mi-relato.gif');

      this.downloading = true;
    }*/
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
        resetEraseAll={this.resetEraseAll}
        download={this.state.download}
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

  handleSend = e => {
    if (!this.state.downloading) {
      const _this = e.target;
      _this.innerHTML = 'Generando gif...';

      this.setState({
        downloading: true
      });

      const encoder = new GIFEncoder();

      encoder.setRepeat(0);
      encoder.setDelay(60);
      encoder.start();

      const bgImage = new Image();
      bgImage.onload = () => {
        const img = new Image();
        img.onload = () => {

          const addFrames = i => {
            const frame = this.state.frames[i];
            if (frame) {
              const canvas = document.createElement('canvas');
              canvas.width = frame.canvas.width;
              canvas.height = frame.canvas.height;
              const ctx = canvas.getContext('2d');

              ctx.fillStyle = "#f0f4f5";

              ctx.drawImage(bgImage, 0, 0, frame.canvas.width, frame.canvas.height);

              ctx.drawImage(img, 0, 0, frame.canvas.width, frame.canvas.height);

              let framePaj = pajaros.frames[i];
              let dims = fitElement(framePaj.w, framePaj.h, frame.canvas.width, frame.canvas.height);

              ctx.globalAlpha = 0.2;

              //ctx.drawImage(this.birds, framePaj.x + 10, framePaj.y, framePaj.w - 20, framePaj.h, 10, 50, dims.w - 20, dims.h);

              ctx.globalAlpha = 1;

              const dibujo = new Image();
              dibujo.onload = () => {
                ctx.drawImage(dibujo, 0, 0, frame.canvas.width, frame.canvas.height);
                if (encoder.addFrame(ctx)) {
                  addFrames(i+1);
                }
              };
              dibujo.src = frame.canvas.toDataURL();
            }
            else {
              encoder.finish();
              encoder.download('mi-relato.gif');
              _this.innerHTML = 'Descargar gif';
              this.setState({
                downloading: false
              });
            }
          };

          addFrames(0);
        };
        img.src = '/assets/bg/papel-dibujo.png';
      };
      bgImage.src = '/assets/bg/clean-gray-paper.png';
    }
  };

  getReadyBtn() {
    if (!this.state.ready) {
      return null;
    }

    return (
      <Route
        render={() => (
          <span
            className='send'
            type='button'
            onClick={this.handleSend}
          >
            Descargar gif
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
    let playPause = !this.state.play ? 'Reproducir' : 'Pausar';
    let playing = this.state.play ? 'yes' : 'no';
    let ready = this.getReadyBtn();

    return (
      <div
        className='drawingContainer gridWrapper gridJustifyCenter'
        ref='drawingContainer'
      >
        {painter}

        <div className='drawingControls m-100 t-40 d-40 ld-30' style={{marginTop:131}}>
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
            <span className='controlsLabel'>Vista previa</span>
            <button
              id='play'
              ref='playPause'
              name='playPause'
              type='button'
              onClick={this.playAnimation}
              playing={playing}
              title={playPause}
            >
              <i className="icon-play"></i>
            </button>
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
