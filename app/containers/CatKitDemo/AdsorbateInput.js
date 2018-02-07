import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { LinearProgress } from 'material-ui/Progress';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { FormGroup, FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';

import GeometryCanvasCifdata from 'components/GeometryCanvasCifdata';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';

import { styles } from './styles';

const backendRoot = `${flaskRoot}/apps/catKitDemo`;
const siteUrl = `${backendRoot}/get_adsorption_sites`;
const adsorbatesUrl = `${backendRoot}/place_adsorbates`;

const defaultOccupation = 'empty';


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const initialState = {
  siteOccupation: {},
  adsorptionSitesLoading: true,
  siteType: 'hollow',
  placeHolder: 'Cl',
};

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

  updateAdsorptionSites(options = {}) {
    const params = { params: {
      bulkParams: this.props.bulkParams,
      slabParams: this.props.slabParams,
      adsorbateParams: {
        siteType: options.siteType || this.state.siteType,
        placeHolder: options.placeHolder || this.state.placeHolder,
      },
    } };
    axios.get(siteUrl, params).then((response) => {
      const siteOccupation = {};
      this.props.saveAdsorptionSites(response.data.data);

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
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      <h2>Configure Adsorbates</h2>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" justify="space-between">
                        <Grid item>
                          <FormGroup row className={this.props.classes.formGroup} >
                            <FormControl >
                              <InputLabel>Placeholder</InputLabel>
                              <Select
                                className={this.props.classes.select}
                                value={this.state.placeHolder}
                                onChange={this.handleChange('placeHolder')}
                              >
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
                          <FormGroup row className={this.props.classes.formGroup} >
                            <FormControl >
                              <InputLabel>Site Type</InputLabel>
                              <Select
                                className={this.props.classes.select}
                                value={this.state.siteType}
                                onChange={this.handleChange('siteType')}
                              >
                                <MenuItem value="all">all</MenuItem>
                                {Object.keys(_.get(this.props.adsorptionSites, 0, {})).map((siteType) => (
                                  <MenuItem key={`siteType_${siteType}`} value={siteType}>{siteType}</MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
              }
          <Grid container justify="flex-start" direction="row">
            {this.props.images.map((image, i) => (
              <Grid item key={`item_${i}`}>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <GeometryCanvasCifdata
                      cifdata={this.props.images[i]}
                      uniqueId={`slab_preview_${i}`}
                      key={`slab_preview_${i}`}
                      id={`slab_preview_${i}`}
                      x={1} y={1} z={1}
                      altLabels={this.props.altLabels[i]}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" justify="flex-start" className={this.props.classes.sitePanel}>
                      {this.state.adsorptionSitesLoading ? <LinearProgress className={this.props.classes.progress} /> : null}
                      {_.isEmpty(this.props.adsorptionSites) ? null :
                              Object.keys(this.props.adsorptionSites[i]).map((siteName, j) => (
                                <div
                                  className={this.props.classes.ep_root}
                                  key={`ep_(${[i, j]})`}
                                >
                                  {_.get(this.props.adsorptionSites, [i, siteName, 0], []).length === 0 ? null :
                                  <ExpansionPanel
                                    className={this.props.classes.expansionPanel}
                                    disabled={_.get(this.props.adsorptionSites, [i, siteName, 0], []).length === 0}
                                  >

                                    <ExpansionPanelSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      className={this.props.classes.expansionPanel}
                                    >
                                      <h4> {`${capitalize(siteName)} Site` } </h4>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails
                                      className={this.props.classes.expansionPanel}
                                    >
                                      <Grid
                                        container
                                        justify="flex-start"
                                        direction="row"
                                        className={this.props.classes.expansionPanel}
                                      >
                                        <FormGroup row className={this.props.classes.formGroup} >
                                          {_.get(this.props.adsorptionSites, [i, siteName, 0], []).map((siteAtoms, k) => (
                                            <FormControl key={`grid_item_${[i, j, k]}`}>
                                              <InputLabel>{`${capitalize(siteName)} ${k}`}</InputLabel>
                                              <Select
                                                className={this.props.classes.select}
                                                key={`select=(${[i, j, k]})`}
                                                value={_.get(this.state.siteOccupation, [i, siteName, k], '')}
                                                onChange={this.handleAdsorptionChange(i, siteName, k)}
                                              >
                                                <MenuItem value="empty">empty</MenuItem>
                                                <MenuItem value="H">H</MenuItem>
                                                <MenuItem value="C">C</MenuItem>
                                                <MenuItem value="O">O</MenuItem>
                                                <MenuItem value="N">N</MenuItem>
                                                <MenuItem value="S">S</MenuItem>
                                                <MenuItem value="Cl">Cl</MenuItem>
                                              </Select>
                                            </FormControl>
                                            ))}
                                        </FormGroup>
                                      </Grid>
                                    </ExpansionPanelDetails>
                                  </ExpansionPanel>
                                  }
                                </div>
                              ))
                          }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                ))}
          </Grid>
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
  slabParams: PropTypes.object,
  receiveSlabCifs: PropTypes.func,
  saveAltLabels: PropTypes.func,
  saveSiteOccupations: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(AdsorbateInput);
