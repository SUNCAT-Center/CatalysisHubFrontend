import React from 'react';
import PropTypes from 'prop-types';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { MdSave, MdCheckCircle } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';


import axios from 'axios';
import { apiRoot } from 'utils/constants';
import { styles } from './styles';
const backendRoot = `${apiRoot}/apps/catKitDemo`;


const initialState = {
  calculator: 'espresso-in',
  functional: 'PBE',
};

class DftInput extends React.Component {  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.downloadDft = this.downloadDft.bind(this);
    this.saveCalculation = this.saveCalculation.bind(this);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  saveCalculation() {
    this.props.saveCalculation({
      bulkParams: this.props.bulkParams,
      slabParams: this.props.slabParams,
      siteOccupations: this.props.siteOccupations,
      adsorbateParams: this.props.adsorbateParams,
      dftParams: {
        calculator: this.state.calculator,
        functional: this.state.functional,
      },
    });
    this.props.clearBulkParams();
    this.props.clearBulkCif();
    this.props.clearSlabParams();
    this.props.clearSlabCifs();
  }
  downloadDft() {
    const url = `${backendRoot}generate_dft/`;
    const params = {
      responseType: 'blob',
      params: {
        element1: this.props.bulkParams.element1,
        element2: this.props.bulkParams.element2,
        element3: this.props.bulkParams.element3,
        element4: this.props.bulkParams.element4,
        lattice_constant: this.props.bulkParams.lattice_constant,
        miller_x: this.props.slabParams.miller_x,
        miller_y: this.props.slabParams.miller_y,
        miller_z: this.props.slabParams.miller_z,
        vacuum: this.props.slabParams.vacuum,
        layers: this.props.slabParams.layers,
      },
    };
    axios.get(url, params).then((response) => {
      const tempUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = tempUrl;
      link.setAttribute('download', `dft_input_${(new Date()).getTime()}.zip`);
      document.body.appendChild(link);
      link.click();
    }).catch(() => {
    });
  }

  render() {
    return (
      <div>
        {typeof this.props.images === 'undefined' || this.props.images.length === 0 ?
          <Grid container justify="center" direction="row">
            <Grid item>
              <Grid container direction="column" justify="space-between">
                <Grid item className={this.props.classes.finish}>
                Nothing left to do here. {'\u00A0\u00A0'} <MdCheckCircle size={92} color="green" />
                </Grid>
                <Grid item>
                  <div>Start new structure:
                    <Button onClick={this.props.stepperHandleReset} className={this.props.classes.button}> Start Over </Button> </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
            :

          <div>
            <h2>Configure Calculator</h2>
            <form>
              <FormControl className={this.props.classes.formControl}>
                <InputLabel htmlFor="calculator">Calculator:</InputLabel>
                <Select
                  onChange={this.handleChange('calculator')}
                  value={this.state.calculator}
                >
                  <MenuItem value={'espresso-in'}>Quantum Espresso</MenuItem>
                  <MenuItem value={'vasp'}>VASP</MenuItem>
                </Select>
              </FormControl>

              <FormControl className={this.props.classes.formControl}>
                <InputLabel htmlFor="functional">XC</InputLabel>
                <Select
                  value={this.state.functional}
                  onChange={this.handleChange('functional')}
                >
                  <MenuItem value="PBE">PBE</MenuItem>
                  <MenuItem value="RPBE">RPBE</MenuItem>
                  <MenuItem value="BEEF-vdW">BEEF-vdW</MenuItem>
                </Select>
              </FormControl>
              <Grid container justify="flex-end" direction="row">
                <Grid item>
                  <Button raised onClick={this.saveCalculation} color="primary"><MdSave /> {'\u00A0\u00A0'}Save</Button>
                </Grid>
              </Grid>


            </form>
          </div>
        }
      </div>
    );
  }
}

DftInput.propTypes = {
  /* bulkCif: PropTypes.string.isRequired,*/
  images: PropTypes.array,
  classes: PropTypes.object,
  bulkParams: PropTypes.object,
  slabParams: PropTypes.object,
  saveCalculation: PropTypes.func,
  clearBulkParams: PropTypes.func,
  clearSlabParams: PropTypes.func,
  clearBulkCif: PropTypes.func,
  clearSlabCifs: PropTypes.func,
  stepperHandleReset: PropTypes.func,
  siteOccupations: PropTypes.array,
  adsorbateParams: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(DftInput);
