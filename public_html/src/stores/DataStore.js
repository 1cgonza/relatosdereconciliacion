import alt from '../alt/alt.js';
import DataActions from '../actions/DataActions.js';
import { riverColors } from '../components/Interactive/ui/Colors';

class DataStore {
  constructor() {
    this.data = {};
    this.techniquesData = [];
    this.themesData = [];
    this.c = 0;

    this.bindListeners({
      // Listen to the getSuccess() in DataActions.js
      handleSuccess: DataActions.GET_SUCCESS
    });

    this.exportPublicMethods({
      getAll: this.getAll,
      getAllPages: this.getAllPages,
      getPageBySlug: this.getPageBySlug,
      getAllProjects: this.getAllProjects,
      getRandomProject: this.getRandomProject,
      getTaxonomies: this.getTaxonomies,
      getPrevNextProjects: this.getPrevNextProjects,
      activateTax: this.activateTax,
      activateExclusively: this.activateExclusively,
      activateAll: this.activateAll,
      toggleTaxGlobalState: this.toggleTaxGlobalState,
      deactivateAll: this.deactivateAll,
      getActiveTaxonomies: this.getActiveTaxonomies,
      getActiveTaxonomiesIds: this.getActiveTaxonomiesIds,
      getTaxonomiesRelationship: this.getTaxonomiesRelationship
    });
  }

  // Store data returned by getSuccess() in DataActions.js
  handleSuccess(data) {
    let riversLen = riverColors.length;
    Object.keys(data.tax).map(key => {
      data.tax[key].map((taxObj, i) => {
        taxObj.color = riverColors[i % riversLen];
        taxObj.active = true;
      });
    });

    let taxRelationship = {};

    data.projects.forEach(project => {
      this.parseSubs(project.techniquesSrt, this.techniquesData, project.slug);
      this.parseSubs(project.themesSrt, this.themesData, project.slug);
      project.tecnicas.forEach(techniqueId => {
        let key = `tax${techniqueId}`;
        if (!taxRelationship.hasOwnProperty(key)) {
          taxRelationship[key] = [];
        }

        taxRelationship[key] = taxRelationship[key].concat(
          project.violencia.filter(violenceId => {
            return taxRelationship[key].indexOf(violenceId) == -1;
          })
        );
      });
    });

    data.taxRelationship = taxRelationship;

    this.setState({ data });
  }

  parseSubs(d, store, name) {
    if (!d) return;

    // const exists = this.playerData.findIndex(obj => obj.hasOwnProperty(''))

    d.forEach(info => {
      let terms = info.text.trim().split(',');

      terms.forEach(term => {
        const slug = term
          .trim()
          .toLowerCase()
          .replace(/\s/g, '');

        const test = store.findIndex(
          obj => obj.hasOwnProperty('slug') && obj.slug === slug
        );

        this.c++;

        if (slug) {
          if (test < 0) {
            store.push({ name: term.trim(), slug: slug, d: [info] });
          } else {
            store[test].d.push(info);
          }
        }
      });
    });
  }

  toggleTaxGlobalState(key, id) {
    let arrPosition = this.state.data.tax[key].findIndex(taxObj => {
      return taxObj.id == id;
    });

    if (arrPosition >= 0) {
      this.state.setState(prevState => {
        prevState.data.tax[key][arrPosition].active = !prevState.data.tax[key][
          arrPosition
        ].active;
        return { data: prevState.data };
      });
    }
  }

  activateAll() {
    this.state.setState(prevState => {
      const violence = prevState.data.tax['violencia'];
      const techs = prevState.data.tax['tecnicas'];

      violence.forEach((el, i) => {
        prevState.data.tax['violencia'][i].active = true;
      });

      techs.forEach(
        (el, i) => (prevState.data.tax['tecnicas'][i].active = true)
      );

      return { data: prevState.data };
    });
  }

  deactivateAll(type) {
    this.state.setState(prevState => {
      let tax = prevState.data.tax[type];

      tax.forEach((el, i) => {
        prevState.data.tax[type][i].active = false;
      });

      return { data: prevState.data };
    });
  }

  activateTax(type, taxId, isActive) {
    this.state.setState(prevState => {
      if (Array.isArray(taxId)) {
        taxId.forEach(id => {
          const i = prevState.data.tax[type].findIndex(ele => ele.id === id);
          if (i >= 0) prevState.data.tax[type][i].active = isActive;
        });
      } else {
        const i = prevState.data.tax[type].findIndex(ele => ele.id === taxId);
        if (i >= 0) prevState.data.tax[type][i].active = isActive;
      }

      return { data: prevState.data };
    });
  }

  activateExclusively(type, arr) {
    if (!Array.isArray(arr)) {
      return;
    }

    this.state.setState(prevState => {
      let tax = prevState.data.tax[type];

      tax.forEach((el, i) => {
        if (!!arr.find(id => id === el.id)) {
          prevState.data.tax[type][i].active = true;
        } else {
          prevState.data.tax[type][i].active = false;
        }
      });

      return { data: prevState.data };
    });
  }

  getTaxonomies() {
    return this.getState().data.tax;
  }

  getTaxonomiesRelationship() {
    return this.getState().data.taxRelationship;
  }

  getActiveTaxonomiesIds(type) {
    return this.getState()
      .data.tax[type].filter(taxObj => taxObj.active)
      .map(taxObj => taxObj.id);
  }

  getActiveTaxonomies(type) {
    return this.getState().data.tax[type].filter(taxObj => taxObj.active);
  }

  // Returns all pages and posts
  getAll() {
    return this.getState().data;
  }

  // Returns all Pages
  getAllPages() {
    return this.getState().data.pages;
  }

  getAllProjects() {
    return this.getState().data.projects;
  }

  getRandomProject() {
    const projects = this.getState().data.projects;
    const i = (Math.random() * projects.length) | 0;
    return projects[i];
  }

  // Returns all Posts
  getAllPosts() {
    return this.getState().posts;
  }

  // Returns a Page by provided slug
  getPageBySlug(slug, type) {
    type = type || 'pages';
    const pages = this.getState().data[type];
    return (
      pages[
        Object.keys(pages).find(page => {
          return pages[page].slug === slug;
        })
      ] || {}
    );
  }

  getPrevNextProjects(currentSlug) {
    const projects = this.getAllProjects();
    const keys = Object.keys(projects);
    const current = keys.findIndex(key => {
      return projects[key].slug === currentSlug;
    });

    return {
      prev:
        current - 1 >= 0
          ? projects[current - 1].slug
          : projects[projects.length - 1].slug,
      next:
        current + 1 < keys.length
          ? projects[current + 1].slug
          : projects[0].slug
    };
  }
}

export default alt.createStore(DataStore, 'DataStore');
