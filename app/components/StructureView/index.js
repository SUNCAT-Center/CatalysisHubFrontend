/**
*
* StructureView
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function StructureView() {
  return (
    <div>
      <h2>Detailed Structure View</h2>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

StructureView.propTypes = {

};

export default StructureView;
