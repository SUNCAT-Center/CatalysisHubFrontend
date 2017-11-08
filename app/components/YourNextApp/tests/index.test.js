import React from 'react';
import { shallow } from 'enzyme';

import YourNextApp from '../index';

describe('<YourNextApp />', () => {
  it('Expect to have unit tests specified', () => {
    expect(shallow(<YourNextApp />).find('div').length).toBe(2);
  });
});
