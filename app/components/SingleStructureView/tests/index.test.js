import React from 'react';
import { shallow } from 'enzyme';

import SingleStructureView from '../index';

describe('<SingleStructureView />', () => {
  it('Expect to render a nested div', () => {
    expect(shallow(<SingleStructureView
      selectedSystem={{
        publication: [
          { year: 2000,
            doi: 'DOI',
            authors: '["Name"]',
          }],
      }} selectedUUID="123"
    />).find('div').length).toBe(3);
  });
  it('should have a h2 header', () => {
    expect(shallow(<SingleStructureView
      selectedSystem={{
        publication: [
          { year: 2000,
            doi: 'DOI',
            authors: '["Name"]',
          }],
      }} selectedUUID="123"
    />).find('h2').length).toBe(1);
  });
});
