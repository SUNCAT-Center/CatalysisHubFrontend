import React from 'react';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  it('should render a div', () => {
    expect(shallow(
      <Header />
    ).dive().find('div').length).toEqual(1);
  });
});
