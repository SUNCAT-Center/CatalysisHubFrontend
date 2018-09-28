import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router';
import { compose } from 'recompose';

import _ from 'lodash';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Switch from 'material-ui/Switch';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { LinearProgress } from 'material-ui/Progress';
import { FormGroup, FormControl, FormControlLabel } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import { MdLoop, MdChevronLeft, MdChevronRight, MdCheckCircle } from 'react-icons/lib/md';
import {
  IoCube,
} from 'react-icons/lib/io';
import { FaList } from 'react-icons/lib/fa';
import Tooltip from 'material-ui/Tooltip';

import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';


import axios from 'axios';
import { apiRoot } from 'utils/constants';

import { styles } from './styles';

const backendRoot = `${apiRoot}/apps/catKitDemo`;
const siteUrl = `${backendRoot}/get_adsorption_sites`;

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
  checkedCatLearn: false,
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
    this.saveCalculation = this.saveCalculation.bind(this);
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

  handleSwitch(name) {
    return (event, checked) => {
      this.setState({ [name]: checked });
      this.updateAdsorptionSites({ callCatLearn: event.target.value });
    };
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
      format: this.props.cookies.get('preferredFormat'),
      callCatLearn: this.state.checkedCatLearn,
    };
    const params = { params: {
      bulk_cif: this.props.bulkCif,
      bulkParams: _.omit(this.props.bulkParams, ['cif', 'input', 'wyckoff.cif']),
      slabParams: _.omit(this.props.slabParams, ['cif', 'input']),
      adsorbateParams,
    } };
    axios.get(siteUrl, params).then((response) => {
      if (response.data.error) {
        this.props.openSnackbar(response.data.error);
      }
      const siteOccupation = [];
      this.props.saveAdsorbateParams({
        ...adsorbateParams,
        cifs: response.data.cifImages,
        equations: response.data.equations,
        molecules: response.data.molecules,
        inputs: response.data.inputImages,
        mean: response.data.mean,
        uncertainty: response.data.uncertainty,
        references: response.data.references,
      });
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
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="CH">CH</MenuItem>
                                    <MenuItem value="CHH">CHH</MenuItem>
                                    <MenuItem value="CHHH">CHHH</MenuItem>
                                    <MenuItem value="CO">CO</MenuItem>
                                    <MenuItem value="COH">COH</MenuItem>
                                    <MenuItem value="COO">COO</MenuItem>
                                    <MenuItem value="H">H</MenuItem>
                                    <MenuItem value="N">N</MenuItem>
                                    <MenuItem value="NH">NH</MenuItem>
                                    <MenuItem value="NHH">NHH</MenuItem>
                                    <MenuItem value="NO">NO</MenuItem>
                                    <MenuItem value="O">O</MenuItem>
                                    <MenuItem value="OCHO">OCHO</MenuItem>
                                    <MenuItem value="OH">OH</MenuItem>
                                    <MenuItem value="OOH">OOH</MenuItem>
                                    <MenuItem value="S">S</MenuItem>
                                    <MenuItem value="SH">SH</MenuItem>


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

                            <Grid item>
                              <Tooltip title="Powered by CatLearn">
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={this.state.checkedCatLearn}
                                      onChange={this.handleSwitch('checkedCatLearn')}
                                    />
                                  }
                                  label="Estimate energies"
                                />
                              </Tooltip>
                            </Grid>

                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                    {this.state.loading ? <LinearProgress /> : null }
                  </div>
              }

          { _.isEmpty(this.props.adsorbateParams) || _.isEmpty(this.props.adsorbateParams.mean) ? null :
          <Paper className={this.props.classes.paper}>
            <Grid item>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <h4> Estimated adsorbate energy </h4>
                  <div>
                    {Number((this.props.adsorbateParams.mean[this.state.activeImage]).toFixed(2))}{' eV \xb1 '}{Number((this.props.adsorbateParams.uncertainty[this.state.activeImage]).toFixed(2))}{' eV'}
                  </div>
                </Grid>
                <Grid item>
                  <h4>versus</h4>
                  <div>{this.props.adsorbateParams.references[this.state.activeImage]}</div>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
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
                <h4>{this.state.siteType !== 'all' ?
                    `Site "${this.state.siteType} (${siteNames[this.state.siteType]})"`
                  : `Site "${this.state.siteNames[this.state.activeImage]} (${_.get(siteNames, this.state.siteNames[this.state.activeImage], '')})"`}{` \u2014 (${this.state.activeImage + 1}/${this.props.images.length}).`}</h4>
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

        {!_.isEmpty(this.props.slabParams) ? null :
        <Grid container justify="center" direction="row">
          <Grid item>
            <Grid container direction="column" justify="space-between">
              <Grid item className={this.props.classes.finish}>
                {'And that\'s a wrap.\u00A0\u00A0\u00A0'} <MdCheckCircle size={92} color="green" />
              </Grid>
              <Grid item>
                <div>Start new structure from scratch:
                  <Button
                    onClick={this.props.stepperHandleReset}
                    raised
                    className={this.props.classes.button}
                  ><MdLoop />{'\u00A0'} Start Over </Button> </div>
              </Grid>
              <Grid item>
                  Find and start from an existing structure
                  <Link to="/prototypeSearch" className={this.props.classes.buttonLink}>
                    <Button raised onClick={this.props.stepperHandleReset} className={this.props.classes.button}><IoCube /> {'\u00A0'} Prototype Search </Button>
                  </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        }

        <Grid container justify="flex-end" direction="row">
          <Grid item>
            <Button
              raised
              disabled={_.isEmpty(this.props.slabParams)}
              onClick={this.saveCalculation}
              color="primary"
            ><FaList /> {'\u00A0\u00A0'}Store Calculation</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

AdsorbateInput.defaultProps = {
  altLabels: [],
};

AdsorbateInput.propTypes = {
  adsorbateParams: PropTypes.object,
  adsorptionSites: PropTypes.array,
  altLabels: PropTypes.array,
  bulkCif: PropTypes.string,
  bulkParams: PropTypes.object,
  classes: PropTypes.object,
  clearBulkCif: PropTypes.func,
  clearBulkParams: PropTypes.func,
  clearSlabCifs: PropTypes.func,
  clearSlabParams: PropTypes.func,
  cookies: instanceOf(Cookies),
  images: PropTypes.array,
  openSnackbar: PropTypes.func,
  receiveSlabCifs: PropTypes.func,
  saveAdsorbateParams: PropTypes.func.isRequired,
  saveAdsorptionSites: PropTypes.func,
  saveAltLabels: PropTypes.func,
  saveCalculation: PropTypes.func,
  saveSiteOccupations: PropTypes.func,
  siteOccupations: PropTypes.object,
  slabParams: PropTypes.object,
  stepperHandleReset: PropTypes.func,
};


export default compose(
  withStyles(styles, { withTheme: true }),
  withCookies,
)((AdsorbateInput));
