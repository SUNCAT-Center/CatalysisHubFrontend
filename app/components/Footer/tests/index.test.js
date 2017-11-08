import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import List, { ListItem, ListItemText } from 'material-ui/List';

import messages from '../messages';
import Footer from '../index';

describe('<Footer />', () => {
  it('should render the copyright notice', () => {
    const renderedComponent = shallow(
      <Footer />
    );
    expect(renderedComponent.contains(
      <section>
        <List>
          <ListItem>
            <ListItemText primary={<FormattedMessage {...messages.licenseMessage} />} />
          </ListItem>
        </List>
      </section>
    )).toBe(true);
  });
});
