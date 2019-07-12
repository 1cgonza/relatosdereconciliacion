import React, {Component} from 'react';
import DataStore from '../stores/DataStore.js';

function renderGround(c) {
  var ctx = c.getContext('2d');
  var stageW = c.width = document.body.clientWidth;
  var stageH = c.height = window.innerHeight;

  var img = new Image();
  img.onload = function(e) {
    var imgW = img.naturalWidth;
    var imgH = img.naturalHeight;

    ctx.drawImage(img, 0, stageH - 300);
    ctx.drawImage(img, stageW - imgW, stageH - 300);

  };
  img.src = '/assets/bg/pasto1.png';
}

export default class Center extends Component {
  constructor(props) {
    super(props);
    this.state = {view: 'center', scrollTop: 0, scrollTick: 0};

    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    let scrollTop = e.srcElement.body.scrollTop;

    if (this.state.scrollTop === 0 && scrollTop === 0) {
      this.setState(prevState => ({
        scrollTick: prevState.scrollTick++
      }));
    }
  };

  componentDidMount() {
    renderGround(this.refs.canvasPiso);
  }

  render() {
    let pad = 200;
    let page = DataStore.getPageBySlug(this.props.slug);
    let height = window.innerHeight + (pad * 2);
    console.log(page);

    return (
      <canvas
        id='piso'
        ref='canvasPiso'
        style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}
      />
    );
  }
}
