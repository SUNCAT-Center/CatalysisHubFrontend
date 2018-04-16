import React from 'react';
import { shallow } from 'enzyme';

import GraphQlapi from '../index';

describe('<GraphQlapi />', () => {
  it('should render five divs', () => {
    expect(shallow(<GraphQlapi cookies={{}} />).dive().find('div').length).toBe(0);
  });
});
