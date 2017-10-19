import React from 'react';
import { shallow } from 'enzyme';

import Publications from '../index';

describe('<Publications />', () => {
  it('should render a div', () => {
    expect(shallow(<Publications />).find('div').length).toEqual(1);
  });
});
