import React, {Component} from 'react';
import DataStore from '../stores/DataStore.js';

export default class Home extends Component {
  render() {
    let page = DataStore.getPageBySlug('sobre');

    return (
      <div>
        <h1>{page.title.rendered}</h1>
      </div>
    );
  }
}
