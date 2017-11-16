import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

import A from 'components/A';
/* import LocaleToggle from 'containers/LocaleToggle'; */
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
              <A href="http://suncat.slac.stanford.edu/"><ListItemText primary="SUNCAT" /></A>
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
              <A href="https://github.com/mhoffman/CatAppBrowser">
                <ListItemText
                  primary={<FormattedMessage
                    {...messages.authorMessage}
                    values={{
                      author: <A href="https://twitter.com/maxjhoffmann">Max Hoffmann</A>,
                      author_town: 'Menlo Park',
                    }}
                  />
                  }
                />
              </A>
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
