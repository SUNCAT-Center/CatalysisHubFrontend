/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

import { isIOS, isMobile, isTablet } from 'react-device-detect';

import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';
import Img from 'containers/App/Img';
import Banner from 'components/Header/banner.png';
import AppSnackBar from 'containers/AppSnackBar';
import { getAppIcon } from 'utils/functions';

import { MdChevronLeft,
  MdSearch,
  MdApps,
} from 'react-icons/lib/md';

import { FaNewspaperO } from 'react-icons/lib/fa';

import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import withWidth from 'material-ui/utils/withWidth';

import { apps, appBar, suBranding, version, whiteLabel } from 'utils/constants';
import { theme } from 'utils/theme';

import { styles } from './styles';

const AppWrapper = styled.div`
  max-width: calc(1200px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 0px;
  flex-direction: column;
`;




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }
  handleDrawerToggle() {
    this.setState({
      drawerOpen: !this.state.drawerOpen,
    });
  }

  render() {
    const drawer = (
      <div>
        <div className={this.props.classes.drawerHeader}>
          <Button color="primary" onClick={this.handleDrawerToggle}>
            <Link to="/" className={this.props.classes.menuLink}>
              {whiteLabel ? null :
              <Img width="200px" src={Banner} alt="SUNCAT - Logo" />
              }
              {whiteLabel ?
                <div style={{ color: 'primary', textDecoration: 'none' }}>Catalysis Browser beta v{version}</div>
                  :
                <div style={{ color: 'primary', textDecoration: 'none' }}>Catalysis-Hub.org v{version}</div>
              }
            </Link>
          </Button>
        </div>

        <Divider className={this.props.classes.divider} />

        <List
          subheader={<ListSubheader className={this.props.classes.subListHeader}>
            <Link to="/energies" onClick={this.handleDrawerToggle} className={this.props.classes.topMenuLink}>
              <MdSearch />{'\u00A0\u00A0 '}Search
            </Link>
          </ListSubheader>}
        >
        </List>

        <Divider className={this.props.classes.divider} />

        <List
          subheader={<ListSubheader className={this.props.classes.subListHeader}>
            <Link to="/appsIndex" onClick={this.handleDrawerToggle} className={this.props.classes.topMenuLink}>
              <MdApps />{'\u00A0\u00A0 '}Apps
            </Link>
          </ListSubheader>}
        >
          {apps.map((app, i) => (
            <div key={`app_${i}`}>
              <ListItem className={this.props.classes.menuItem}>
                <Link
                  to={app.route}
                  onClick={this.handleDrawerToggle}
                  className={!_.isEmpty(app.route) ? this.props.classes.menuLink : this.props.classes.inactiveLink}
                >
                  {getAppIcon(app.title)} {app.title}

                </Link>
              </ListItem>
              {_.isEmpty(app.children) ? null :
              <List>
                {app.children.map((child, j) => (
                  <ListItem key={`child_${i}_${j}`}>
                    <Link
                      to={`${app.route}/${child.route}`}
                      onClick={this.handleDrawerToggle}
                      className={!_.isEmpty(child.route) ? this.props.classes.menuLink : this.props.classes.inactiveLink}
                    >
                      {child.title}
                    </Link>
                  </ListItem>
                    )
                    )}
              </List>
              }
            </div>

          )

          )}
        </List>

        <Divider className={this.props.classes.divider} />
      </div>
    );

    return (
      <div className={this.props.classes.mainContainer}>
        <AppSnackBar />
        {suBranding === false || appBar === true ? null :
        <div id="brandbar">
          <div className="container">
            <ReactGA.OutboundLink
              to="http://www.stanford.edu"
              eventLabel="http://www.stanford.edu"
              style={{ margin: 10 }}
              target="_blank"
            >
              <img src="https://www.stanford.edu/su-identity/images/brandbar-stanford-logo@2x.png" alt="Stanford University" width="152" height="23" />
            </ReactGA.OutboundLink>
          </div>
        </div>
        }
        {appBar === false ? null :
        <div>
          <AppBar position="fixed" className={this.props.classes.appBar}>
            <Toolbar>
              <Grid
                container
                direction="row"
                justify="space-between"
                className={this.props.classes.toolbar}
              >
                {isMobile ?
                  <Grid
                    item sm={2} md={2} lg={1}
                    className={this.props.classes.appBarGridItem}
                  >
                    { (!isIOS || this.props.history === null) ? null :
                    <IconButton onClick={browserHistory.goBack} color="inherit" aria-label="Back" className={this.props.classes.backLink} >
                      <MdChevronLeft />
                    </IconButton>

                          }
                    <Tooltip title="Open menu">
                      <IconButton onClick={this.handleDrawerToggle} color="inherit" aria-label="Menu" className={`${this.props.classes.navIconHide} ${this.props.classes.textLink}`}>
                        {/* onClick event has to be on IconButton to work w/ Firefox. */}
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                        : '\u00A0\u00A0'
                    }
                {isTablet ? null :
                <Grid
                  item sm={4} md={isMobile ? 5 : 6} lg={isMobile ? 6 : 7}
                  className={this.props.classes.appBarGridItem}
                >
                  <Grid container direction="row" justify={isIOS ? 'space-around' : 'space-between'}>
                    <Grid item>
                      <Grid container direction="column" justify="center">
                        <Hidden xsDown>
                          <Grid item>
                            <Tooltip title={`v${version}`}>
                              <Link to="/" className={this.props.classes.appBarTitle} >
                                <Typography type="body1" color="inherit" className={this.props.classes.appBarTitle} >
                                  <span
                                    className={
                                      (window.location.href === 'https://www.catalysis-hub.org/')
                                        ? this.props.classes.activeAppBarLink
                                        : null}
                                  >
                                    {whiteLabel ? `${this.props.location.pathname}` : 'Catalysis-Hub.org'}
                                  </span>
                                </Typography>
                              </Link>
                            </Tooltip>
                          </Grid>
                        </Hidden>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                    }



                <Grid
                  item sm={4} md={4} lg={4}
                  className={this.props.classes.appBarGridItem}
                >

                  <Grid container direction="row" justify="flex-end" >
                    <Grid item className={window.location.href.indexOf('/publications') === -1 ? null : this.props.classes.activeAppBarLink}>
                      <Link to="/publications" className={this.props.classes.textLink}>
                        <Tooltip title="Browse Publications with Geometries">
                          <div>
                            <IconButton className={this.props.classes.barIcon} size="small" color="inherit" aria-label="Open List of Publications" >
                              <FaNewspaperO />
                            </IconButton>
                            <div className={this.props.classes.barText}>Publications</div>
                          </div>
                        </Tooltip>
                      </Link>
                    </Grid>


                    <Grid
                      item className={(
                  window.location.href.endsWith('/publications') ||
                  window.location.href.indexOf('/publications') > -1 ||
                  window.location.href.endsWith('/about') ||
                  window.location.href.endsWith('/')
                ) ? null : this.props.classes.activeAppBarLink}
                    >
                      <Link to="/appsIndex" className={this.props.classes.textLink}>
                        <Tooltip title="Open Apps Index">
                          <div>
                            <IconButton className={this.props.classes.barIcon} size="small" color="inherit" aria-label="Open Apps Index" >
                              <MdApps />
                            </IconButton>
                            <div className={this.props.classes.barText}>Apps</div>
                          </div>
                        </Tooltip>
                      </Link>
                    </Grid>



                    <Grid item className={window.location.href.indexOf('/about') === -1 ? null : this.props.classes.activeAppBarLink}>
                      <Link to="/about" className={this.props.classes.textLink}>
                        <Tooltip title="About This Website">
                          <div>
                            <div className={this.props.classes.barText}>About</div>
                          </div>
                        </Tooltip>
                      </Link>
                    </Grid>



                    <Hidden mdDown>
                      <Grid item>
                        <Link to="http://docs.catalysis-hub.org" target="_blank" className={this.props.classes.textLink}>
                          <Tooltip title="See Website Documentation. Opens in new tab.">
                            <div>
                              <div className={this.props.classes.barText}>Documentation</div>
                            </div>
                          </Tooltip>
                        </Link>
                      </Grid>
                    </Hidden>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Hidden xlUp >
            <Drawer
              type="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.drawerOpen}
              onClose={this.handleDrawerToggle}
              className={this.props.classes.drawerPaper}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              { drawer }
            </Drawer>
          </Hidden>
          <Hidden lgDown implementation="css">
            <Paper >
              <Drawer
                type="permanent"
                open
                className={this.props.classes.drawerPaper}
              >
                { drawer }
              </Drawer>
            </Paper>
          </Hidden>
        </div>
        }
        <main className={this.props.classes.content}>
          <Helmet
            defaultTitle="Catalysis-Hub.org"
            titleTemplate="%s | Catalysis-Hub.org"
            title={`${(_.startCase(this.props.location.pathname.replace('/', '')).match(/[A-Z][a-z]+/g) || ['Index']).join(' ')}`}
            link={suBranding === false && appBar === false ? [] : [
                { rel: 'stylesheet', href: 'https://www.stanford.edu/su-identity/css/su-identity.css' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200' },
            ]}
          >
            <meta
              name="description" content={`Catalysis-Hub.org is a web-platform for sharing data and software for computational catalysis research. The Surface Reactions database (CatApp v2.0) contains thousands of reaction energies and barriers from density functional theory (DFT) calculations on surface systems.
Under Publications, reactions and surface geometries can also be browsed for each publication or dataset. With an increasing number of Apps, the platform allows comprehensive and user-friendly access to heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.`}
            />
            <meta name="keywords" description={'heterogeneous catalysis, catalysis, adsorption, reaction energy, activation energy, chemistry, metals,density functional theory,scaling relations, activity maps,pourbaix diagrams,machine learning,quantum espresso,vasp,gpaw,data sets,electronic structure'} />
            <meta name="DC.title" content="Catalysis-Hub.org" />

          </Helmet>
          <AppWrapper>
            <Header />
            {React.Children.toArray(this.props.children)}
          </AppWrapper>
        </main>

        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  children: React.PropTypes.node,
  location: PropTypes.object.isRequired,
  history: PropTypes.object,
};
const mapStateToProps = (state) => ({
  history: state.get('route').get('locationBeforeTransitions'),
});

const mapDispatchToProps = () => ({
});

export default compose(
  withProgressBar,
  withWidth(),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(App);
