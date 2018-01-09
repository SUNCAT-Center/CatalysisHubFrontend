import React from 'react';
import { shallow } from 'enzyme';

import { ScalingRelationsPage } from '../index';

describe('<ScalingRelationsPage />', () => {
  it('should render render an h2 header', () => {
    expect(shallow(<ScalingRelationsPage dispatch={() => {}} />).find('h2').length).toEqual(1);
  });
  it('should render a div', () => {
    expect(shallow(<ScalingRelationsPage dispatch={() => {}} />).find('div').length).toEqual(2);
  });
});
