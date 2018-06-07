import React from 'react';
import { createShallow } from 'material-ui/test-utils';

import { CatKitDemo } from '../index';
import { SlabView } from '../SlabView';
import { AdsorbateView } from '../AdsorbateView';

describe('<CatKitDemo />', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow();
  });
  afterAll(() => {
    shallow.cleanUp();
  });

  it('Expect to have be a div', () => {
    expect(shallow(<CatKitDemo classes={{}} />).type()).toBe('div');
  });
});

describe('<SlabView />', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow();
  });
  afterAll(() => {
    shallow.cleanUp();
  });
  it('Should be a paper', () => {
    expect(shallow(<SlabView bulkCif={''} classes={{}} cookies={{}} />).type()).toBe('div');
  });
});


describe('<AdsorbateView />', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow();
  });
  afterAll(() => {
    shallow.cleanUp();
  });
  it('Should be a paper', () => {
    expect(shallow(<AdsorbateView bulkCif={''} classes={{}} cookies={{}} />).type()).toBe('div');
  });
});

