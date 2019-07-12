import './scss/main.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Switch,
  withRouter,
  Link
} from 'react-router-dom';
import Landing from './components/Landing';
import Feature from './components/Feature';
import Home from './components/Interactive/Home';
import Project from './components/Interactive/Project';
import Player from './components/Player';
import Four04 from './components/404';
import DataActions from './actions/DataActions';
import Header from './components/Interactive/Header';
import Footer from './components/Footer';
import MainMenu from './components/Interactive/ui/MainMenu';

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
          render={() => <Project slug={project.slug} />}
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
          <MainMenu />
          <Link className='siteLogo' to='/' />
          <Switch>
            <Route exact path='/' component={Landing} />
            {projectsRoutes}
            <Route path='/largometraje' component={Feature} />
            <Route path='/interactivo' component={Home} />
            <Route path='/participa' />
            <Route path='/relatos' component={Player} />
            <Route component={Four04} />
          </Switch>
          <FooterRoute />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<Brain />, document.getElementById('root'));
