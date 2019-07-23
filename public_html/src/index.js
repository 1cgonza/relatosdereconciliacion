import './scss/main.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import DataActions from './actions/DataActions';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import About from './components/About';
import Four04 from './components/404';
import Home from './components/Interactive/Home';
import Project from './components/Interactive/Project';
import Relatos from './components/Interactive/Relatos';

class Brain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      projects: []
    };
  }

  getProjectsRoutes() {
    if (!this.state.projects.length) {
      return null;
    }

    return this.state.projects.map(project => {
      return (
        <Route
          key={project.slug}
          path={`/${project.slug}`}
          render={props => <Project slug={project.slug} {...props} />}
        />
      );
    });
  }

  componentDidMount() {
    DataActions.init(res => {
      this.setState({
        projects: res.projects,
        loaded: true
      });
      document.getElementById('preloader').style.opacity = 0;
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    const projectsRoutes = this.getProjectsRoutes();
    const HeaderRoute = withRouter(props => <Header {...props} />);
    const FooterRoute = withRouter(props => <Footer {...props} />);

    return (
      <BrowserRouter basename='/'>
        <div className='wrapper'>
          <HeaderRoute />
          <Switch>
            <Route exact path='/' component={Landing} />
            {projectsRoutes}
            <Route path='/sobre' component={About} />
            <Route path='/interactivo' component={Home} />
            <Route path='/participa' />
            <Route path='/relatos' component={Relatos} />
            <Route component={Four04} />
          </Switch>
          <FooterRoute />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Brain />, document.getElementById('root'));
