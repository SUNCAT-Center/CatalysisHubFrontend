import React from 'react';
import { shallow } from 'enzyme';

import Publications from '../index';

describe('<Publications />', () => {
  it('should render a div', () => {
    expect(shallow(<Publications />).find('div').length).toEqual(0);
  });
  it('filters references by year', () => {
    const rc = shallow(<Publications />).instance();
    rc.setState({
      years: ['2016', '2017'],
      references: {
        2016: { r1: 'r1', r3: 'r3' },
        2017: { r2: 'r2', r4: 'r4' },
        dois: {
          2016: ['foobar1', 'foobar2'],
          2017: ['foobar1', 'foobar2'],
        },
      },
    });
    rc.render();
  });
});
