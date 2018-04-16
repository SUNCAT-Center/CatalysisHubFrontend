import React from 'react';
import { shallow } from 'enzyme';

import GeometryCanvasFromUuid from '../index';

describe('<GeometryCanvasFromUuid />', () => {
  it('should render two divs', () => {
    expect(
      shallow(
        <GeometryCanvasFromUuid selectedUUID="" />
      ).find('div').length).toBe(2);
  });
});
