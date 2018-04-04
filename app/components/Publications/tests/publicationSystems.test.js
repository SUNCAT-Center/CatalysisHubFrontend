import React from 'react';
import { shallow } from 'enzyme';

import PublicationSystems from '../publicationSystems';

describe('<PublicationSystems', () => {
  it('renders a div', () => {
    expect(shallow(<PublicationSystems systems={[]} />).dive().find('div').length).toBe(2);
  });
});

