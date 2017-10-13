/**
*
* Publications
*
*/

import React from 'react';
// import styled from 'styled-components';


class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Publications</h2>
        <ul>
          <li>Paper #1</li>
          <li>Paper #2</li>
          <li>Paper #3</li>
          <li>Paper #4</li>
          <li>Paper #5</li>
          <li>Paper ...</li>
        </ul>
      </div>
    );
  }
}

Publications.propTypes = {

};

export default Publications;
