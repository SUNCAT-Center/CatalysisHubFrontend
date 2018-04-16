import React from 'react';
import { shallow } from 'enzyme';

import BarrierChart from '../index';

describe('<BarrierChart />', () => {
  it('should render a div', () => {
    expect(shallow(<BarrierChart
      selectedReaction={{
        products: '[]',
        reactants: '[]',
        aseIds: '[]',
      }}
    />).find('div').length).toBe(1);
  });
});
