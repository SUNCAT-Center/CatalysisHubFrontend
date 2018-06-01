import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import { whiteLabel } from 'utils/constants';
import Wrapper from './Wrapper';

const styles = (xtheme) => ({
  footer: {
    [xtheme.breakpoints.down('sm')]: {
      visibility: 'hidden',
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
              >
                <ListItemText primary="SUNCAT" />
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
          <List>
            <ListItem>
              <Tooltip title="Checkout frontend code on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatalysisHubFrontend"
                  eventLabel="https://github.com/SUNCAT-Center/CatalysisHubFrontend"
                  target="_blank"
                >
                Made&nbsp;
              </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout command line tools on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatKit/tree/master/catkit/hub"
                  eventLabel="https://github.com/SUNCAT-Center/CatKit/tree/master/catkit/hub"
                  target="_blank"
                >
                in&nbsp;
              </ReactGA.OutboundLink>
              </Tooltip>
              <Tooltip title="Checkout backend code on GitHub">
                <ReactGA.OutboundLink
                  to="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  eventLabel="https://github.com/SUNCAT-Center/CatalysisHubBackend"
                  target="_blank"
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
