/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import Flexbox from 'flexbox-react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';
import Img from 'containers/App/Img';
import Banner from 'components/Header/banner.png';

import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

import { suBranding, appBar, version, whiteLabel } from 'utils/constants';
import { theme } from 'utils/theme';

import messages from 'components/Header/messages';

const MenuLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  height: .30em;
`;

const AppWrapper = styled.div`
  max-width: calc(1200px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 0px;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

const boldFooterWeight = 500;
const lightFooterWeight = 200;
const drawerWidth = 240;

const styles = (xtheme) => ({
  root: {
    width: '100%',
    marginTop: xtheme.spacing.unit * 3,
    zIndex: 1,
  },
  footer: {
    [xtheme.breakpoints.down('lg')]: {
      visibility: 'hidden',
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
    position: 'absolute',
    [xtheme.breakpoints.up('xl')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  mainPaper: {
    margin: 0,
    marginTop: (appBar ? '20px' : '20px'),
    padding: '40px',
    [xtheme.breakpoints.down('sm')]: {
      padding: '5px',
    },
  },
  content: {
    backgroundColor: xtheme.palette.background.default,
    width: '100%',
    padding: xtheme.spacing.unit * 0,
    paddingTop: xtheme.spacing.unit * 1,
    height: 'calc(100% - 56px)',
    marginTop: (appBar ? 36 : 0),
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
          <Button dense color="primary" onClick={this.handleDrawerToggle}>
            <MenuLink to="/">
              {whiteLabel ? null :
              <Img width="200px" src={Banner} alt="SUNCAT - Logo" />
              }
              {whiteLabel ?
                <div style={{ color: 'primary', textDecoration: 'none' }}>Catalysis Browser beta v{version}</div>
                :
                <div style={{ color: 'primary', textDecoration: 'none' }}>SUNCAT Browser beta v{version}</div>
              }
            </MenuLink>
          </Button>
        </div>
        <Divider />
        <div className={this.props.classes.drawerPaper}>
          <List>
            <List subheader={<ListSubheader>SEARCH</ListSubheader>}>
              <ListItem>
                <MenuLink to="/energies" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary" >
                    <FormattedMessage {...messages.energies} />
                  </Button>
                </MenuLink>
              </ListItem>


              <ListItem>
                <MenuLink to="/generalSearch" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary">
                    <FormattedMessage {...messages.generalSearch} />
                  </Button>
                </MenuLink>
              </ListItem>
            </List>


            {/*
            <List subheader={<ListSubheader>GROUPS</ListSubheader>}>
              <ListItem>
                <Button disabled dense color="primary" >
                  ...
                </Button>
              </ListItem>
            </List>
            */}

            <List subheader={<ListSubheader>APPS</ListSubheader>}>

              <ListItem>
                <MenuLink to="/yourNextApp" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary" >
                    <FormattedMessage {...messages.yourNextApp} />
                  </Button>
                </MenuLink>
              </ListItem>

              <ListItem>
                <MenuLink to="/activityMaps" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary" >
                    <FormattedMessage {...messages.activityMaps} />
                  </Button>
                </MenuLink>
              </ListItem>

              <ListItem>
                <MenuLink>
                  <Button disabled dense color="primary" >
                    AtoML
                  </Button>
                </MenuLink>
              </ListItem>

              <ListItem>
                <MenuLink to="/pourbaixDiagrams" onClick={this.handleDrawerToggle}>
                  <Button disabled dense color="primary" >
                    <FormattedMessage {...messages.pourbaixDiagrams} />
                  </Button>
                </MenuLink>
              </ListItem>

              <ListItem>
                <MenuLink to="/publications" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary" >
                    <FormattedMessage {...messages.publications} />
                  </Button>
                </MenuLink>
              </ListItem>


              <ListItem>
                <MenuLink to="/scalingRelations" onClick={this.handleDrawerToggle}>
                  <Button disabled dense color="primary" >
                    <FormattedMessage {...messages.scalingRelations} />
                  </Button>
                </MenuLink>
              </ListItem>


            </List>

            <List subheader={<ListSubheader>API</ListSubheader>}>

              <ListItem>
                <MenuLink to="/graphQLConsole" onClick={this.handleDrawerToggle}>
                  <Button dense color="primary" >
                    <FormattedMessage {...messages.graphqlconsole} />
                  </Button>
                </MenuLink>
              </ListItem>
            </List>
          </List>
        </div>
      </div>
    );

    return (
      <div>
        {suBranding === false || appBar === true ? null :
        <div id="brandbar">
          <div className="container">
            <a href="http://www.stanford.edu" style={{ margin: 60 }}>
              <img src="https://www.stanford.edu/su-identity/images/brandbar-stanford-logo@2x.png" alt="Stanford University" width="152" height="23" />
            </a>
          </div>
        </div>
        }
        {appBar === false ? null :
        <div>
          <AppBar position="fixed" className={this.props.classes.appBar}>
            <Toolbar>
              <IconButton onClick={this.handleDrawerToggle} color="contrast" aria-label="Menu" className={this.props.classes.navIconHide}>
                {/* onClick event has to be on IconButton to work w/ Firefox. */}
                <MenuIcon />
              </IconButton>
              { suBranding === false ? null :
              <a href="http://www.stanford.edu" style={{ margin: 0, marginLeft: 20 }}>
                <img src="https://www.stanford.edu/su-identity/images/brandbar-stanford-logo@2x.png" alt="Stanford University" width="152" height="23" />
              </a>
              }
              <Typography type="body1" color="inherit" style={{ marginLeft: 20 }}>
                {whiteLabel ?
                  `${this.props.location.pathname}` :
                  `CatApp${this.props.location.pathname}`}
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden xlUp>
            <Drawer
              type="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.drawerOpen}
              onRequestClose={this.handleDrawerToggle}
              className={this.props.classes.drawerPaper}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              { drawer }
            </Drawer>
          </Hidden>
          <Hidden xlDown implementation="css">
            <Drawer
              type="permanent"
              open
              className={this.props.classes.drawerPaper}
            >
              { drawer }
            </Drawer>
          </Hidden>
        </div>
        }
        <main className={this.props.classes.content}>
          <AppWrapper>
            <Paper
              className={this.props.classes.mainPaper}
              elevation={8}
            >
              <Helmet
                titleTemplate="%s - CatApp Browser"
                defaultTitle="CatApp Browser"
                meta={[
                  { name: 'description', content: 'CatApp Browser' },
                ]}
                link={suBranding === false && appBar === false ? [] : [
                  { rel: 'stylesheet', href: 'https://www.stanford.edu/su-identity/css/su-identity.css' },
                  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200' },
                ]}
              />
              <Header />
              {React.Children.toArray(this.props.children)}
            </Paper>
            <Footer />
          </AppWrapper>
        </main>
        {suBranding === false ? null :
        <div className={this.props.classes.footer}>
          <Flexbox id="global-footer" flexDirection="column" justifyContent="space-around" style={{ marginTop: '0px' }}>
            <Flexbox flexDirection="row" justifyContent="space-around">
              <Flexbox flexDirection="column" justifyContent="space-around">
                <Flexbox flexDirection="row" justifyContent="space-around">
                  <Flexbox width="25vh" />
                  <Flexbox flexDirection="column" justifyContent="center">
                    <Flexbox>
                      <a href="http://www.stanford.edu">
                        <img src="https://www.stanford.edu/su-identity/images/footer-stanford-logo@2x.png" alt="Stanford University" width="105" height="49" />
                      </a>
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
                        <li className="home"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu">Stanford Home</a></li>
                        <li className="maps alt"><a style={{ fontWeight: boldFooterWeight }} href="http://visit.stanford.edu/plan/maps.html">Maps &amp; Directions</a></li>
                        <li className="search-stanford"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu/search/">Search Stanford</a></li>
                        <li className="terms alt"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu/site/terms.html">Terms of Use</a></li>
                        <li className="emergency-info"><a style={{ fontWeight: boldFooterWeight }} href="http://emergency.stanford.edu">Emergency Info</a></li>
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
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  children: React.PropTypes.node,
  location: PropTypes.object.isRequired,
};

export default (withProgressBar(withStyles(styles, { withTheme: true })(App)));
