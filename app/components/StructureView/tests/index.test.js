import React from 'react';
import { shallow } from 'enzyme';

import StructureView2 from '../index';

describe('<StructureView2 />', () => {
  it('should render a div', () => {
    expect(shallow(<StructureView2 />).type()).toEqual('div');
  });
});
