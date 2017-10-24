import React from 'react';
import { shallow } from 'enzyme';

import GeneralSearch from '../index';

describe('<GeneralSearch />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(
      <GeneralSearch />
    );
    expect(renderedComponent.find('div').length).toEqual(1);
  });
});
