import React from 'react';
import { shallow } from 'enzyme';

import GeneralSearch from '../index';

describe('<GeneralSearch />', () => {
  it('to render a div', () => {
    expect(shallow(<GeneralSearch />).find('div').length).toBe(1);
  });
});
