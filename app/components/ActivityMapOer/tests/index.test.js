import React from 'react';
import { shallow } from 'enzyme';

import ActivityMapOer from '../index';

describe('<ActivityMapOer />', () => {
  it('should render a nested div', () => {
    const rc = shallow(<ActivityMapOer />);
    expect(rc.find('div').length).toEqual(2);
  });
});
