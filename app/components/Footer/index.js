import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import { whiteLabel } from 'utils/constants';
import Img from 'containers/App/Img';
import WhiteBanner from 'components/Header/banner_white.png';
import Wrapper from './Wrapper';

const styles = (xtheme) => ({
  footerLink: {
    textColor: 'white',
    color: 'white',
    textDecoration: 'none',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: xtheme.palette.coolgrey[500],
    paddingLeft: '5%',
    paddingRight: '5%',
    [xtheme.breakpoints.down('sm')]: {
      visibility: 'hidden',
    },
  },
  footerList: {
    display: 'flex',
    flexDirection: 'row',
  },
  footerListItem: {
    whiteSpace: 'nowrap',
  },
  banner: {
    [xtheme.breakpoints.up('xl')]: {
      marginLeft: 240,
    },
  },
});

class Footer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Wrapper className={this.props.classes.footer}>
        <section>
          <List>
            <ListItem>
              {whiteLabel ? null :
              <ReactGA.OutboundLink
                eventLabel="http://suncat.slac.stanford.edu/"
                to="http://suncat.slac.stanford.edu/"
                target="_blank"
              >
                <Img className={this.props.classes.banner} src={WhiteBanner} alt="SUNCAT - Logo" />
              </ReactGA.OutboundLink>
              }
            </ListItem>
          </List>
        </section>
        <section>
          <List>
            <ListItem>
            </ListItem>
          </List>
        </section>
        <section>
          <List className={this.props.classes.footerList}>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <ReactGA.OutboundLink
                to="/yourNextApp"
                eventLabel="/yourNextApp"
                className={this.props.classes.footerLink}
              >
                  Build Your Own App
              </ReactGA.OutboundLink>
            </ListItem>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <ReactGA.OutboundLink
                to="/feedback"
                eventLabel="/feedback"
                className={this.props.classes.footerLink}
              >Send Us Your Feedback
              </ReactGA.OutboundLink>

            </ListItem>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <Tooltip title="Checkout frontend code on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatalysisHubFrontend"
                  eventLabel="https://github.com/SUNCAT-Center/CatalysisHubFrontend"
                  target="_blank"
                  className={this.props.classes.footerLink}
                >
                Made&nbsp;
              </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout command line tools on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatKit"
                  eventLabel="https://github.com/SUNCAT-Center/CatKit"
                  target="_blank"
                  className={this.props.classes.footerLink}
                >
                in&nbsp;
              </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout backend code on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  eventLabel="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  target="_blank"
                  className={this.props.classes.footerLink}
                >
                Menlo Park&nbsp;
              </ReactGA.OutboundLink>
              </Tooltip>
            </ListItem>
          </List>
        </section>
      </Wrapper>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Footer);
