import React from 'react';


import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { MdLoop } from 'react-icons/lib/md';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import axios from 'axios';
import { backendRoot } from 'utils/constants';


const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});


const initialState = {
  structure: 'fcc',
  latticeConstant: 3.93,
  element1: 'Pt',
  element2: 'Pt',
  element3: 'Pt',
  element4: 'Pt',
};


class BulkInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.generateBulk = this.generateBulk.bind(this);
  }

  generateBulk = () => {
    axios.get(`${backendRoot}generate_bulk_cif/`, { params: {
      lattice_constant: this.state.latticeConstant,
      structure: this.state.structure,
      element1: this.state.element1,
      element2: this.state.element2,
      element3: this.state.element3,
      element4: this.state.element4,
    } }).then((response) => {
      this.props.receiveBulkCif(response.data.cifdata);
    });
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  render() {
    return (
      <div>
        <h2>Configure Bulk Structure</h2>
        <form>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="structure-simple">Structure</InputLabel>
            <Select
              value={this.state.structure}
              onChange={this.handleChange('structure')}
            >
              <MenuItem value={'fcc'}>FCC</MenuItem>
              <MenuItem value={'bcc'}>BCC</MenuItem>
              <MenuItem value={'sc'}>SC</MenuItem>
              <MenuItem value={'hcp'}>HCP</MenuItem>
              <MenuItem value={'diamond'}>Diamond</MenuItem>
              <MenuItem value={'zincblende'}>Zinc Blende</MenuItem>
              <MenuItem value={'rocksalt'}>Rock Salt</MenuItem>
              <MenuItem value={'cesiumchloride'}>Cesium Chloride</MenuItem>
              <MenuItem value={'fluorite'}>Fluorite</MenuItem>
              <MenuItem value={'wurtzite'}>Wurtzite</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="lattice-constant-helper">Lattice Constant</InputLabel>
            <Input id="lattice-constant-helper" value={this.state.latticeConstant} onChange={this.handleChange('latticeConstant')} />
            <FormHelperText>Should be a number in Angstrom</FormHelperText>
          </FormControl>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element1-helper">Element 1</InputLabel>
            <Input id="element1-helper" value={this.state.element1} onChange={this.handleChange('element1')} />
            <FormHelperText>The periodic table is your oyster</FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element2-helper">Element 2</InputLabel>
            <Input id="element2-helper" value={this.state.element2} onChange={this.handleChange('element2')} />
            <FormHelperText>The periodic table is your oyster</FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element3-helper">Element 3</InputLabel>
            <Input id="element3-helper" value={this.state.element3} onChange={this.handleChange('element3')} />
            <FormHelperText>The periodic table is your oyster</FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element4-helper">Element 4</InputLabel>
            <Input id="element4-helper" value={this.state.element4} onChange={this.handleChange('element4')} />
            <FormHelperText>The periodic table is your oyster</FormHelperText>
          </FormControl>
          <Button raised onClick={this.generateBulk} color="primary"><MdLoop /> Generate </Button>
        </form>
      </div>
    );
  }
}

BulkInput.propTypes = {
  classes: PropTypes.object.isRequired,
  receiveBulkCif: PropTypes.func.isRequired,
};


export default withStyles(styles, { withTheme: true })(BulkInput);
