import React from 'react';
import { shallow } from 'enzyme';

import ResultTable from '../index';

describe('<ResultTable />', () => {
  it('have no h2 header', () => {
    expect(shallow(<ResultTable selectedUUID={() => {}} saveSystem={() => {}} searchResults={[]} />).find('h2').length).toBe(0);
  });
});
