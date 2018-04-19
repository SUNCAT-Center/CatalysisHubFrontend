/**
 *
 * PourbaixDiagramView
 *
 */
import React from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Button from 'material-ui/Button';
// import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
// import _ from 'lodash';

// const results = {foo: 'bar'}
// _.isEmpty(results)

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import MdExpandMore from 'react-icons/lib/md/expand-more';

/* import { flaskRoot } from 'utils/constants'; */
const flaskRoot = 'http://api.catalysis-hub.org/';
// const flaskRoot = 'http://localhost:5000/';

const styles = (theme) => ({
  textField: {
    margin: theme.spacing.unit,
  },
  headerBar: {
    marginTop: theme.spacing.unit,
  },
});

const initialState = {
  element1: '',
  element2: '',
  elem1_compo: 1,
  elem2_compo: 1,
  compositionElem1: '',
  temperature: 298.15,
  column1Aqueous: '',
  column2Aqueous: '',
  column3Aqueous: '',
  column1Solids: '',
  column2Solids: '',
  column1AqueousPymatgen: '',
  column2AqueousPymatgen: '',
  column3AqueousPymatgen: '',
  column1SolidsPymatgen: '',
  column2SolidsPymatgen: '',
  loading: false,
  imageData: null,
  imageArray: [],
  imagePymatgen: null,
  imageSurface: null,
  canvas: null,
  color: null,
  contentType: '',
  ionList: [],
  solidList: [],
  ionListPymatgen: [],
  solidListPymatgen: [],
  ionsConc: [],
  ionsConcPymatgen: [],
  LabelsXLoc: [],
  LabelsYLoc: [],
  LabelsText: [],
  completed: 0,
  checkedASE: true,
  checkedLange: false,
  checkedML: false,
  checkedPymatgen: false,
  asePourbaix: true,
  pymatgenPourbaix: false,
  figLayout: null,
  h_line_x: [],
  h_line_y: [],
  o_line_x: [],
  o_line_y: [],
  neutral_line_x: [],
  neutral_line_y: [],
  V0_line_x: [],
  V0_line_y: [],
  labels_name: [],
  labels_loc_x: [],
  labels_loc_y: [],
  species_loc_x: [],
  species_loc_y: [],
};

