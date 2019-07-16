import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainMenu from './Interactive/ui/MainMenu';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      logoLoaded: false
    };
  }

  onClick = e => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const showMainMenu =
      location.pathname === '/' || location.pathname === '/largometraje';
    const menu = !showMainMenu ? <MainMenu /> : null;

    return (
      <header>
        {menu}
        <Link className='siteLogo' to='/' />
      </header>
    );
  }
}
