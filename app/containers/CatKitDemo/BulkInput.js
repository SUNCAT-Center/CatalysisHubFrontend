import _ from 'lodash';
import React from 'react';


import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
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
  buttonList: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    justify: 'flex-end',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});


let initialState = {
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
    let latticeConstant;
    if (this.props.routeParams.latticeConstant) {
      if (!isNaN(parseFloat(this.props.routeParams.latticeConstant))) {
        latticeConstant = parseFloat(this.props.routeParams.latticeConstant);
      } else {
        latticeConstant = 3.99;
      }
    } else {
      latticeConstant = 3.99;
    }

    let elements;
    if (this.props.routeParams.composition) {
      elements = this.props.routeParams.composition.match(/[A-Z][a-z]?/g);
    } else {
      elements = ['Pt'];
    }
    while (elements.length < 4) {
      elements.push(elements[elements.length - 1]);
    }

    initialState = _.extend(initialState, {
      structure: this.props.routeParams.lattice || 'fcc',
      element1: elements[0],
      element2: elements[1],
      element3: elements[2],
      element4: elements[3],
      latticeConstant,
    });

    this.state = initialState;
    this.generateBulk = this.generateBulk.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateBulk = () => {
    const url = `${backendRoot}generate_bulk_cif/`;

    const params = { params: {
      lattice_constant: this.state.latticeConstant,
      structure: this.state.structure,
      element1: this.state.element1,
      element2: this.state.element2,
      element3: this.state.element3,
      element4: this.state.element4,
    } };

    this.props.saveBulkParams(params.params);

    axios.get(url, params).then((response) => {
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
            <Input
              id="lattice-constant-helper"
              value={this.state.latticeConstant}
              onChange={this.handleChange('latticeConstant')}
            />
            <FormHelperText>Should be a number in Angstrom</FormHelperText>
          </FormControl>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element1-helper">Element 1</InputLabel>
            <Input id="element1-helper" value={this.state.element1} onChange={this.handleChange('element1')} />
            <FormHelperText></FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element2-helper">Element 2</InputLabel>
            <Input id="element2-helper" value={this.state.element2} onChange={this.handleChange('element2')} />
            <FormHelperText></FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element3-helper">Element 3</InputLabel>
            <Input id="element3-helper" value={this.state.element3} onChange={this.handleChange('element3')} />
            <FormHelperText></FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="element4-helper">Element 4</InputLabel>
            <Input id="element4-helper" value={this.state.element4} onChange={this.handleChange('element4')} />
            <FormHelperText></FormHelperText>
          </FormControl>
          <Grid container justify="flex-end" direction="row" >
            <Grid item>
              <Button raised onClick={this.generateBulk} color="primary"><MdLoop /> Generate </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

BulkInput.propTypes = {
  classes: PropTypes.object.isRequired,
  receiveBulkCif: PropTypes.func.isRequired,
  routeParams: PropTypes.object,
  saveBulkParams: PropTypes.func,
  latticeConstant: PropTypes.number,

};


export default withStyles(styles, { withTheme: true })(BulkInput);
