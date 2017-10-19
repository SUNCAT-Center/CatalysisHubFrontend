import React from 'react';
import { shallow } from 'enzyme';

import { ScalingRelationsPage } from '../index';

describe('<ScalingRelationsPage />', () => {
  it('should render a div', () => {
    expect(shallow(<ScalingRelationsPage />).find('div').length).toEqual(1);
  });
});
