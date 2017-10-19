import React from 'react';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  it('should render a div', () => {
    const tree = shallow(
      <Header />
    );

    expect(tree).toMatchSnapshot();
  });
});
