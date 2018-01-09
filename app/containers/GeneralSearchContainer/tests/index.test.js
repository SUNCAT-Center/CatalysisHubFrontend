import React from 'react';
import { shallow } from 'enzyme';
import { GeneralSearchContainer } from '../index';

describe('<GeneralSearchContainer />', () => {
  it('to render a a div', () => {
    expect(shallow(<GeneralSearchContainer selectUUID={() => {}} selectedUUID="" />).find('div').length).toBe(1);
  });
});
