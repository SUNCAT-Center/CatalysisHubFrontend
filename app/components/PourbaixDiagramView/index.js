/**
*
* PourbaixDiagramView
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class PourbaixDiagramView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Pourbaix Diagram</h2>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

PourbaixDiagramView.propTypes = {

};

export default PourbaixDiagramView;
