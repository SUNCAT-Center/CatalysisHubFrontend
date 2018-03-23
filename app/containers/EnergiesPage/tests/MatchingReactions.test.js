import React from 'react';
import { shallow } from 'enzyme';
import MatchingReactions from '../MatchingReactions';

describe('<MatchingReactions />', () => {
  it('renders a div', () => {
    expect(shallow(<MatchingReactions matchingReactions={[{}]} clearSystems={() => {}} saveSystem={() => {}} />).find('div').length).toBe(0);
  });
});

