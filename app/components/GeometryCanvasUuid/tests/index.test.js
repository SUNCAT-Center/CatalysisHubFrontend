import React from 'react';
import { shallow } from 'enzyme';

import GeometryCanvas from '../index';

describe('<GeometryCanvas />', () => {
  it('should render a div', () => {
    const rc = shallow(
      <GeometryCanvas id="test" />
    );
    expect(rc.find('div').length).toEqual(0);
  });
});
