/**
*
* ElementBox
*
*/

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Box = styled.div`
    border: 3px solid black; 
    max-width: 50px;
    max-height: 50px; 
    padding: 10px;
    line-height: 50px; 
    text-align: center; 
    font-size: 1.23em;
`;

class ElementBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Box
          onClick={() => {
            console.log(`CLICKED BOX ${this.props.label}`);
            console.log(JSON.stringify(this.props));
          }}
        >{ this.props.label }</Box>
      </div>
    );
  }
}

ElementBox.propTypes = {
  label: PropTypes.string.isRequired,

};

export default ElementBox;
