/**
 *
 * PourbaixDiagramView
 *
 */
import React from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";
import TextField from "material-ui/TextField";
import Menu, { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import Table, {TableBody,TableCell,TableHead,TableRow} from "material-ui/Table";
import Grid from "material-ui/Grid";
import { FormControlLabel, FormGroup } from "material-ui/Form"
import Switch from "material-ui/Switch";

const initialState = {
  element1: "",
  element2: "",
  elem1_compo: "",
  elem2_compo: "",
  mat_co_1: "",
  temperature: "",
  column1Aqueous: "",
  column2Aqueous: "",
  column3Aqueous: "",
  column1Solids: "",
  column2Solids: "",
  loading: false,
  imageData: null,
  imageArray: [],
  imagePymatgen: null,
  imageSurface: null,
  canvas: null,
  color: null,
  contentType: "",
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
  species_loc_y: []
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
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleSwitch(name) {
    return (event, checked) => {
      this.setState({ [name]: checked });
    };
  }

  floatWFixedDigits(array) {
    return array.map(elem => elem.toFixed(2));
  }

  submitQuery() {
    this.setState({
      loading: true
    });

    axios
      .post("http://127.0.0.1:5000/apps/spacieslist", {
        element1: this.state.element1,
        element2: this.state.element2,
        temperature: this.state.temperature,
        checkedASE: this.state.checkedASE,
        checkedLange: this.state.checkedLange,
        checkedML: this.state.checkedML,
        checkedPymatgen: this.state.checkedPymatgen
      })
      .then(response => {
        console.log(response);
        this.setState({
          loading: false,
          ionList: response.data[0].ion_list,
          solidList: response.data[0].solid_list,
          column1Aqueous: "Aqueous Species",
          column2Aqueous: "Gibbs Formation Energies(ΔG, kJ/mol)",
          column3Aqueous: "Concentrations(mol/L)",
          column1Solids: "Solid Species",
          column2Solids: "Gibbs Formation Energies(ΔG, kJ/mol)"
        });
        response.data[0].ion_list.map(listValue => {
          this.setState({
            [`conc_${listValue[0]}`]: (1e-6).toExponential()
          });
        });
        console.log(this.state.ionsConc);
      });
  }

  submitQueryPourbaix() {
    this.setState({
      loading: true,
      ionsConc: []
    });

    this.state.ionList.map(listValue => {
      this.state.ionsConc.push({
        [`conc_${listValue[0]}`]: this.state[`conc_${listValue[0]}`]
      });
    });
    console.log(this.state.ionsConc);
    axios
      .post("http://127.0.0.1:5000/apps/pourbaix", {
        element1: this.state.element1,
        element2: this.state.element2,
        elem1_compo: this.state.elem1_compo,
        elem2_compo: this.state.elem2_compo,
        temperature: this.state.temperature,
        ions_conc: this.state.ionsConc,
        checkedASE: this.state.checkedASE,
        checkedLange: this.state.checkedLange,
        checkedML: this.state.checkedML
      })
      .then(response => {
        console.log(response);
        this.setState({
          loading: false,
          completed: 100,
          imageData: response.data[0].data_url,
          figureData: response.data[0].figure_data,
          LabelsXLoc: response.data[0].x_loc,
          LabelsYLoc: response.data[0].y_loc,
          LabelsText: response.data[0].labels_text,
          imageArray: response.data[0].image_array_list
        });
      });
  }

  submitPourbaixPymatgen() {
    var mat_co_1 =
      parseInt(this.state.elem1_compo) /
      (parseInt(this.state.elem1_compo) + parseInt(this.state.elem2_compo));

    axios
      .post("http://127.0.0.1:5000/apps/pourbaix_pymatgen", {
        element1: this.state.element1,
        element2: this.state.element2,
        mat_co_1: mat_co_1
      })
      .then(response => {
        console.log(response);
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
          species_loc_y: response.data[0].species_loc_y
        });
      });
  }

  submitSurfacePourbaix() {
    axios
      .post("http://127.0.0.1:5000/apps/pourbaix_surface", {
        surface1: this.state.surface
      })
      .then(response => {
        console.log(response);
        this.setState({
          imageSurface: response.data[0].data_url
        });
      });
  }

  render() {
    var h_line = {
      x: this.floatWFixedDigits(this.state.h_line_x),
      y: this.floatWFixedDigits(this.state.h_line_y),
      mode: "lines+markers",
      name: "H2_evolution",
      line: {
        dash: "dashdot",
        width: 3
      }
    };
    var o_line = {
      x: this.floatWFixedDigits(this.state.o_line_x),
      y: this.floatWFixedDigits(this.state.o_line_y),
      mode: "lines+markers",
      name: "O2_reduction",
      line: {
        dash: "dashdot",
        width: 3
      }
    };

    var neutral_line = {
      x: this.floatWFixedDigits(this.state.neutral_line_x),
      y: this.floatWFixedDigits(this.state.neutral_line_y),
      mode: "lines+markers",
      name: "pH=7",
      line: {
        dash: "dashdot",
        width: 3
      }
    };

    var V0_line = {
      x: this.floatWFixedDigits(this.state.V0_line_x),
      y: this.floatWFixedDigits(this.state.V0_line_y),
      mode: "lines+markers",
      name: "U=0",
      line: {
        dash: "dashdot",
        width: 3
      }
    };

    var labels_loc = {
      x: this.floatWFixedDigits(this.state.labels_loc_x),
      y: this.floatWFixedDigits(this.state.labels_loc_y),
      mode: "markers",
      marker: {
        color: "rgb(142, 124, 195)",
        size: 9
      },
      name: "",
      text: this.state.labels_name
    };

    var line_data = [];

    for (var i = 0; i < this.state.species_loc_x.length; i++) {
      var species_line = {
        x: this.floatWFixedDigits(this.state.species_loc_x[i]),
        y: this.floatWFixedDigits(this.state.species_loc_y[i]),
        mode: "lines",
        name: "edge_" + `${i}`,
        line: {
          color: "rgb(0,0,0)",
          width: 2
        }
      };

      line_data.push(species_line);
    }

    line_data.push(h_line, o_line, neutral_line, V0_line, labels_loc);

    console.log(
      line_data.map(elem => {
        return elem;
      })
    );

    return (
      <div>
        <h2> Pourbaix Diagram </h2>
        <h3>For Bulk Systems:</h3>
        <form>
          <TextField
            label="Element#1"
            value={this.state.element1.value}
            onChange={this.handleChange("element1")}
          />
          <TextField
            label="Element#2"
            value={this.state.element2.value}
            onChange={this.handleChange("element2")}
          />
          <TextField
            label="Temperature"
            value={this.state.temperature.value}
            onChange={this.handleChange("temperature")}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedASE}
                  onChange={this.handleSwitch("checkedASE")}
                />
              }
              label="ASE Database(aqueous only) + Lange Handbook Database(solids)"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedLange}
                  onChange={this.handleSwitch("checkedLange")}
                />
              }
              label="Lange Handbook Database"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedML}
                  onChange={this.handleSwitch("checkedML")}
                />
              }
              label="Machine Learning Database"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.checkedPymatgen}
                  onChange={this.handleSwitch("checkedPymatgen")}
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

        <Table style={{ width: "65%" }}>
          <TableHead>
            <TableRow>
              <TableCell>{this.state.column1Aqueous}</TableCell>
              <TableCell>{this.state.column2Aqueous}</TableCell>
              <TableCell>{this.state.column3Aqueous}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.ionList.map((listValue, i) => {
              return (
                <TableRow key={`${listValue[0]}_${i}`}>
                  <TableCell>{listValue[0]}</TableCell>
                  <TableCell>
                    {(
                      (listValue[1] +
                        Math.log(this.state[`conc_${listValue[0]}`]) *
                          8.61733033722e-5 *
                          this.state.temperature) /
                      1.0364 *
                      100
                    ).toFixed(1)}
                  </TableCell>
                  <TableCell>
                    <Select
                      id={`${listValue[0]}_${i}`}
                      key={`select_${i}`}
                      onChange={this.handleChange(`conc_${listValue[0]}`)}
                      value={this.state[`conc_${listValue[0]}`] || 1e-6}
                      renderValue={value => `${value} `}
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
              );
            })}
          </TableBody>
        </Table>

        <Table style={{ width: "65%" }}>
          <TableHead>
            <TableRow>
              <TableCell>{this.state.column1Solids}</TableCell>
              <TableCell>{this.state.column2Solids}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.solidList.map((listValue, i) => {
              return (
                <TableRow key={`${listValue[0]}_${i}`}>
                  <TableCell>{listValue[0]}</TableCell>
                  <TableCell>
                    {(listValue[1] / 1.0364 * 100).toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <br />
        <br />

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.asePourbaix}
                onChange={this.handleSwitch("asePourbaix")}
              />
            }
            label="Generate ASE_Pourbaix"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.pymatgenPourbaix}
                onChange={this.handleSwitch("pymatgenPourbaix")}
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
        <img src={this.state.imageData} />
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
          data={line_data.map(line => {
            return line;
          })}
          layout={{
            xaxis: {
              range: [-2, 14],
              title: "pH",
              zeroline: false,
              showgrid: false
            },
            yaxis: {
              title: "U/V",
              zeroline: false,
              showgrid: false
            },
            width: 640,
            height: 480,
            hovermode: "closest",
            showlegend: false,
            title:
              "Pourbaix Diagram of " +
              `${this.state.element1}` +
              "_" +
              `${this.state.element2}`
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

        <img src={this.state.imageSurface} width="704" height="528" />
      </div>
    );
  }
}

PourbaixDiagramView.propTypes = {};

export default PourbaixDiagramView;
