import React from 'react';
import { shallow } from 'enzyme';
import ActivityMaps from '../index';

describe('<ActivityMaps />', () => {
  it('should render a div', () => {
    const rc = shallow(<ActivityMaps />);
    expect(rc.find('div').length).toEqual(2);
  });
});
