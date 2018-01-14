import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import { MdLoop } from 'react-icons/lib/md';

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
  millerX: 1,
  millerY: 1,
  millerZ: 1,
  layers: 4,
  vacuum: 10.0,
};

class SlabInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.generateSlabs = this.generateSlabs.bind(this);
  }

  generateSlabs = () => {
    const url = `${backendRoot}generate_slab_cif/`;
    const params = {
      bulk_cif: this.props.bulkCif,
      miller_x: this.state.millerX,
      miller_y: this.state.millerY,
      miller_z: this.state.millerZ,
      layers: this.state.layers,
      vacuum: this.state.vacuum,
    };
    this.props.saveSlabParams(params);
    axios.get(url, { params }).then((response) => {
      this.props.receiveSlabCifs(response.data.images);
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
        { this.props.bulkCif === '' ? null :
        <div>
          <h2>Configure Slab Geometry</h2>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="miller-x-helper">Miller X</InputLabel>
            <Input id="miller-x-helper" value={this.state.millerX} onChange={this.handleChange('millerX')} />
            <FormHelperText>Integer Number</FormHelperText>
          </FormControl>
          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="miller-y-helper">Miller Y</InputLabel>
            <Input id="miller-y-helper" value={this.state.millerY} onChange={this.handleChange('millerY')} />
            <FormHelperText>Integer Number</FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="miller-z-helper">Miller Z</InputLabel>
            <Input id="miller-z-helper" value={this.state.millerZ} onChange={this.handleChange('millerZ')} />
            <FormHelperText>Integer Number</FormHelperText>
          </FormControl>

          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="layers-helper">Layers</InputLabel>
            <Input id="layers-helper" value={this.state.layers} onChange={this.handleChange('layers')} />
            <FormHelperText>Integer Number</FormHelperText>
          </FormControl>


          <FormControl className={this.props.classes.formControl} >
            <InputLabel htmlFor="vacuum-helper">Vacuum</InputLabel>
            <Input id="vacuum-helper" value={this.state.vacuum} onChange={this.handleChange('vacuum')} />
            <FormHelperText>Float in Angstrom</FormHelperText>
          </FormControl>

          <Grid container justify="flex-end" directio="row">
            <Grid item>
              <Button raised onClick={this.generateSlabs} color="primary"><MdLoop /> Generate </Button>
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
  classes: PropTypes.object.isRequired,
  receiveSlabCifs: PropTypes.func.isRequired,
  saveSlabParams: PropTypes.func.isRequired,

};
export default withStyles(styles, { withTheme: true })(SlabInput);
