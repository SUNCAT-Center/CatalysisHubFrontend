
import plotlyDemoReducer from '../reducer';

describe('plotlyDemoReducer', () => {
  it('returns the initial state', () => {
    expect(plotlyDemoReducer(undefined, {})).toEqual({ selectedDot: {} });
  });
});
