import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga';

import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

import { whiteLabel } from 'utils/constants';
import Wrapper from './Wrapper';
import messages from './messages';

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
              <ListItemText primary={<FormattedMessage {...messages.licenseMessage} />} />
            </ListItem>
          </List>
        </section>
        <section>
          <List>
            <ListItem>
              <ReactGA.OutboundLink
                to="https://github.com/mhoffman/CatAppBrowser"
                eventLabel="https://github.com/mhoffman/CatAppBrowser"
              >
                Made&nbsp;
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                to="https://github.com/kirstenwinther/CatAppCLI"
                eventLabel="https://github.com/kirstenwinther/CatAppCLI"
              >
                in&nbsp;
              </ReactGA.OutboundLink>
              <ReactGA.OutboundLink
                to="https://github.com/kirstenwinther/CatAppBackend"
                eventLabel="https://github.com/kirstenwinther/CatAppBackend"
              >
                Menlo Park&nbsp;
              </ReactGA.OutboundLink>
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
