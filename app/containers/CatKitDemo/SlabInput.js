import React from 'react';
import PropTypes from 'prop-types';

import { isMobileOnly } from 'react-device-detect';
import FileDrop from 'react-file-drop';

import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';


import { MdClear, MdContentCut, MdFileUpload } from 'react-icons/lib/md';
import _ from 'lodash';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';

import { styles } from './styles';

const backendRoot = `${flaskRoot}/apps/catKitDemo`;


const initialState = {
  millerX: 1,
  millerY: 1,
  millerZ: 1,
  layers: 4,
  vacuum: 10.0,
  uploadError: '',
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
    }, 1500);
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
    };

    const params = { params: {
      bulkParams: this.props.bulkParams,
      slabParams,
    } };
    if (this.props.customBulkInput) {
      params.bulk_cif = this.props.bulkCif;
    }

    this.props.saveSlabParams(slabParams);
    axios.get(url, params).then((response) => {
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
          {isMobileOnly ? null :
          <Grid container direction="row" justify="space-around">
            <Paper className={this.props.classes.fileDrop}>
              <MdFileUpload />{'\u00A0\u00A0'}Drag a slab structure file here.
                      <FileDrop
                        frame={document}
                        onDrop={this.handleFileDrop}
                        dropEffect="move"

                      >
                        <div
                          className={this.props.classes.fileDropActive}
                        >
                          Drop File Here.
                        </div>
                      </FileDrop>
              {_.isEmpty(this.state.uploadError) ? null :
              <div className={this.props.classes.error}>{this.state.uploadError}</div>
                      }
            </Paper>
          </Grid>
              }
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
          {this.props.customSlabInput ? null :
          <Grid container direction="row" justify="flex-start">
            <Grid item>
              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-x-helper">Miller X</InputLabel>
                <Input
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
                <FormHelperText>Integer Number</FormHelperText>
              </FormControl>
              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-y-helper">Miller Y</InputLabel>
                <Input
                  id="miller-y-helper"
                  value={this.state.millerY}
                  onChange={this.handleChange('millerY')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer Number</FormHelperText>
              </FormControl>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="miller-z-helper">Miller Z</InputLabel>
                <Input
                  id="miller-z-helper"
                  value={this.state.millerZ}
                  onChange={this.handleChange('millerZ')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer Number</FormHelperText>
              </FormControl>

              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="layers-helper">Layers</InputLabel>
                <Input
                  id="layers-helper"
                  value={this.state.layers}
                  onChange={this.handleChange('layers')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Integer Number</FormHelperText>
              </FormControl>


              <FormControl className={this.props.classes.formControl} >
                <InputLabel htmlFor="vacuum-helper">Vacuum</InputLabel>
                <Input
                  id="vacuum-helper"
                  value={this.state.vacuum}
                  onChange={this.handleChange('vacuum')}
                  onKeyDown={((event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.generateSlabs();
                    }
                  })}
                />
                <FormHelperText>Float in Angstrom</FormHelperText>
              </FormControl>
            </Grid>

          </Grid>
              }
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
  customSlabInput: PropTypes.bool,
  customBulkInput: PropTypes.bool,
  dropSlabInput: PropTypes.func,
  forgetCustomSlab: PropTypes.func,
  images: PropTypes.array,
  receiveSlabCifs: PropTypes.func.isRequired,
  saveSlabParams: PropTypes.func.isRequired,
};
export default withStyles(styles, { withTheme: true })(SlabInput);
