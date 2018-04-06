import React from 'react';
import { shallow } from 'enzyme';

import PeriodicTable from '../index';

describe('<PeriodicTable />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <PeriodicTable
        selection="Nothing selected" clearSelection={() => {}}
        store={{
          getState: () => ({
            get: () => ({}),
          }),
          subscribe: () => ({
          }),
        }}
      />
    );
    expect(renderedComponent.dive().find('div').length).toEqual(1);
  });
});
