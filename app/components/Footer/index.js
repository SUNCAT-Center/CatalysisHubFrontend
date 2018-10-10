import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import {
  GoBook,
  GoCode,
  GoComment,
  GoMarkGithub,

} from 'react-icons/lib/go';
import ccLogo from 'components/Footer/cc.svg';
import Img from 'containers/App/Img';
import { docRoot, whiteLabel } from 'utils/constants';
import WhiteBanner from 'components/Header/banner_white.png';
import Wrapper from './Wrapper';

import { styles } from './styles';

class Footer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Wrapper className={this.props.classes.footer}>
        <section>
          <List>
            <ListItem>
              {whiteLabel ? null
                : (
                  <ReactGA.OutboundLink
                    eventLabel="http://suncat.slac.stanford.edu/"
                    to="http://suncat.slac.stanford.edu/"
                    target="_blank"
                  >
                    <Img className={this.props.classes.banner} src={WhiteBanner} alt="SUNCAT - Logo" />
                  </ReactGA.OutboundLink>
                )
              }
            </ListItem>
          </List>
        </section>
        <section>
          <List className={this.props.classes.footerList}>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <ReactGA.OutboundLink
                eventLabel={docRoot}
                to={docRoot}
                className={this.props.classes.footerLink}
                target="_blank"
              >
                <GoBook />
                {' '}
                <span
                  className={this.props.classes.footerListItemText}
                >
                Docs
                </span>
              </ReactGA.OutboundLink>
            </ListItem>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <ReactGA.OutboundLink
                to="/yourNextApp"
                eventLabel="/yourNextApp"
                className={this.props.classes.footerLink}
              >
                <GoCode />
                {' '}
                <span className={this.props.classes.footerListItemText}>
                Build Your Own App
                </span>
              </ReactGA.OutboundLink>
            </ListItem>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <ReactGA.OutboundLink
                to="https://gitter.im/catalysis-hub-org/Lobby#"
                eventLabel="https://gitter.im/catalysis-hub-org/Lobby#"
                className={this.props.classes.footerLink}
                target="_blank"
              >
                <GoComment />
                {' '}
                <span className={this.props.classes.footerListItemText}>
                  Chat with Us
                </span>
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
                  <GoMarkGithub />
                  {' '}
                  <span className={this.props.classes.footerListItemText}>
                  Visit&nbsp;
                  </span>
                </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout command line tools on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatKit"
                  eventLabel="https://github.com/SUNCAT-Center/CatKit"
                  target="_blank"
                  className={this.props.classes.footerLink}
                >
                  {' '}
                  <span className={this.props.classes.footerListItemText}>
                us on&nbsp;
                  </span>
                </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout backend code on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  eventLabel="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  target="_blank"
                  className={this.props.classes.footerLink}
                >
                  {' '}
                  <span className={this.props.classes.footerListItemText}>
                GitHub&nbsp;
                  </span>
                </ReactGA.OutboundLink>
              </Tooltip>
            </ListItem>
            <ListItem
              className={this.props.classes.footerListItem}
            >
              <Tooltip title="Except where otherwise noted, content on Catalysis Hub is licensed under a Creative Commons Attribution 4.0 International License">
                <ReactGA.OutboundLink
                  eventLabel="https://creativecommons.org/licenses/by/4.0/"
                  to="https://creativecommons.org/licenses/by/4.0/"
                  className={this.props.classes.footerLink}
                  target="_blank"
                >
                  <img className={this.props.classes.logo} src={ccLogo} alt="CCLogo" />
                  {' '}
                  {' '}
                  <span className={this.props.classes.footerListItemText}>
                    License
                  </span>
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
