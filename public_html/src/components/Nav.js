import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import DataStore from '../stores/DataStore.js';

class Nav extends Component {
  render() {
    let allPages = DataStore.getAllPages();

    return (
      <header>
        {allPages.map((page) => {
          return <Link
              key={page.id}
              to={`/${page.slug}`}
            >{page.title.rendered}</Link>;
        })}
      </header>
    );
  }
}

export default Nav;
