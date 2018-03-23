import React from 'react';
import { shallow } from 'enzyme';

import TermAutosuggest, { renderInput, getSuggestionValue, renderSuggestionsContainer, renderSuggestion } from '../TermAutosuggest';

describe('getSuggestionValue', () => {
  it('return the label attribute', () => {
    expect(getSuggestionValue({ label: 'foobar' })).toBe('foobar');
  });
});

describe('renderSuggestionsContainer', () => {
  it('renders a paper', () => {
    expect(shallow(renderSuggestionsContainer({}, {})).find('Paper').length).toBe(1);
  });
});

describe('renderInput', () => {
  it('renders a with a variable className', () => {
    expect(shallow(renderInput({ classes: { textField: 'className' } }, {}, {}, {})).find('.className').length).toBe(1);
  });
});

describe('renderSuggestion', () => {
  it('renders a MenuItem', () => {
    expect(shallow(renderSuggestion({}, {})).find('MenuItem').length).toBe(1);
  });
});

describe('TermAutosuggest', () => {
  it('does not autofocus', () => {
    expect((shallow(<TermAutosuggest />).type().defaultProps.autofocus)).toBe(false);
  });
});
