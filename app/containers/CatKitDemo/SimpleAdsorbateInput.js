import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { LinearProgress } from 'material-ui/Progress';
import { FormGroup, FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { MdChevronLeft, MdChevronRight } from 'react-icons/lib/md';

import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';


import axios from 'axios';
import { apiRoot } from 'utils/constants';

import { styles } from './styles';

const backendRoot = `${apiRoot}/apps/catKitDemo`;
const siteUrl = `${backendRoot}/get_adsorption_sites`;
const adsorbatesUrl = `${backendRoot}/place_adsorbates`;

const defaultOccupation = 'empty';


const initialState = {
  siteOccupation: {},
  adsorptionSitesLoading: true,
  loading: false,
  siteType: 'all',
  placeHolder: 'empty',
  adsorbate: 'O',
  activeImage: 0,
  siteNames: [],
  siteTypes: [],
};

const siteNames = [
  'gas',
  'top',
  'bridge',
  'hollow',
  '4fold',
];

class AdsorbateInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.updateAdsorptionSites = this.updateAdsorptionSites.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdsorptionChange = this.handleAdsorptionChange.bind(this);
    this.placeAdsorbates = this.placeAdsorbates.bind(this);
  }

  componentDidMount() {
    this.updateAdsorptionSites();
  }
  handlePageFlip(delta) {
    const n = this.props.images.length;
    this.setState({
      activeImage: (((this.state.activeImage + delta) % n) + n) % n,
      // javascript version of modulo that works for positive and negative
      // input.
    });
  }

  resetPageFlip() {
    this.setState({
      activeImage: 0,
    });
  }

  updateAdsorptionSites(options = {}) {
    this.setState({
      loading: true,
    });
    const adsorbateParams = {
      siteType: options.siteType || this.state.siteType,
      placeHolder: options.placeHolder || this.state.placeHolder,
      adsorbate: options.adsorbate || this.state.adsorbate,
    };
    const params = { params: {
      bulk_cif: this.props.bulkCif,
      bulkParams: this.props.bulkParams,
      slabParams: this.props.slabParams,
      adsorbateParams,
    } };
    axios.get(siteUrl, params).then((response) => {
      if (response.data.error) {
        this.props.openSnackbar(response.data.error);
      }
      const siteOccupation = [];
      this.props.saveAdsorbateParams(adsorbateParams);
      this.props.saveAdsorptionSites(response.data.data);

      this.setState({
        siteNames: response.data.site_names,
        siteTypes: response.data.site_types,
      });

      response.data.data.map((imageSites, i) => {
        siteOccupation[i] = {};
        return Object.keys(imageSites).map((siteName) => {
          siteOccupation[i][siteName] = [];
          return imageSites[siteName][0].map(() => siteOccupation[i][siteName].push(defaultOccupation));
        });
      });
      this.props.receiveSlabCifs(response.data.cifImages);
      this.props.saveAltLabels(response.data.altLabels);
      this.setState({
        siteOccupation,
        adsorptionSitesLoading: false,
      });
      this.props.saveSiteOccupations(siteOccupation);
      this.setState({
        loading: false,
      });
    });
  }

  placeAdsorbates() {
    const params = { params: {
      bulkParams: this.props.bulkParams,
      slabParams: this.props.slabParams,
      siteOccupation: this.state.siteOccupation,
    } };
    axios.get(adsorbatesUrl, params).then((response) => {
      this.props.receiveSlabCifs(response.data.images);
    });
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
      if (name === 'placeHolder') {
        this.updateAdsorptionSites({ placeHolder: event.target.value });
      } else if (name === 'siteType') {
        this.updateAdsorptionSites({ siteType: event.target.value });
      } else if (name === 'adsorbate') {
        this.updateAdsorptionSites({ adsorbate: event.target.value });
      }
    };
  }

  handleAdsorptionChange(image, siteName, index) {
    return (event) => {
      if (typeof this.state.siteOccupation !== 'undefined') {
        const siteOccupation = _.clone(this.state.siteOccupation);
        siteOccupation[image][siteName][index] = event.target.value;
        this.setState({
          siteOccupation,
        });
        this.placeAdsorbates();
      }
    };
  }
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          {(typeof this.props.adsorptionSites === 'undefined' ||
                !_.isFunction(this.props.adsorptionSites.map)) ?
                  null
                  :
                  <div>
                    <Paper className={this.props.classes.paper}>
                      <Grid container direction="row" justify="space-between">
                        <Grid item>
                          <h2>Configure Adsorbates</h2>
                        </Grid>
                        <Grid item>
                          <Grid container direction="row" justify="space-between">
                            <Grid item>
                              <FormGroup row className={this.props.classes.formGroup} >
                                <FormControl >
                                  <InputLabel>Adsorbate</InputLabel>
                                  <Select
                                    className={this.props.classes.select}
                                    value={this.state.adsorbate}
                                    onChange={this.handleChange('adsorbate')}
                                  >
                                    <MenuItem value="H">H</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="N">N</MenuItem>
                                    <MenuItem value="O">O</MenuItem>
                                    <MenuItem value="S">S</MenuItem>
                                  </Select>
                                </FormControl>

                              </FormGroup>
                            </Grid>


                            <Grid item>
                              <FormGroup row className={this.props.classes.formGroup} >
                                <FormControl >
                                  <InputLabel>Site Type</InputLabel>
                                  <Select
                                    className={this.props.classes.select}
                                    value={this.state.siteType}
                                    onChange={this.handleChange('siteType')}
                                  >
                                    <MenuItem value="all">all</MenuItem>
                                    {this.state.siteTypes.map((siteType) => (
                                      <MenuItem key={`siteType_${siteType}`} value={siteType}>{`${siteType} (${_.get(siteNames, siteType, 'all')})`}</MenuItem>
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              </FormGroup>
                            </Grid>

                            <Grid item>
                              <FormGroup row className={this.props.classes.formGroup} >
                                <FormControl >
                                  <InputLabel>Placeholder</InputLabel>
                                  <Select
                                    className={this.props.classes.select}
                                    value={this.state.placeHolder}
                                    onChange={this.handleChange('placeHolder')}
                                  >
                                    <MenuItem value="empty">empty</MenuItem>
                                    <MenuItem value="Cl">Cl</MenuItem>
                                    <MenuItem value="F">F</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="H">H</MenuItem>
                                    <MenuItem value="Ne">Ne</MenuItem>
                                    <MenuItem value="Br">Br</MenuItem>
                                  </Select>
                                </FormControl>
                              </FormGroup>
                            </Grid>


                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                    {this.state.loading ? <LinearProgress /> : null }
                  </div>
              }
          <Paper className={this.props.classes.paper}>
            <Grid container justify="center" direction="row">
              <Grid item >
                <Grid container direction="column" justify="space-around" className={this.props.classes.flipButton}>
                  <Grid item >
                    <Button
                      fab
                      mini
                      onClick={() => this.handlePageFlip(-1)}
                    >
                      <MdChevronLeft size={30} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item key={`item_${this.state.activeImage}`}>
                <h4>{`Site "${this.state.siteNames[this.state.activeImage]} (${_.get(siteNames, this.state.siteNames[this.state.activeImage], '')})" -- (${this.state.activeImage + 1}/${this.props.images.length}).`}</h4>
                <GeometryCanvasWithOptions
                  cifdata={this.props.images[this.state.activeImage]}
                  uniqueId={`slab_preview_${this.state.activeImage}`}
                  key={`slab_preview_${this.state.activeImage}`}
                  id={`slab_preview_${this.state.activeImage}`}
                  x={1} y={1} z={1}
                  altLabels={this.props.altLabels[0]}
                />
              </Grid>
              <Grid item >
                <Grid container direction="column" justify="center" className={this.props.classes.flipButton}>
                  <Grid item>
                    <Button
                      fab
                      mini
                      onClick={() => this.handlePageFlip(+1)}
                    >
                      <MdChevronRight size={30} />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
        }
      </div>
    );
  }
}

AdsorbateInput.defaultProps = {
  altLabels: [],
};

AdsorbateInput.propTypes = {
  adsorptionSites: PropTypes.array,
  bulkCif: PropTypes.string,
  bulkParams: PropTypes.object,
  classes: PropTypes.object,
  images: PropTypes.array,
  altLabels: PropTypes.array,
  saveAdsorptionSites: PropTypes.func,
  saveAdsorbateParams: PropTypes.func.isRequired,
  slabParams: PropTypes.object,
  receiveSlabCifs: PropTypes.func,
  saveAltLabels: PropTypes.func,
  saveSiteOccupations: PropTypes.func,
  openSnackbar: PropTypes.func,
};


export default withStyles(styles, { withTheme: true })((AdsorbateInput));
