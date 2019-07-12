import React from 'react';
import DataStore from '../../../stores/DataStore.js';

export default class TaxMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      filtered: false
    };
    this.violenceRefs = [];
    this.techRefs = [];
  }

  handleAllClick = e => {
    DataStore.activateAll();
    this.setState({ filtered: false });
    this.props.updateMarkers();
  };

  handleTaxClick = e => {
    let ele = e.target;
    let id = +ele.dataset.taxid.replace('tax', '');

    if (this.state.filtered && ele.classList.contains('active')) {
      DataStore.activateTax('violencia', id, false);
    } else if (this.state.filtered && !ele.classList.contains('active')) {
      DataStore.activateTax('violencia', id, true);
    } else {
      DataStore.activateExclusively('violencia', [id]);

      this.setState({ filtered: true });
    }

    this.props.updateMarkers();
  };

  handleTechClick = e => {
    let ele = e.target;
    let id = +ele.dataset.taxid.replace('tax', '');
    let rels = DataStore.getTaxonomiesRelationship()[ele.dataset.taxid];

    if (!this.state.filtered) {
      this.setState({ filtered: true });
    }

    DataStore.activateExclusively('violencia', rels);
    DataStore.activateExclusively('tecnicas', [id]);

    this.props.updateMarkers();
  };

  createTaxMenuElements(type, taxonomies) {
    return taxonomies.map(tax => {
      let span = (
        <span
          key={tax.slug}
          ref={`tax${tax.id}`}
          className={tax.active ? 'tax active' : 'tax'}
          data-taxid={`tax${tax.id}`}
          data-type={type}
          onClick={
            type === 'violencia' ? this.handleTaxClick : this.handleTechClick
          }
          style={{ borderColor: tax.color }}
        >
          {tax.name}
        </span>
      );

      return span;
    });
  }

  getTaxMenu() {
    if (!this.state.loaded) {
      return null;
    }
    let taxonomies = DataStore.getTaxonomies();
    let violence = this.createTaxMenuElements(
      'violencia',
      taxonomies.violencia
    );
    let techniques = this.createTaxMenuElements(
      'tecnicas',
      taxonomies.tecnicas
    );

    return (
      <div id='taxonomiesMenu' className={this.props.grid}>
        <div className='typesViolence' ref='violenceContainer'>
          <span
            ref='all'
            className={this.state.filtered ? 'tax all' : 'tax all active'}
            onClick={this.handleAllClick}
          >
            Todos
          </span>
          {violence}
        </div>
        <div className='typesTechnique' ref='techniquesContainer'>
          {techniques}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      loaded: true
    });

    let taxonomies = DataStore.getTaxonomies();

    taxonomies.violencia.forEach(tax => {
      this.violenceRefs.push(`tax${tax.id}`);
    });

    taxonomies.tecnicas.forEach(tax => {
      this.techRefs.push(`tax${tax.id}`);
    });
  }

  render() {
    return this.getTaxMenu();
  }
}
