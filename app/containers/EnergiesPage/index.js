/*
 *
 * EnergiesPage
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { FaArrowsH } from 'react-icons/lib/fa';
import RaisedButton from 'material-ui/RaisedButton';
import { MdClear, MdSearch } from 'react-icons/lib/md';

import makeSelectEnergiesPage from './selectors';
const Button = styled(RaisedButton)`
  margin: 12px;
`;

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Reaction Energies</h2>

        <SelectField
          floatingLabelText="Reactant"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
          <MenuItem value="CO*" primaryText="CO*" />
          <MenuItem value="O*" primaryText="O*" />
          <MenuItem value="H*" primaryText="H*" />
          <MenuItem value="N*" primaryText="N*" />
        </SelectField>
        {' '}
        <FaArrowsH
          size={30}
          style={{
            margin: 15,
            marginTop: -25,
          }}
        />
        {' '}
        <SelectField
          floatingLabelText="Product A"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
          <MenuItem value="CO*" primaryText="CO*" />
          <MenuItem value="O*" primaryText="O*" />
          <MenuItem value="H*" primaryText="H*" />
          <MenuItem value="N*" primaryText="N*" />
        </SelectField>
        {' '}
        <SelectField
          floatingLabelText="Product B"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
          <MenuItem value="CO*" primaryText="CO*" />
          <MenuItem value="O*" primaryText="O*" />
          <MenuItem value="H*" primaryText="H*" />
          <MenuItem value="N*" primaryText="N*" />
        </SelectField>
        <br />
        <SelectField
          floatingLabelText="Surface"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
        </SelectField>
        <Button label="Reset" icon={<MdClear />} />
        <Button label="Search" icon={<MdSearch />} />
      </div>
    );
  }
}

EnergiesPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  EnergiesPage: makeSelectEnergiesPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnergiesPage);
