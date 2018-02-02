import React from 'react';
import { shallow } from 'enzyme';

import PublicationSystems from '../publicationSystems';

describe('<PublicationSystems', () => {
  it('renders a div', () => {
    expect(shallow(<PublicationSystems systems={[]} />).find('div').length).toBe(2);
  });
  it('handles a fetch row', () => {
    const rc = shallow(<PublicationSystems systems={[]} />).instance();
    rc.fetchRow({ uniqueId: '23' });
    expect(rc.state.uuid).toBe('23');
  });
  it('hanles a page change', () => {
    const rc = shallow(<PublicationSystems systems={[]} />).instance();
    rc.handlePageChange({}, { page: 23 });
    expect(rc.state.page.page).toBe(23);
  });

  it('handles a change rows per page', () => {
    const rc = shallow(<PublicationSystems systems={[]} />).instance();
    rc.handleChangeRowsPerPage({ target: { value: 27 } });
    expect(rc.state.rowsPerPage).toBe(27);
  });
});

