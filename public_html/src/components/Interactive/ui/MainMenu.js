import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onClick = () => {
    this.setState(prevState => ({
      isOpen: !this.state.isOpen
    }));
  };

  render() {
    let iconClass = 'mainMenu';

    return (
      <div
        ref='menu'
        className={this.state.isOpen ? `open ${iconClass}` : iconClass}
      >
        <span ref='menuIcon' id='menuIcon' onClick={this.onClick}>
          <span />
        </span>

        <div id='menuContent'>
          <div className='links'>
            <Link
              to='/participa'
              className='menuIcon participa'
              onClick={this.onClick}
            >
              Participa
            </Link>
            <Link to='/' className='menuIcon home' onClick={this.onClick}>
              Inicio
            </Link>
            <Link
              to='/relatos'
              className='menuIcon player'
              onClick={this.onClick}
            >
              Relatos
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
