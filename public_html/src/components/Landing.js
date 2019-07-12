import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DataStore from './../stores/DataStore.js';
import { random } from './../utils/helpers';

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.imgs = [];
    this.loop;
    this.current;
  }

  displayImg() {
    const img = this.imgs[random(0, this.imgs.length)];
    const gradient = 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))';

    if (this.current === img) {
      this.displayImg();
      return;
    }

    if (this.refs.flip.classList.contains('active')) {
      this.refs.flop.style.backgroundImage = `${gradient}, url(${img.src})`;
      this.refs.flip.classList.remove('active');
      this.refs.flop.classList.add('active');
    } else {
      this.refs.flip.style.backgroundImage = `${gradient}, url(${img.src})`;
      this.refs.flop.classList.remove('active');
      this.refs.flip.classList.add('active');
    }

    this.current = img;
  }

  componentDidMount() {
    let projects = DataStore.getAllProjects();

    // shuffle
    for (let i = projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [projects[i], projects[j]] = [projects[j], projects[i]];
    }

    projects.forEach(project => {
      if (project.featured) {
        let img = new Image();
        img.onload = () => {
          this.imgs.push(img);

          if (this.imgs.length === 1) {
            this.displayImg();
          }
        };
        img.src = project.featured;
      } else {
        console.log('missing featured image:', project.title);
      }
    });

    this.loop = setInterval(() => {
      this.displayImg();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  render() {
    return (
      <main className='landingPage'>
        <div className='landingNav'>
          <div className='landingLogo' />
          <div className='landingLinks'>
            <Link className='landingLink' to='/largometraje'>
              Largometraje
            </Link>
            <Link className='landingLink' to='/interactivo'>
              Interactivo
            </Link>
          </div>
        </div>
        <div className='landingBg' ref='flip' />
        <div className='landingBg' ref='flop' />
      </main>
    );
  }
}
