import React from 'react';
import { shallow } from 'enzyme';

import { EnergiesPage } from '../index';

describe('<EnergiesPage />', () => {
  it('should return a div', () => {
    expect(shallow(
      <EnergiesPage
        dispatch={() => {}}
        receiveReactions={() => {}}
        clearSystems={() => {}}
        selectReaction={() => {}}
        saveSystem={() => {}}
        matchingReactions={[]}
        reactionSystems={[]}
      />).type()).toEqual('div');
  });
});
