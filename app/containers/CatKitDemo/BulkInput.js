import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';


import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import FaCube from 'react-icons/lib/fa/cube';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { LinearProgress } from 'material-ui/Progress';
import { FormControl, FormHelperText } from 'material-ui/Form';

import { MdClear } from 'react-icons/lib/md';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';
import { styles } from './styles';

const backendRoot = `${flaskRoot}/apps/catKitDemo`;
const url = `${backendRoot}/convert_atoms/`;
const bulkUrl = `${backendRoot}/generate_bulk_cif`;


let initialState = {
  structure: 'fcc',
  latticeConstant: 3.93,
  coverage: 1,
  u: 1,
  elements: ['Pt', 'Pt', 'Pt', 'Pt'],
  uploadError: '',
  loading: false,
};


const structureData = {
  fcc: {
    nspecies: 2,
    label: 'FCC',
  },
  bcc: {
    nspecies: 2,
    label: 'BCC',
  },
  sc: {
    nspecies: 2,
    label: 'SC',
  },
  hcp: {
    nspecies: 4,
    label: 'HCP',
    extraParams: {
      covera: {
        label: 'c/a',
      },
    },
  },
  diamond: {
    nspecies: 2,
    label: 'Diamond',
  },
  zincblende: {
    nspecies: 2,
    label: 'Zinc Blende',
  },
  rocksalt: {
    nspecies: 2,
    label: 'Rock Salt',
  },
  cesiumchloride: {
    nspecies: 2,
    label: 'Cesium Chloride',
  },
  fluorite: {
    nspecies: 2,
    label: 'Fluorite',
  },
  wurtzite: {
    nspecies: 4,
    label: 'Wurtzite',
    extraParams: {
      u: {
        label: 'u',
      },
    },
  },
};


class BulkInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    const rawQuery = Object.values(props.location.query).join('');
    if (rawQuery) {
      const query = JSON.parse(Object.values(props.location.query).join(''));
      this.props.receiveBulkCif(query.bulkStructure);
      this.props.dropBulkInput();
    }

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

    const structure = this.props.routeParams.lattice || 'fcc';
    let elements;
    if (this.props.routeParams.composition) {
      elements = this.props.routeParams.composition.match(/[A-Z][a-z]?/g);
    } else {
      elements = ['Pt'];
    }
    while (elements.length < structureData[structure].nspecies) {
      elements.unshift(elements[0]);
    }

    initialState = _.extend(initialState, {
      structure,
      elements,
      latticeConstant,
    });

    this.state = initialState;
    this.generateBulk = this.generateBulk.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.generateBulk();
      this.setState({
        loading: false,
      });
    }, 1000,
    );
  }

  generateBulk = () => {
    const params = { params: {
      bulkParams: {
        lattice_constant: this.state.latticeConstant,
        structure: this.state.structure,
        elements: this.state.elements.slice(0, structureData[this.state.structure].nspecies),
        u: this.state.u,
        covera: this.state.covera,
      },
    } };

    this.props.clearSlabCifs();
    this.props.saveBulkParams(params.params);

    if (!this.props.customBulkInput) {
      axios.get(bulkUrl, params).then((response) => {
        this.props.receiveBulkCif(response.data.cifdata);
      });
    }
  }

  handleChange(name) {
    return (event) => {
      if (name.match(/^element/) === null) {
        this.setState({
          [name]: event.target.value,
        });
      } else {
        const n = name.split(/(?=[0-9])/)[1];
        const elements = this.state.elements;
        elements[n] = event.target.value;
        this.setState({
          elements,
        });
      }
      if (name === 'structure') {
        const elements = this.state.elements;
        while (this.state.elements.length < structureData[event.target.value].nspecies) {
          elements.unshift(elements[0]);
        }
        this.setState({
          elements,
        });
      }
    };
  }

  handleFileDrop(files) {
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('outFormat', 'cif');
    this.props.dropBulkInput(files[0]);
    axios.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((response) => {
      if (!_.isEmpty(response.data.image)) {
        this.props.receiveBulkCif(response.data.image);
      }
      if (!_.isEmpty(response.data.error)) {
        this.setState({
          uploadError: response.data.error,
        });
      } else {
        this.setState({
          uploadError: '',
        });
      }
    }
    );
  }


  render() {
    return (
      <div>
        <div>Note: use <Link to="/bulkGenerator">Wyckoff Bulk Constructor</Link> for importing arbitrary bulk structures.</div>
        <Grid container justify="space-between" direction="row" >
          <Grid item>
            <h2>Setup Bulk Structure</h2>
          </Grid>
          <Grid item>
            <Button
              disabled={_.isEmpty(this.props.bulkCif)}
              onClick={() => { this.props.clearBulkCif(); this.props.forgetCustomBulk(); }}
              className={this.props.classes.button}
            ><MdClear /> {'\u00A0\u00A0'}Clear </Button>
            <Button raised onClick={this.generateBulk} color="primary" className={this.props.classes.button}><FaCube />{'\u00A0\u00A0'} Generate </Button>
          </Grid>
        </Grid>
        {this.props.customBulkInput ? null :
        <form>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="structure-simple">Structure</InputLabel>
            <Select
              value={this.state.structure}
              onKeyDown={((event) => {
                if (event.nativeEvent.keyCode === 13) {
                  this.generateBulk();
                }
              })}
              onChange={(event) => {
                this.handleChange('structure')(event);
                this.generateBulk();
              }}
            >
              {Object.keys(structureData).map((structure) => (
                <MenuItem key={`item_${structure}`} value={structure}>{_.get(structureData, [structure]).label}</MenuItem>
                  ))}
            </Select>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel
              htmlFor="lattice-constant-helper"
            >Lattice Constant</InputLabel>
            <Input
              id="lattice-constant-helper"
              value={this.state.latticeConstant}
              onChange={this.handleChange('latticeConstant')}
              onKeyDown={((event) => {
                if (event.nativeEvent.keyCode === 13) {
                  this.generateBulk();
                }
              })}
            />
            <FormHelperText>Should be a number in Angstrom</FormHelperText>
          </FormControl>
          {
                Object.keys(_.get(structureData, [this.state.structure, 'extraParams'], {})).map((extraParam) => (
                  <FormControl className={this.props.classes.formControl} key={`extraParam_${extraParam}`}>
                    <InputLabel htmlFor={extraParam}>{structureData[this.state.structure].extraParams[extraParam].label}</InputLabel>
                    <Input
                      autoFocus
                      id={extraParam}
                      value={_.get(this.state, [extraParam])}
                      onChange={this.handleChange(extraParam)}
                      onKeyDown={((event) => {
                        if (event.nativeEvent.keyCode === 13) {
                          this.generateBulk();
                        }
                      })}
                    />
                    <FormHelperText></FormHelperText>
                  </FormControl>
                ))
              }
          {_.range(_.get(structureData, [this.state.structure, 'nspecies'])).map((n) => (
            <FormControl className={this.props.classes.formControl} key={`fc_${n}`} >
              <InputLabel htmlFor={`element${n}-helper`}>{`Element ${n}`}</InputLabel>
              <Input
                autoFocus
                id={`element${n}-helper`}
                value={_.get(this.state, ['elements', n])}
                onChange={this.handleChange(`element${n}`)}
                onKeyDown={((event) => {
                  if (event.nativeEvent.keyCode === 13) {
                    this.generateBulk();
                  }
                })}
              />
              <FormHelperText></FormHelperText>
            </FormControl>
              ))
              }


        </form>
        }
        {this.state.loading === true ? <LinearProgress className={this.props.classes.progress} /> : null }
      </div>
    );
  }
}

BulkInput.propTypes = {
  bulkCif: PropTypes.string,
  classes: PropTypes.object.isRequired,
  clearBulkCif: PropTypes.func,
  clearSlabCifs: PropTypes.func,
  customBulkInput: PropTypes.bool,
  dropBulkInput: PropTypes.func,
  forgetCustomBulk: PropTypes.func,
  latticeConstant: PropTypes.number,
  receiveBulkCif: PropTypes.func.isRequired,
  routeParams: PropTypes.object,
  saveBulkParams: PropTypes.func,
  location: PropTypes.object,
};


export default withStyles(styles, { withTheme: true })(BulkInput);
