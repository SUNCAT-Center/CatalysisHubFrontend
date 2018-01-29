import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { FormGroup } from 'material-ui/Form';

import { MdAddLocation } from 'react-icons/lib/md';
import GeometryCanvasCifdata from 'components/GeometryCanvasCifdata';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';
const backendRoot = `${flaskRoot}/apps/catKitDemo`;
const siteUrl = `${backendRoot}/get_adsorption_sites`;
const adsorbatesUrl = `${backendRoot}/place_adsorbates`;

const defaultOccupation = 'empty';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  header: {},
  lightsandhill: {},
  buttongrid: {},
  paper: {},
  expansionPanel: {
    width: '40%',
    maxWidth: '40%',
  },
  ep_root: {
    width: '100%',
  },
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const initialState = {
  siteOccupation: {},
  adsorptionSitesLoading: true,
};

class AdsorbateInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleAdsorptionChange = this.handleAdsorptionChange.bind(this);
    this.placeAdsorbates = this.placeAdsorbates.bind(this);
  }

  componentDidMount() {
    const params = { params: {
      bulkParams: this.props.bulkParams,
      slabParams: this.props.slabParams,
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
      this.setState({
        siteOccupation,
        adsorptionSitesLoading: false,
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
      }
    };
  }
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          <Grid container justify="flex-end" direction="row">
            <Grid item>
              <Button
                raised
                color="primary"
                onClick={this.placeAdsorbates}
              >
                <MdAddLocation /> {'\u00A0\u00A0'}Place Adsorbates
                  </Button>
            </Grid>
          </Grid>
          {(typeof this.props.adsorptionSites === 'undefined' ||
                !_.isFunction(this.props.adsorptionSites.map)) ?
              null
                  :
              <h2>Configure Adsorbates</h2> }
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
                      x={2} y={2} z={1}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" justify="flex-start">
                      {_.isEmpty(this.props.adsorptionSites) ? null :
                                  Object.keys(this.props.adsorptionSites[i]).map((siteName, j) => (
                                    <div
                                      className={this.props.classes.ep_root}
                                      key={`ep_(${[i, j]})`}
                                    >
                                      <ExpansionPanel
                                        className={this.props.classes.expansionPanel}
                                        disabled={_.get(this.props.adsorptionSites, [i, siteName, 0], []).length === 0}
                                      >

                                        <ExpansionPanelSummary
                                          expandIcon={<ExpandMoreIcon />}
                                        >
                                          <h4> {`${capitalize(siteName)} Site` } </h4>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                          <Grid container justify="flex-start" direction="row">
                                            {_.get(this.props.adsorptionSites, [i, siteName, 0], []).map((siteAtoms, k) => (
                                              <Grid item key={`grid_item_${[i, j, k]}`}>
                                                <FormGroup row>
                                                  <Select
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
                                                </FormGroup>
                                              </Grid>
                                              ))}
                                          </Grid>
                                        </ExpansionPanelDetails>
                                      </ExpansionPanel>
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

AdsorbateInput.propTypes = {
  adsorptionSites: PropTypes.array,
  bulkCif: PropTypes.string,
  bulkParams: PropTypes.object,
  classes: PropTypes.object,
  images: PropTypes.array,
  saveAdsorptionSites: PropTypes.func,
  slabParams: PropTypes.object,
  receiveSlabCifs: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(AdsorbateInput);
