import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { shallow } from 'enzyme';

import GeometryCanvas from '../index';

describe('<GeometryCanvas />', () => {
  it('should render a div', () => {
    const rc = shallow(
      <CookiesProvider>
        <GeometryCanvas id="test" />
      </CookiesProvider>
    );
    expect(rc.length).toEqual(1);
  });
});
