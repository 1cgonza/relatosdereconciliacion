import React, { Component } from 'react';
import TaxMenu from './ui/TaxMenu';

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

  getContent(contentClass) {
    if (this.props.location.pathname === '/') {
      return (
        <TaxMenu grid={contentClass} updateMarkers={this.props.updateMarkers} />
      );
    } else {
      return null;
    }
  }

  render() {
    let logoclass = 'm-30 t-20 d-20 ld-20';

    return <div />;
  }
}
