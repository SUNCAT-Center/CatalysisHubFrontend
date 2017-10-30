/*
 *
 * EnergiesPage
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';


import { MdClear, MdSearch } from 'react-icons/lib/md';
import { FaArrowsH } from 'react-icons/lib/fa';

import makeSelectEnergiesPage from './selectors';
const MButton = styled(Button)`
  margin: 12px;
`;


const initialState = {
  facet: '',
  surface: '',
  reactant: '',
  productA: '',
  productB: '',

};

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    // Workaround, instead of calling .bind in every render
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }
  resetForm() {
    this.setState(initialState);
  }
  submitForm() {
    /* console.log(this.state); */
  }

  render() {
    return (
      <div>
        <h2>Reaction Energies</h2>

        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Reactant</InputLabel>
          <Select
            onChange={this.handleChange('reactant')}
            value={this.state.reactant}
          >
            <MenuItem value="CO*">CO*</MenuItem>
            <MenuItem value="O*">O*</MenuItem>
            <MenuItem value="H*">H*</MenuItem>
            <MenuItem value="N*">N*</MenuItem>
          </Select>
        </FormControl>
        {' '}
        <FaArrowsH
          size={30}
          style={{
            margin: 15,
            marginTop: -25,
          }}
        />
        {' '}
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Product A</InputLabel>
          <Select
            onChange={this.handleChange('productA')}
            value={this.state.productA}
          >
            <MenuItem value="CO*">CO*</MenuItem>
            <MenuItem value="O*">O*</MenuItem>
            <MenuItem value="H*">H*</MenuItem>
            <MenuItem value="N*">N*</MenuItem>
          </Select>
        </FormControl>
        {' '}
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Product B</InputLabel>
          <Select
            onChange={this.handleChange('productB')}
            value={this.state.productB}
          >
            <MenuItem value="CO*">CO*</MenuItem>
            <MenuItem value="O*">O*</MenuItem>
            <MenuItem value="H*">H*</MenuItem>
            <MenuItem value="N*">N*</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Surface</InputLabel>
          <Select
            onChange={this.handleChange('surface')}
            value={this.state.surface}
          >
            <MenuItem value="Pd">Pd</MenuItem>
            <MenuItem value="Pt">Pt</MenuItem>
            <MenuItem value="Ag">Ag</MenuItem>
            <MenuItem value="Cu">Cu</MenuItem>
            <MenuItem value="Rh">Rh</MenuItem>
            <MenuItem value="Ir">Ir</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Facet</InputLabel>
          <Select
            onChange={this.handleChange('facet')}
            value={this.state.facet}
          >
            <MenuItem value="100">(100)</MenuItem>
            <MenuItem value="111">(111)</MenuItem>
            <MenuItem value="211">(211)</MenuItem>
            <MenuItem value="311">(311)</MenuItem>
            <MenuItem value="110">(110)</MenuItem>
          </Select>
        </FormControl>
        <MButton raised onClick={this.resetForm}><MdClear /> Reset </MButton>
        <MButton raised onClick={this.submitForm}><MdSearch /> Search </MButton>
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
