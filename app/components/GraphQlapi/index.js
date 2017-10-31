/**
*
* GraphQlapi
*
*/

import React from 'react';
// import styled from 'styled-components';

import IFrame from 'react-iframe';

import { graphQLRoot } from 'utils/constants';

class GraphQlapi extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>CatApp Database API</h2>
        <IFrame
          url={graphQLRoot}
          width="100%"
          height="80vh"
          position="relative"
          display="initial"
          allowFullScreen
        />
      </div>
    );
  }
}

GraphQlapi.propTypes = {

};

export default GraphQlapi;
