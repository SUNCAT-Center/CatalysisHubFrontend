import React from 'react';
import { shallow } from 'enzyme';

import { PeriodicTableSelector } from '../index';

describe('<PeriodicTableSelector />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <PeriodicTableSelector selection="" clearSelection={() => {}} />
    );
    expect(renderedComponent.find('div').length).toEqual(1);
  });
});
