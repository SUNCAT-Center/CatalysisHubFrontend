import React from 'react';
import { shallow } from 'enzyme';

import SlabGenerator from '../index';

describe('<SlabGenerator />', () => {
  it('Expect to have render a div', () => {
    const rc = shallow(<SlabGenerator />
    );
    expect(rc.find('div').length).toBe(1);
  });
});
