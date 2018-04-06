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
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

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
  elem1_compo: '',
  elem2_compo: '',
  compositionElem1: '',
  temperature: '',
  column1Aqueous: '',
  column2Aqueous: '',
  column3Aqueous: '',
  column1Solids: '',
  column2Solids: '',
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
  ionsConc: [],
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
  hover: false,
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
      loading: true,
    });

    axios
      .post(`${flaskRoot}apps/pourbaix/`, {
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
          loading: false,
          ionList: response.data[0].ion_list,
          solidList: response.data[0].solid_list,
          column1Aqueous: 'Aqueous Species',
          column2Aqueous: 'Gibbs Formation Energies(ΔG, kJ/mol)',
          column3Aqueous: 'Concentrations(mol/L)',
          column1Solids: 'Solid Species',
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
    const compositionElem1 =
      parseInt(this.state.elem1_compo, 10) /
      (parseInt(this.state.elem1_compo, 10) + parseInt(this.state.elem2_compo, 10));

    axios
      .post(`${flaskRoot}apps/pourbaix/pourbaix_pymatgen/`, {
        element1: this.state.element1,
        element2: this.state.element2,
        mat_co_1: compositionElem1,
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
            <div
              className={this.props.classes.infoText}
            >Powered by <ReactGA.OutboundLink
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
            value={this.state.element1.value}
            onChange={this.handleChange('element1')}
          />
          <TextField
            className={this.props.classes.textField}
            label="Element#2"
            value={this.state.element2.value}
            onChange={this.handleChange('element2')}
          />
          <TextField
            className={this.props.classes.textField}
            value={this.state.temperature.value}
            onChange={this.handleChange('temperature')}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedASE}
                  onChange={this.handleSwitch('checkedASE')}
                />
              }
              label="ASE Database(aqueous only) + Lange Handbook Database(solids)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedLange}
                  onChange={this.handleSwitch('checkedLange')}
                />
              }
              label="Lange Handbook Database"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedML}
                  onChange={this.handleSwitch('checkedML')}
                />
              }
              label="Machine Learning Database"
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
          <Button
            raised
            onClick={this.submitQuery}
            label=" Generate Spacies"
            color="primary"
            value="Generate"
          >
            Generate Species
          </Button>
          <br />
        </form>
        <br />

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
                  {(((listValue[1] + (Math.log(this.state[`conc_${listValue[0]}`])
                       * 8.61733033722e-5 * this.state.temperature)) / 1.0364) * 100).toFixed(1)
                  }
                </TableCell>
                <TableCell>
                  <Select
                    id={`${listValue[0]}_${i}`}
                    key={`select_${i}`}
                    onChange={this.handleChange(`conc_${listValue[0]}`)}
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

        <br />
        <br />

        <TextField
          label="Composition Element#1"
          value={this.state.elem1_compo.value}
          onChange={this.handleChange('elem1_compo')}
        />

        <TextField
          label="Composition Element#2"
          value={this.state.elem2_compo.value}
          onChange={this.handleChange('elem2_compo')}
        />
        <br />
        <br />

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.asePourbaix}
                onChange={this.handleSwitch('asePourbaix')}
              />
            }
            label="Generate ASE_Pourbaix"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.pymatgenPourbaix}
                onChange={this.handleSwitch('pymatgenPourbaix')}
              />
            }
            label="Generate pymatgen_Pourbaix"
          />
        </FormGroup>
        <br />
        <br />

        <Button
          raised
          onClick={this.submitQueryPourbaix}
          label="Generate Pourbaix_ase"
          value="Submit"
          color="primary"
        >
          Generate Pourbaix_ase
        </Button>
        <br />
        <img src={this.state.imageData} alt="Pourbaix_ase" />
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

        <Plot
          data={lineData.map((line) => line)}
          layout={{
            xaxis: {
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
          }}
        />

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

        <img src={this.state.imageSurface} width="704" height="528" alt="Pourbaix_surface" />
      </div>
    );
  }
}

PourbaixDiagramView.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(PourbaixDiagramView);
