import React from 'react';
import { shallow } from 'enzyme';

import ElementBox from '../index';

describe('<ElementBox />', () => {
  it('it should render a styled ElementBox', () => {
    const renderedComponent = shallow(
      <ElementBox label="test" clickElement={() => {}} />
    );
    expect(renderedComponent.text()).toContain('ElementBox');
  });
});
