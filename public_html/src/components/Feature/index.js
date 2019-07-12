import React from 'react';
import DataStore from '../../stores/DataStore';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <main>
        <section className='featurePage'>
          <h1>Largometraje</h1>
        </section>
      </main>
    );
  }
}
