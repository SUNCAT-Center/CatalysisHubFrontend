import React from 'react';
import { shallow } from 'enzyme';
import { GeneralSearchContainer } from '../index';

describe('<GeneralSearchContainer />', () => {
  it('to render a a div', () => {
    expect(shallow(<GeneralSearchContainer
      selectedSystem={{
        publication: [
          { year: 2000,
            doi: 'DOI',
            authors: '["Name"]',
          }],
      }}
      selectUUID={() => {}} selectedUUID=""
    />).find('div').length).toBe(1);
  });
});
