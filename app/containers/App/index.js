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

import { isIOS, isMobile } from 'react-device-detect';

import Flexbox from 'flexbox-react';
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

const AppWrapper = styled.div`
  max-width: calc(1200px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 0px;
  flex-direction: column;
`;

const boldFooterWeight = 500;
const lightFooterWeight = 200;
const drawerWidth = 240;

const styles = (xtheme) => ({
  toolbar: {
    padding: '0 3.1em 0 0',
  },
  appBarGridItem: {
    /* border: '1px solid black',*/
    /* leave here for debugging layout*/
  },
  mainContainer: {
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'block',
    position: 'relative',
    paddingBottom: 200,
  },
  backLink: {
    color: 'white',
    marginLeft: -xtheme.spacing.unit * 3,
  },
  textLink: {
    color: 'white',
    textDecoration: 'none',
  },
  appBarTitle: {
    marginTop: 13,
    marginLeft: 0,
    [xtheme.breakpoints.down('sm')]: {
      marginLeft: -20,
    },
    color: 'white',
    decoration: 'none',
    textDecoration: 'none',
    textDecorationStyle: 'none',
  },
  root: {
    width: '100%',
    marginTop: xtheme.spacing.unit * 3,
    zIndex: 1,
  },
  subListHeader: {
    marginTop: 10,
    marginBottom: 20,
    height: 25,
    padding: 5,
  },
  menuItem: {
    padding: 5,
  },
  inactiveTopMenuLink: {
    cursor: 'pointer',
    color: '#cccccc',
    fontSize: 15,
    fontWeight: 'bolder',
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  topMenuLink: {
    cursor: 'pointer',
    color: xtheme.palette.cardinalred[900],
    fontSize: 15,
    fontWeight: 'bolder',
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    '&:hover': {
      backgroundColor: xtheme.palette.cardinalred[100],
    },
  },
  menuLink: {
    cursor: 'pointer',
    color: xtheme.palette.cardinalred[900],
    fontSize: 15,
    marginLeft: xtheme.spacing.unit * 4,
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    height: 25,
    '&:hover': {
      backgroundColor: xtheme.palette.cardinalred[100],
    },
  },
  inactiveLink: {
    cursor: 'pointer',
    color: '#cccccc',
    fontSize: 15,
    marginLeft: xtheme.spacing.unit * 4,
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    height: 25,
  },
  menuButton: {
    textDecoration: 'none',
    textTransform: 'none',
  },
  divider: {
    marginTop: xtheme.spacing.unit * 3,
    marginBottom: xtheme.spacing.unit * 0,
  },
  footer: {
    [xtheme.breakpoints.down('lg')]: {
      visibility: 'hidden',
    },
  },
  barIcon: {
    [xtheme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  barText: {
    marginTop: 10,
    textDecoration: 'none',
    decoration: 'none',
    [xtheme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  helmet: {
    [xtheme.breakpoints.down('sm')]: {
      marginBottom: '-20px',
    },
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  drawerHeader: xtheme.mixins.toolbar,
  navIconHide: {
    [xtheme.breakpoints.up('xl')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [xtheme.breakpoints.up('xl')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  appBar: {
    [xtheme.breakpoints.up('xl')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  mainPaper: {
    margin: 0,
    marginTop: (appBar ? '20px' : '20px'),
    padding: '40px',
    [xtheme.breakpoints.down('md')]: {
      padding: '10px',
      paddingBottom: '40px',
    },
    [xtheme.breakpoints.down('sm')]: {
      padding: '2px',
      paddingBottom: '40px',
    },
  },
  content: {
    backgroundColor: xtheme.palette.background.default,
    width: '100%',
    padding: xtheme.spacing.unit * 0,
    paddingTop: xtheme.spacing.unit * 1,
    height: 'calc(100% - 56px)',
    marginTop: (appBar ? 80 : 0),
    [xtheme.breakpoints.up('lg')]: {
      height: 'calc(100% - 64px)',
      marginTop: 80,
    },
  },
});


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
                    item sm={1} md={1} lg={1}
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
                <Grid
                  item sm={4} md={isMobile ? 5 : 6} lg={isMobile ? 6 : 7}
                  className={this.props.classes.appBarGridItem}
                >
                  <Grid container direction="row" justify={isIOS ? 'space-around' : 'space-between'}>
                    <Grid item>
                      <Grid container direction="column" justify="center">
                        <Grid item>
                          <Tooltip title={`v${version}`}>
                            <Link to="/" className={this.props.classes.appBarTitle} >
                              <Typography type="body1" color="inherit" className={this.props.classes.appBarTitle} >
                                {whiteLabel ? `${this.props.location.pathname}` : 'Catalysis-Hub.Org'}
                              </Typography>
                            </Link>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>



                <Grid
                  item sm={4} md={4} lg={4}
                  className={this.props.classes.appBarGridItem}
                >

                  <Grid container direction="row" justify="flex-end">
                    <Grid item>
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



                    <Grid item>
                      <Link to="/publications" className={this.props.classes.textLink}>
                        <Tooltip title="Browse Publications with Geometries">
                          <div>
                            <IconButton className={this.props.classes.barIcon} size="small" color="inherit" aria-label="Open Apps Index" >
                              <FaNewspaperO />
                            </IconButton>
                            <div className={this.props.classes.barText}>Publications</div>
                          </div>
                        </Tooltip>
                      </Link>
                    </Grid>


                    <Grid item>
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
          <AppWrapper>
            <Helmet
              className={this.props.classes.helmet}
              titleTemplate="%s - Catalysis-Hub.Org"
              defaultTitle="Catalysis-Hub.Org"
              title={`${(_.startCase(this.props.location.pathname.replace('/', '')).match(/[A-Z][a-z]+/g) || ['Index']).join(' ')} - Catalysis-Hub.Org`}
              meta={[
                { name: 'description', content: `Catalysis-Hub.org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
      As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.` },
                { name: 'robots', content: 'index,follow' },
                { name: 'keywords', content: 'heterogeneous catalysis,metals,density functional theory,scaling relations, activity maps,pourbaix diagrams,machine learning,quantum espresso,vasp,gpaw' },
                { name: 'DC.title', content: 'Catalysis-Hub.org' },
              ]}
              link={suBranding === false && appBar === false ? [] : [
                { rel: 'stylesheet', href: 'https://www.stanford.edu/su-identity/css/su-identity.css' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200' },
              ]}
            />
            <Header />
            {React.Children.toArray(this.props.children)}
          </AppWrapper>
        </main>
        {suBranding === false ? null :
        <div>
          <Flexbox id="global-footer" flexDirection="column" justifyContent="space-around" style={{ marginTop: '0px' }}>
            <Flexbox flexDirection="row" justifyContent="space-around">
              <Flexbox flexDirection="column" justifyContent="space-around">
                <Flexbox flexDirection="row" justifyContent="space-around">
                  <Flexbox width="25vh" />
                  <Flexbox flexDirection="column" justifyContent="center">
                    <Flexbox>
                      <ReactGA.OutboundLink
                        to="http://www.stanford.edu"
                        eventLabel="http://www.stanford.edu"
                        target="_blank"
                      >
                        <img src="https://www.stanford.edu/su-identity/images/footer-stanford-logo@2x.png" alt="Stanford University" width="105" height="49" />
                      </ReactGA.OutboundLink>
                    </Flexbox>
                  </Flexbox>
                  <Flexbox width="10vh" />

                  <Flexbox flexDirection="column" justifyContent="space-around" className={this.props.classes.footer}>
                    <Flexbox height="10vh" />
                    <Flexbox
                      id="bottom-text"
                      className="span10"
                      height="5vh"
                      style={{
                        fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                      }}
                    >
                      <ul >
                        <li className="home"><ReactGA.OutboundLink style={{ fontWeight: boldFooterWeight }} to="http://www.stanford.edu" eventLabel="http://www.stanford.edu" target="_blank">Stanford Home</ReactGA.OutboundLink></li>
                        <li className="maps alt"><ReactGA.OutboundLink style={{ fontWeight: boldFooterWeight }} to="http://visit.stanford.edu/plan/maps.html" eventLabel="http://visit.stanford.edu/plan/maps.html">Maps &amp; Directions</ReactGA.OutboundLink></li>
                        <li className="search-stanford"><ReactGA.OutboundLink style={{ fontWeight: boldFooterWeight }} to="http://www.stanford.edu/search/" eventLabel="http://www.stanford.edu/search/">Search Stanford</ReactGA.OutboundLink></li>
                        <li className="terms alt"><ReactGA.OutboundLink style={{ fontWeight: boldFooterWeight }} to="http://www.stanford.edu/site/terms.html" eventLabel="http://www.stanford.edu/site/terms.html">Terms of Use</ReactGA.OutboundLink></li>
                        <li className="emergency-info"><ReactGA.OutboundLink style={{ fontWeight: boldFooterWeight }} to="http://emergency.stanford.edu" eventLabel="http://emergency.stanford.edu">Emergency Info</ReactGA.OutboundLink></li>
                      </ul>
                    </Flexbox>
                    <Flexbox height="1vh" />
                    <Flexbox className="clear">
                      <p
                        className="copyright vcard"
                        style={{
                          margin: 0,
                          fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                          fontWeight: lightFooterWeight,
                        }}
                      >&copy; <span className="fn org">Stanford University</span>.&nbsp;&nbsp;<span className="adr"> <span className="locality">Stanford</span>, <span className="region">California</span> <span className="postal-code">94305</span></span>.&nbsp;&nbsp;
                            <span id="copyright-complaint"></span>
                      </p>
                    </Flexbox>
                    <Flexbox height="20vh" />
                  </Flexbox>
                </Flexbox>
              </Flexbox>
              <Flexbox width="10vh" />
            </Flexbox>
          </Flexbox>
        </div>
        }
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
