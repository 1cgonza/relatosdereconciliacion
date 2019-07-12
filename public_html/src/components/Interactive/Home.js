import React from 'react';
import DataStore from '../../stores/DataStore';
import TaxMenu from './ui/TaxMenu';
import Map from '../../utils/Map';
import Marker from './Marker';
import Perlin from '../../utils/Perlin';
import River from './graphics/River';
import RiverColors from './graphics/RiverColors';
import Flock from './graphics/Flock';
import { TWO_PI } from '../../utils/const';
import { random, Debouncer } from '../../utils/helpers';
let animReq;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageW: 0,
      stageH: 0,
      ready: false
    };
    this.map = new Map({
      // Center of Colombia
      center: { lon: -74.297313, lat: 4.570917 },
      zoom: 10
    });
    this.perlin = new Perlin();
    this.debouncer = new Debouncer();
  }

  updateMarkers = () => {
    // force update by updating state
    this.setState({
      updateMarkers: true
    });
  };

  onResize = () => {
    this.debouncer.debounce().then(() => {
      this.setState({
        stageW: window.innerWidth,
        stageH: window.innerHeight
      });
    });
  };

  handleOver = e => {
    let slug = e.target.dataset.slug;
    let rel = document.querySelector(`.marker[data-slug=${slug}]`);

    if (rel) {
      rel.classList.add('hover');
    }
  };

  handleOut = e => {
    let slug = e.target.dataset.slug;
    let rel = document.querySelector(`.marker[data-slug=${slug}]`);

    if (rel) {
      rel.classList.remove('hover');
    }
  };

  getMarkers() {
    let projects = DataStore.getAllProjects();
    let taxonomies = DataStore.getTaxonomies();

    if (!this.state.ready || !projects) {
      return null;
    }

    window.cancelAnimationFrame(animReq);

    let activeViolenceIds = DataStore.getActiveTaxonomiesIds('violencia');
    let ret = '';
    let rivers = [];
    let perlin = this.perlin;

    this.ctx.clearRect(0, 0, this.state.stageW, this.state.stageH);

    projects = projects.filter(node => {
      let found = false;

      for (let i = 0; i < activeViolenceIds.length; i++) {
        if (node.violencia.find(id => activeViolenceIds[i] === id)) {
          found = true;
          break;
        }
      }

      return found;
    });

    const pad = window.innerWidth / projects.length;

    ret = projects.map((project, i) => {
      const baseX = pad * i;
      let x = random(baseX, pad * (i + 1) - 50);
      x = x + 100 > window.innerWidth ? window.innerWidth - 100 : x;

      const y = random(200, window.innerHeight - 200);
      const rStep = TWO_PI / project.violencia.length;

      project.violencia.forEach((violenceTax, i) => {
        let color = taxonomies.violencia.find(
          taxObj => taxObj.id == violenceTax
        ).color;
        rivers.push(
          new River(
            x + rStep / 2,
            y,
            (i + 1) * rStep,
            this.perlin,
            this.ctx,
            color
          )
        );
      });

      return (
        <Marker
          key={project.id}
          x={x}
          y={y}
          path={`/${project.slug}`}
          title={project.title}
          slug={project.slug}
        />
      );
    });

    function animate() {
      perlin.setSeed(rivers.length);

      rivers.forEach((river, i) => {
        if (river.finished) {
          rivers.splice(i, 1);
        }

        river.update();
      });

      if (rivers.length) {
        animReq = requestAnimationFrame(animate);
      } else {
        window.cancelAnimationFrame(animReq);
      }
    }

    animate();

    return ret;
  }

  componentDidMount() {
    this.canvas = this.refs.stage;
    this.ctx = this.canvas.getContext('2d');

    this.setState({
      stageW: window.innerWidth,
      stageH: window.innerHeight,
      ready: true
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(animReq);
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    let markers = this.getMarkers();
    let flock = DataStore.userAnim ? <Flock img={DataStore.userAnim} /> : null;

    return (
      <main>
        <TaxMenu updateMarkers={this.updateMarkers} />
        <section className='homeLanding'>
          <div className='markers'>{markers}</div>

          <canvas
            id='stage'
            ref='stage'
            width={this.state.stageW}
            height={this.state.stageH}
            style={{ zIndex: 1 }}
          />
        </section>

        <RiverColors />
        {flock}
      </main>
    );
  }
}
