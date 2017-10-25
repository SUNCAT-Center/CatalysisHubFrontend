import React from 'react';
import { FormattedMessage } from 'react-intl';

import List, { ListItem, ListItemText } from 'material-ui/List';

import A from 'components/A';
/* import LocaleToggle from 'containers/LocaleToggle'; */
import Wrapper from './Wrapper';
import messages from './messages';

function Footer() {
  return (
    <Wrapper>
      <section>
        <List>
          <ListItem>
            <A href="http://suncat.slac.stanford.edu/"><ListItemText primary="SUNCAT" /></A>
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

export default Footer;
