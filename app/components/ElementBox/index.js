/**
*
* ElementBox
*
*/

import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

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
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div>
        <Box
          onClick={() => {console.log("CLICKED BOX " + this.props.label); console.log(JSON.stringify(this.props))}}
        > {this.props.label } </Box>
      </div>
    );
  }
}

ElementBox.propTypes = {

};

export default ElementBox;