class PourbaixDiagramView extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.submitQuery = this.submitQuery.bind(this);
    this.submitQueryPymatgen = this.submitQueryPymatgen.bind(this);
    this.submitQueryPourbaix = this.submitQueryPourbaix.bind(this);
    this.submitPourbaixPymatgen = this.submitPourbaixPymatgen.bind(this);
    this.submitSurfacePourbaix = this.submitSurfacePourbaix.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  handleSwitch(name) {
    return (event, checked) => {
      this.setState({ [name]: checked });
    };
  }

  floatWFixedDigits(array) {
    return array.map((elem) => elem.toFixed(2));
  }

  submitQuery() {
    this.setState({
      loading: false,
    });

    axios
      .post(`${flaskRoot}apps/pourbaix/species_ase`, {
        element1: this.state.element1,
        element2: this.state.element2,
        temperature: this.state.temperature,
        checkedASE: this.state.checkedASE,
        checkedLange: this.state.checkedLange,
        checkedML: this.state.checkedML,
        checkedPymatgen: this.state.checkedPymatgen,
      })
      .then((response) => {
        this.setState({
          loading: true,
          ionList: response.data[0].ion_list,
          solidList: response.data[0].solid_list,
          column1Aqueous: 'Aqueous Species_ASE_Lange',
          column2Aqueous: 'Gibbs Formation Energies(ΔG, kJ/mol)',
          column3Aqueous: 'Concentrations(mol/L)',
          column1Solids: 'Solid Species_ASE_Lange',
          column2Solids: 'Gibbs Formation Energies(ΔG, kJ/mol)',
        });
        response.data[0].ion_list.map((listValue) => {
          this.setState({
            [`conc_${listValue[0]}`]: (1e-6).toExponential(),
          });
          return [`conc_${listValue[0]}`];
        });
      });
  }

  submitQueryPymatgen() {
    this.setState({
      loading: false,
    });
    const compositionElem1 =
      parseInt(this.state.elem1_compo, 10) /
      (parseInt(this.state.elem1_compo, 10) +
        parseInt(this.state.elem2_compo, 10));

    axios
      .post(`${flaskRoot}apps/pourbaix/species_pymatgen`, {
        element1: this.state.element1,
        element2: this.state.element2,
        mat_co_1: compositionElem1,
        checkedASE: this.state.checkedASE,
        checkedLange: this.state.checkedLange,
        checkedML: this.state.checkedML,
        checkedPymatgen: this.state.checkedPymatgen,
      })
      .then((response) => {
        this.setState({
          loading: true,
          ionListPymatgen: response.data[0].ion_list,
          solidListPymatgen: response.data[0].solid_list,
          column1AqueousPymatgen: 'Aqueous Species_Pymatgen',
          column2AqueousPymatgen: 'Gibbs Formation Energies(ΔG, kJ/mol)',
          column3AqueousPymatgen: 'Concentrations(mol/L)',
          column1SolidsPymatgen: 'Solid Species_Pymatgen',
          column2SolidsPymatgen: 'Gibbs Formation Energies(ΔG, kJ/mol)',
        });
        // console.log(response);

        response.data[0].ion_list.map((listValue) => {
          this.setState({
            [`conc_pymatgen_${listValue[0]}`]: (1e-6).toExponential(),
          });
          return [`conc_pymatgen_${listValue[0]}`];
        });
      });
  }

  submitQueryPourbaix() {
    this.setState({
      loading: true,
      ionsConc: [],
    });

    this.state.ionList.map((listValue) => {
      this.state.ionsConc.push({
        [`conc_${listValue[0]}`]: this.state[`conc_${listValue[0]}`],
      });
      return this.state.ionsConc;
    });
    axios
      .post(`${flaskRoot}apps/pourbaix/pourbaix_ase/`, {
        element1: this.state.element1,
        element2: this.state.element2,
        elem1_compo: this.state.elem1_compo,
        elem2_compo: this.state.elem2_compo,
        temperature: this.state.temperature,
        ions_conc: this.state.ionsConc,
        checkedASE: this.state.checkedASE,
        checkedLange: this.state.checkedLange,
        checkedML: this.state.checkedML,
      })
      .then((response) => {
        this.setState({
          loading: false,
          completed: 100,
          imageData: response.data[0].data_url,
          figureData: response.data[0].figure_data,
          LabelsXLoc: response.data[0].x_loc,
          LabelsYLoc: response.data[0].y_loc,
          LabelsText: response.data[0].labels_text,
          imageArray: response.data[0].image_array_list,
        });
      });
  }

  submitPourbaixPymatgen() {
    this.setState({
      figLayout:
      { xaxis: {
        zeroline: false,
        showgrid: false,
      },
        yaxis: {
          zeroline: false,
          showgrid: false,
        } },
    });
    const compositionElem1 =
      parseInt(this.state.elem1_compo, 10) /
      (parseInt(this.state.elem1_compo, 10) +
        parseInt(this.state.elem2_compo, 10));

    this.state.ionListPymatgen.map((listValue) => {
      this.state.ionsConcPymatgen.push({
        [`conc_pymatgen_${listValue[0]}`]: this.state[
          `conc_pymatgen_${listValue[0]}`
        ],
      });
      return this.state.ionsConcPymatgen;
    });
    axios
      .post(`${flaskRoot}apps/pourbaix/pourbaix_pymatgen/`, {
        element1: this.state.element1,
        element2: this.state.element2,
        mat_co_1: compositionElem1,
        ions_conc: this.state.ionsConcPymatgen,
      })
      .then((response) => {
        this.setState({
          imagePymatgen: response.data[0].data_url,
          h_line_x: response.data[0].h_line_x,
          h_line_y: response.data[0].h_line_y,
          o_line_x: response.data[0].o_line_x,
          o_line_y: response.data[0].o_line_y,
          neutral_line_x: response.data[0].neutral_line_x,
          neutral_line_y: response.data[0].neutral_line_y,
          V0_line_x: response.data[0].V0_line_x,
          V0_line_y: response.data[0].V0_line_y,
          labels_name: response.data[0].labels_name,
          labels_loc_x: response.data[0].labels_loc_x,
          labels_loc_y: response.data[0].labels_loc_y,
          species_loc_x: response.data[0].species_loc_x,
          species_loc_y: response.data[0].species_loc_y,
          figLayout: { xaxis: {
            range: [-2, 14],
            title: 'pH',
            zeroline: false,
            showgrid: false,
          },
            yaxis: {
              title: 'U/V',
              zeroline: false,
              showgrid: false,
            },
            width: 640,
            height: 480,
            hovermode: 'closest',
            showlegend: false,
            title:
                      'Pourbaix Diagram of ' +
                      `${this.state.element1}` +
                      '_' +
                      `${this.state.element2}`,
          },
        });
      });
  }

  submitSurfacePourbaix() {
    axios
      .post(`${flaskRoot}apps/pourbaix/pourbaix_surface/`, {
        surface1: this.state.surface,
      })
      .then((response) => {
        this.setState({
          imageSurface: response.data[0].data_url,
        });
      });
  }

  render() {
    const hLine = {
      x: this.floatWFixedDigits(this.state.h_line_x),
      y: this.floatWFixedDigits(this.state.h_line_y),
      mode: 'lines+markers',
      name: 'H2_evolution',
      line: {
        dash: 'dashdot',
        width: 3,
      },
    };
    const oLine = {
      x: this.floatWFixedDigits(this.state.o_line_x),
      y: this.floatWFixedDigits(this.state.o_line_y),
      mode: 'lines+markers',
      name: 'O2_reduction',
      line: {
        dash: 'dashdot',
        width: 3,
      },
    };

    const neutralLine = {
      x: this.floatWFixedDigits(this.state.neutral_line_x),
      y: this.floatWFixedDigits(this.state.neutral_line_y),
      mode: 'lines+markers',
      name: 'pH=7',
      line: {
        dash: 'dashdot',
        width: 3,
      },
    };

    const V0Line = {
      x: this.floatWFixedDigits(this.state.V0_line_x),
      y: this.floatWFixedDigits(this.state.V0_line_y),
      mode: 'lines+markers',
      name: 'U=0',
      line: {
        dash: 'dashdot',
        width: 3,
      },
    };

    const labelsLoc = {
      x: this.floatWFixedDigits(this.state.labels_loc_x),
      y: this.floatWFixedDigits(this.state.labels_loc_y),
      mode: 'markers',
      marker: {
        color: 'rgb(142, 124, 195)',
        size: 9,
      },
      name: '',
      text: this.state.labels_name,
    };

    const lineData = [];

    for (let i = 0; i < this.state.species_loc_x.length; i += 1) {
      const speciesLine = {
        x: this.floatWFixedDigits(this.state.species_loc_x[i]),
        y: this.floatWFixedDigits(this.state.species_loc_y[i]),
        mode: 'lines',
        name: `edge_${i}`,
        line: {
          color: 'rgb(0,0,0)',
          width: 2,
        },
      };

      lineData.push(speciesLine);
    }

    lineData.push(hLine, oLine, neutralLine, V0Line, labelsLoc);

    /* console.log( lineData.map((elem) => elem));*/

    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          className={this.props.classes.headerBar}
        >
          <Grid item>
            <h2> Pourbaix Diagram </h2>
          </Grid>
          <Grid>
            <div className={this.props.classes.infoText}>
              Powered by{' '}
              <ReactGA.OutboundLink
                eventLabel="https://github.com/MengZ188/CatalysisHubBackend"
                to="https://github.com/MengZ188/CatalysisHubBackend"
                target="_blank"
              >
                github/MengZ188/CatalysisHubBackend
              </ReactGA.OutboundLink>
            </div>
          </Grid>
        </Grid>
        <h3>For Bulk Systems:</h3>
        <form>
          <TextField
            className={this.props.classes.textField}
            label="Element#1"
            placeholder="Cu"
            value={this.state.element1.value}
            onChange={this.handleChange('element1')}
          />
          <TextField
            className={this.props.classes.textField}
            label="Element#2"
            placeholder="Co"
            value={this.state.element2.value}
            onChange={this.handleChange('element2')}
          />
          <TextField
            className={this.props.classes.textField}
            label="Temperature"
            value={this.state.temperature}
            onChange={this.handleChange('temperature')}
          />
          <br />
          <br />
          <TextField
            className={this.props.classes.textField}
            label={
              `Composition of ${this.state.element1}` ||
              'Composition of Element#1'
            }
            value={this.state.elem1_compo}
            onChange={this.handleChange('elem1_compo')}
          />

          <TextField
            className={this.props.classes.textField}
            label={
              `Composition of ${this.state.element2}` ||
              'Composition of Element#2'
            }
            value={this.state.elem2_compo}
            onChange={this.handleChange('elem2_compo')}
          />
        </form>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedASE}
                onChange={this.handleSwitch('checkedASE')}
              />
            }
            label="ASE Database(aqueous) + Lange Handbook(solids)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.checkedPymatgen}
                onChange={this.handleSwitch('checkedPymatgen')}
              />
            }
            label="Pymatgen Database"
          />
        </FormGroup>
        <br />
        {this.state.checkedASE === true &&
        this.state.checkedPymatgen === false ? (
          <Button
            raised
            onClick={this.submitQuery}
            label="Generate Spacies"
            color="primary"
            value="Generate"
          >
            {' '}
            Generate Species ASE_Lange
          </Button>
        ) : (
          <Button
            raised
            onClick={this.submitQueryPymatgen}
            label="Generate Spacies"
            color="primary"
            value="Generate"
          >
            {' '}
            Generate Species Pymatgen
          </Button>
        )}
        <br />
        <br />
        {this.state.ionList.length === 0 ? null : (
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<MdExpandMore />}>
              <Typography>
                Species from ASE(aqueous) and Lange Handbook(solids)
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <Typography>
                  <Table style={{ width: '65%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{this.state.column1Aqueous}</TableCell>
                        <TableCell>{this.state.column2Aqueous}</TableCell>
                        <TableCell>{this.state.column3Aqueous}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.ionList.map((listValue, i) => (
                        <TableRow key={`${listValue[0]}_${i}`}>
                          <TableCell>{listValue[0]}</TableCell>
                          <TableCell>
                            {/* ase.units.kB = 8.61733033722e-05 eV/K  Boltzmann constant */}
                            {(
                              ((listValue[1] +
                                (Math.log(this.state[`conc_${listValue[0]}`]) *
                                  8.61733033722e-5 *
                                  this.state.temperature)) / 1.0364) * 100
                            ).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Select
                              id={`${listValue[0]}_${i}`}
                              key={`select_${i}`}
                              onChange={this.handleChange(
                                `conc_${listValue[0]}`
                              )}
                              value={this.state[`conc_${listValue[0]}`] || 1e-6}
                              renderValue={(value) => `${value} `}
                            >
                              <MenuItem value="1e-8">1e-8 M </MenuItem>
                              <MenuItem value="1e-7">1e-7 M </MenuItem>s
                              <MenuItem value="1e-6">1e-6 M </MenuItem>
                              <MenuItem value="1e-5">1e-5 M </MenuItem>
                              <MenuItem value="1e-4">1e-4 M </MenuItem>
                              <MenuItem value="1e-3">1e-3 M </MenuItem>
                              <MenuItem value="0.01">0.01 M </MenuItem>
                              <MenuItem value="0.1"> 0.1 M </MenuItem>
                              <MenuItem value="1"> 1 M </MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Table style={{ width: '65%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{this.state.column1Solids}</TableCell>
                        <TableCell>{this.state.column2Solids}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.solidList.map((listValue, i) => (
                        <TableRow key={`${listValue[0]}_${i}`}>
                          <TableCell>{listValue[0]}</TableCell>
                          <TableCell>
                            {((listValue[1] / 1.0364) * 100).toFixed(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
        {this.state.ionListPymatgen.length === 0 ? null : (
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<MdExpandMore />}>
              <Typography>Species from Pymatgen Database</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
                <Typography>
                  <Table style={{ width: '65%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {this.state.column1AqueousPymatgen}
                        </TableCell>
                        <TableCell>
                          {this.state.column2AqueousPymatgen}
                        </TableCell>
                        <TableCell>
                          {this.state.column3AqueousPymatgen}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.ionListPymatgen.map((listValue, i) => (
                        <TableRow key={`pymatgen_${listValue[0]}_${i}`}>
                          <TableCell>{listValue[0]}</TableCell>
                          <TableCell>
                            {/* ase.units.kB = 0.008314457 kJ/mol(-1)K(-1)  Boltzmann constant */}
                            {(
                              listValue[1] +
                              (0.008314457 *
                                this.state.temperature *
                                Math.log(
                                  this.state[`conc_pymatgen_${listValue[0]}`] /
                                    1e-6
                                ))
                            ).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <Select
                              id={`pymatgen_${listValue[0]}_${i}`}
                              key={`select_pymatgen_${i}`}
                              onChange={this.handleChange(
                                `conc_pymatgen_${listValue[0]}`
                              )}
                              value={
                                this.state[`conc_pymatgen_${listValue[0]}`] ||
                                1e-6
                              }
                              renderValue={(value) => `${value} `}
                            >
                              <MenuItem value="1e-8">1e-8 M </MenuItem>
                              <MenuItem value="1e-7">1e-7 M </MenuItem>s
                              <MenuItem value="1e-6">1e-6 M </MenuItem>
                              <MenuItem value="1e-5">1e-5 M </MenuItem>
                              <MenuItem value="1e-4">1e-4 M </MenuItem>
                              <MenuItem value="1e-3">1e-3 M </MenuItem>
                              <MenuItem value="0.01">0.01 M </MenuItem>
                              <MenuItem value="0.1"> 0.1 M </MenuItem>
                              <MenuItem value="1"> 1 M </MenuItem>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Table style={{ width: '65%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {this.state.column1SolidsPymatgen}
                        </TableCell>
                        <TableCell>
                          {this.state.column2SolidsPymatgen}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.solidListPymatgen.map((listValue, i) => (
                        <TableRow key={`pymatgen_${listValue[0]}_${i}`}>
                          <TableCell>{listValue[0]}</TableCell>
                          <TableCell>{listValue[1].toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
        <br />
        <Button
          raised
          onClick={this.submitPourbaixPymatgen}
          label="Generate Pourbaix_pymatgen"
          value="Submit"
          color="primary"
        >
          Generate Pourbaix_pymatgen
        </Button>
        <br />
        {this.state.figLayout === null ? null : (
          <Plot
            data={lineData.map((line) => line)}
            config={{
              displayModeBar: false,
            }}
            layout={this.state.figLayout}
          />
        )}

        <h3>For Surface Systems:</h3>

        <div id="surface pourbaix">
          <Button
            raised
            onClick={this.submitSurfacePourbaix}
            label="Generate Surface Pourbaix"
            value="Submit"
            color="primary"
          >
            Generate Surface Pourbaix
          </Button>
        </div>

        {this.state.imageSurface === null ? null : (
          <img
            src={this.state.imageSurface}
            width="704"
            height="528"
            alt="surface pourbaix"
          />)}

      </div>
    );
  }
}

PourbaixDiagramView.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(PourbaixDiagramView);
