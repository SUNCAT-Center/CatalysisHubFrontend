import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
/* import { FormControlLabel } from 'material-ui/Form';*/
import Input, { InputLabel } from 'material-ui/Input';

import { MdLoop } from 'react-icons/lib/md';

import axios from 'axios';
import { flaskRoot } from 'utils/constants';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';

import { styles } from './styles';

const backendRoot = `${flaskRoot}/apps/bulkEnumerator`;
const url = `${backendRoot}/get_structure`;

const initialState = {
  loading: false,
  loadingParameters: false,
};

export class CellParameterInput extends React.Component {  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = _.merge(initialState,
      _.pick(props, ['cellParameters']));
    this.getStructure = this.getStructure.bind(this);
    this.handleCellParameterChange = this.handleCellParameterChange.bind(this);
  }
  componentDidMount() {
    this.getStructure();
  }
  getStructure() {
    const params = { params: {
      spacegroup: this.props.spacegroup,
      wyckoffPositions: [this.props.wyckoffPoints.map((point) => point.symbol)],
      wyckoffSpecies: [this.props.wyckoffPoints.map((point) => point.species)],
      cellParams: this.props.cellParameters,

    } };
    axios.get(url, params).then((response) => {
      this.props.setCellParameters(response.data.cell_params);
      this.props.receiveBulkStructure(response.data.std_cif);
    });
  }

  handleCellParameterChange(key) {
    return (event) => {
      const cellParameters = this.props.cellParameters;
      cellParameters[key] = event.target.value;
      this.props.setCellParameters(cellParameters);
    };
  }

  render() {
    return (
      <div>
        <h3>Structure Preview</h3>
        <Grid container direction="row" justify="center">
          <Grid item >
            <GeometryCanvasWithOptions
              cifdata={this.props.bulkStructure}
              uniqueId="bulk_preview"
              id="bulk_preview"
              x={2} y={2} z={2}
            />
          </Grid>
        </Grid>
        <h3>Synonyms</h3>
        <div>{this.props.synonyms.length === 0 ? 'Not found.' : this.props.synonyms.join(', ')}</div>
        <Grid container direction="row" justify="space-between">
          <Grid item >
            <h2>Input Cell Parameters</h2>
          </Grid>
          <Grid item >
            <Button
              className={this.props.classes.button}
              color="primary"
              raised
              onClick={this.getStructure}
            >
              <MdLoop /> Update Structure
          </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          {Object.keys(this.props.cellParameters).map((name, i) => (
            <Grid
              key={`fc_input_${i}`}
              item
            >
              <FormControl
                className={this.props.classes.formControl}
              >
                <InputLabel
                  htmlFor={`species-${i}`}
                  className={this.props.classes.inputLabel}
                >{name}</InputLabel>
                <Input
                  id={`species_${i}`}
                  name={`species_${i}`}
                  value={this.props.cellParameters[name].toFixed(5)}
                  onChange={this.handleCellParameterChange(name)}
                />
              </FormControl>
            </Grid>
            ))}
        </Grid>
      </div>
    );
  }

}

CellParameterInput.propTypes = {
  spacegroup: PropTypes.number.isRequired,
  wyckoffPoints: PropTypes.array,
  cellParameters: PropTypes.object,
  bulkStructure: PropTypes.string,
  setCellParameters: PropTypes.func,
  receiveBulkStructure: PropTypes.func,
  classes: PropTypes.object,
  synonyms: PropTypes.array,
};

export default(withStyles(styles, { withTheme: true }))(CellParameterInput);

