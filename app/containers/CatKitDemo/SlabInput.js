import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { compose } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';


import { MdClear, MdContentCut } from 'react-icons/lib/md';
import _ from 'lodash';

import axios from 'axios';
import cachios from 'cachios';
import { apiRoot } from 'utils/constants';

import { styles } from './styles';

const backendRoot = `${apiRoot}/apps/catKitDemo`;

const nmod = (x, n) => (((x % n) + n) % n);


const initialState = {
  millerX: 1,
  millerY: 1,
  millerZ: 1,
  layers: 4,
  vacuum: 12.0,
  termination: 0,
  unitCellSize: 2,
  fixed: 2,
  uploadError: '',
  n_terminations: 1,
};

class SlabInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = _.merge(initialState,
       _.get(props, ['slabParams']));

    this.generateSlabs = this.generateSlabs.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    setTimeout(() => {
      this.generateSlabs();
    }, 1000);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  handleFileDrop(files) {
    const url = `${backendRoot}/convert_atoms/`;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('outFormat', 'cif');
    this.props.dropSlabInput(files[0]);
    axios.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((response) => {
      if (!_.isEmpty(response.data.image)) {
        this.props.receiveSlabCifs([response.data.image]);
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

  generateSlabs = () => {
    const url = `${backendRoot}/generate_slab_cif`;
    const slabParams = {
      millerX: this.state.millerX,
      millerY: this.state.millerY,
      millerZ: this.state.millerZ,
      layers: this.state.layers,
      vacuum: this.state.vacuum,
      unitCellSize: this.state.unitCellSize,
      fixed: this.state.fixed,
      termination: this.state.termination,
      format: this.props.cookies.get('preferredFormat'),
    };

    const params = { params: {
      bulkParams: _.omit(
        this.props.bulkParams,
        ['input', 'cif'],
      ),
      slabParams,
    },
      ttl: 3000,
    };
    if (this.props.customBulkInput) {
      params.params.bulk_cif = this.props.bulkCif;
      // Send in dummy data since backend seems to require it
      params.params.bulkParams = {
        elements: ['Pt'],
      };
    }

    cachios.get(url, params).then((response) => {
      this.props.receiveSlabCifs(_.cloneDeep(response.data.images));
      slabParams.cif = _.cloneDeep(response.data.images[0]);
      slabParams.input = response.data.input[0];
      this.props.saveSlabParams(slabParams);
      this.setState({
        n_terminations: parseInt(response.data.n_terminations, 10),
      });
    });
  }

  handleChange(name) {
    return (event) => {
      this.setStateAsync({
        [name]: event.target.value,
      }).then(() => {
        this.generateSlabs();
      });
    };
  }

  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>

          <Grid container direction="row" justify="space-between">
            <Grid item >
              <h2>Configure Slab Geometry</h2>
            </Grid>
            <Grid item className={this.props.classes.button}>
              <Button
                disabled={_.isEmpty(this.props.images)}
                onClick={() => { this.props.forgetCustomSlab(); this.generateSlabs(); }}
                className={this.props.classes.button}
              ><MdClear /> Clear </Button>
              {this.props.customSlabInput ? null :
              <Button raised onClick={this.generateSlabs} color="primary" className={this.props.classes.button}><MdContentCut />{'\u00A0\u00A0'} Cleave Slabs </Button>
                  }
            </Grid>
          </Grid>
          <Grid container direction="row" justify="flex-start">
            <Grid item>
              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-x-helper">Miller X</InputLabel>
                <Input
                  className={this.props.classes.numberTextfield}
                  autoFocus
                  id="miller-x-helper"
                  value={this.state.millerX}
                  onChange={this.handleChange('millerX')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-y-helper">Miller Y</InputLabel>
                <Input
                  className={this.props.classes.numberTextfield}
                  id="miller-y-helper"
                  value={this.state.millerY}
                  onChange={this.handleChange('millerY')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-z-helper">Miller Z</InputLabel>
                <Input
                  className={this.props.classes.numberTextfield}
                  id="miller-z-helper"
                  value={this.state.millerZ}
                  onChange={this.handleChange('millerZ')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="layers-helper">Layers</InputLabel>
                <Input
                  className={this.props.classes.buttonedTextfield}
                  id="layers-helper"
                  value={this.state.layers}
                  onChange={this.handleChange('layers')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                  endAdornment={
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <IconButton className={this.props.classes.iconButton} color="primary" onClick={() => { this.handleChange('layers')({ target: { value: parseInt(this.state.layers, 10) - 1 } }, true); }} >-</IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton className={this.props.classes.iconButton} color="primary" onClick={() => { this.handleChange('layers')({ target: { value: parseInt(this.state.layers, 10) + 1 } }, true); }} >+</IconButton>
                      </Grid>

                    </Grid>
                  }
                />
                <FormHelperText>Integer</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="fixed-helper">Fixed Layers</InputLabel>
                <Input
                  className={this.props.classes.buttonedTextfield}
                  id="fixed-helper"
                  value={this.state.fixed}
                  onChange={this.handleChange('fixed')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                  endAdornment={
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <IconButton
                          className={this.props.classes.iconButton}
                          color="primary"
                          disabled={this.state.fixed <= 0}
                          onClick={() => { this.handleChange('fixed')({ target: { value: parseInt(this.state.fixed, 10) - 1 } }, true); }}
                        >-</IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          className={this.props.classes.iconButton}
                          color="primary"
                          disabled={this.state.fixed >= this.state.layers}
                          onClick={() => { this.handleChange('fixed')({ target: { value: parseInt(this.state.fixed, 10) + 1 } }, true); }}
                        >+</IconButton>
                      </Grid>

                    </Grid>
                  }
                />
                <FormHelperText>Integer</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>


              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="vacuum-helper">Vacuum</InputLabel>
                <Input
                  className={this.props.classes.buttonedTextfield}
                  id="vacuum-helper"
                  value={this.state.vacuum}
                  onChange={this.handleChange('vacuum')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                  endAdornment={
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <IconButton
                          className={this.props.classes.iconButton}
                          color="primary"
                          disabled={this.state.vacuum <= 0}
                          onClick={() => { this.handleChange('vacuum')({ target: { value: parseInt(this.state.vacuum, 10) - 1 } }, true); }}
                        >-</IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton className={this.props.classes.iconButton} color="primary" onClick={() => { this.handleChange('vacuum')({ target: { value: parseInt(this.state.vacuum, 10) + 1 } }, true); }} >+</IconButton>
                      </Grid>
                    </Grid>
                  }
                />
                <FormHelperText>Angstrom</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>


              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="unitCellSize-helper">Unit Cell Size</InputLabel>
                <Input
                  className={this.props.classes.buttonedTextfield}
                  id="unitCellSize-helper"
                  value={this.state.unitCellSize}
                  onChange={this.handleChange('unitCellSize')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                  endAdornment={
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <IconButton
                          className={this.props.classes.iconButton}
                          color="primary"
                          disabled={this.state.unitCellSize < 2}
                          onClick={() => { this.handleChange('unitCellSize')({ target: { value: parseInt(this.state.unitCellSize, 10) - 1 } }, true); }}
                        >-</IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          className={this.props.classes.iconButton}
                          disabled={this.state.unitCellSize >= 10}
                          color="primary"
                          onClick={() => { this.handleChange('unitCellSize')({ target: { value: parseInt(this.state.unitCellSize, 10) + 1 } }, true); }}
                        >+</IconButton>
                      </Grid>
                    </Grid>
                  }
                />
                <FormHelperText>Angstrom</FormHelperText>
              </FormControl>

            </Grid>
            <Grid item>

              {this.state.n_terminations > 1 ?
                <FormControl className={this.props.classes.formControl} >
                  <InputLabel htmlFor="termination-helper">Termination</InputLabel>
                  <Input
                    className={this.props.classes.buttonedTextfield}
                    id="termination-helper"
                    error={!(this.state.termination >= 0 || this.state.termination < this.state.n_terminations)}
                    value={this.state.termination}
                    onChange={this.handleChange('termination')}
                    onKeyDown={((event) => {
                      if (event.nativeEvent.keyCode === 13) {
                        this.generateSlabs();
                      }
                    })}
                    endAdornment={
                      <Grid container direction="row" justify="flex-end">
                        <Grid item>
                          <IconButton className={this.props.classes.iconButton} color="primary" onClick={() => { this.handleChange('termination')({ target: { value: nmod(parseInt(this.state.termination, 10) - 1, this.state.n_terminations) } }, true); }} >-</IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton className={this.props.classes.iconButton} color="primary" onClick={() => { this.handleChange('termination')({ target: { value: nmod(parseInt(this.state.termination, 10) + 1, this.state.n_terminations) } }, true); }} >+</IconButton>
                        </Grid>
                      </Grid>
                    }
                  >
                  </Input>
                  <FormHelperText
                    error={this.state.termination < 0 || this.state.termination >= this.state.n_terminations}
                  >Between 0 and {this.state.n_terminations - 1}</FormHelperText>
                </FormControl>
                    : null
                }
            </Grid>

          </Grid>
        </div>
        }
      </div>
    );
  }
}

SlabInput.propTypes = {
  bulkCif: PropTypes.string.isRequired,
  bulkParams: PropTypes.object,
  classes: PropTypes.object.isRequired,
  cookies: instanceOf(Cookies),
  customSlabInput: PropTypes.bool,
  customBulkInput: PropTypes.bool,
  dropSlabInput: PropTypes.func,
  forgetCustomSlab: PropTypes.func,
  images: PropTypes.array,
  receiveSlabCifs: PropTypes.func.isRequired,
  saveSlabParams: PropTypes.func.isRequired,
};
/* export default withStyles(styles, { withTheme: true })(SlabInput);*/
export default compose(
  withStyles(styles, { withTheme: true }),
  withCookies,
)(SlabInput);
