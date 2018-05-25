import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
/* import { FormControlLabel } from 'material-ui/Form';*/
import Input, { InputLabel } from 'material-ui/Input';
import { Link } from 'react-router';

import { MdLoop, MdChevronRight } from 'react-icons/lib/md';

import axios from 'axios';
import { apiRoot } from 'utils/constants';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';

import * as catKitActions from 'containers/CatKitDemo/actions';
import * as prototypeSearchActions from 'containers/PrototypeSearch/actions';
import * as actions from './actions';
import { styles } from './styles';

const backendRoot = `${apiRoot}/apps/bulkEnumerator`;
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
    this.handoffBulkStructure = this.handoffBulkStructure.bind(this);
    this.handoffPrototypeSearch = this.handoffPrototypeSearch.bind(this);
  }
  componentDidMount() {
    this.getStructure();
  }

  componentWillReceiveProps(nextProps) {
    const cellParameters = nextProps.cellParameters;
    this.props.setCellParameters(cellParameters);
    this.setState({
      cellParameters,
    });
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
      this.props.setName(response.data.name);
    });
  }

  handleCellParameterChange(key) {
    return (event) => {
      const cellParameters = this.props.cellParameters;
      cellParameters[key] = event.target.value;
      this.props.setCellParameters(cellParameters);
      this.setState({
        cellParameters,
      });
    };
  }

  handoffPrototypeSearch(name) {
    this.props.prototypeSearchSaveSearchTerms(`prototype:${name}`);
  }

  handoffBulkStructure() {
    const bulkParams = {
      wyckoff: {
        name: this.props.name,
        spacegroup: this.props.spacegroup,
      },
    };

    this.props.receiveBulkCif(this.props.bulkStructure);
    this.props.saveBulkParams(bulkParams);
    this.props.dropBulkInput();
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
        <Grid container direction="row" justify="space-between">
          <Grid item >
            <h3>Input Cell Parameters</h3>
          </Grid>
          <Grid item >
            <Button
              className={this.props.classes.button}
              color="primary"
              raised
              onClick={this.getStructure}
            >
              <MdLoop />{' \u00A0\u00A0'} Update Structure
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          {Object.keys(this.state.cellParameters).map((name, i) => (
            <Grid
              key={`fc_input_${i}`}
              item
            >
              <FormControl
                className={this.props.classes.formControl}
              >
                <InputLabel
                  htmlFor={`parameter-${i}`}
                  className={this.props.classes.inputLabel}
                >{name}</InputLabel>
                <Input
                  id={`parameter_${i}`}
                  name={`parameter_${i}`}
                  value={this.state.cellParameters[name]}
                  onChange={this.handleCellParameterChange(name)}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.keyCode === 13) {
                      this.getStructure();
                    }
                  }}

                />
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <h3>Prototype Name</h3>
            <div>{_.isEmpty(this.props.name) ? 'Name couldnt be determined' :
            <span>{this.props.name} </span>
            }
              {'\u00A0\u00A0'}
              <Link
                className={this.props.classes.buttonLink}
                to={'/prototypeSearch'}
              >
                <Button
                  color="primary"
                  raised
                  onClick={() => this.handoffPrototypeSearch(this.props.name)}
                >
                  Search similar structures
                  <MdChevronRight />
                </Button>
              </Link>
            </div>
          </Grid>
          <Grid item>
            <h3>CatKit</h3>
            <div>
              Cut arbitrary slabs using
              <Link
                className={this.props.classes.buttonLink}
                to={'/catkitDemo'}
              >
                <Button
                  color="primary"
                  raised
                  onClick={this.handoffBulkStructure}
                  className={this.props.classes.button}
                >
                CatKit <MdChevronRight />
                </Button>
              </Link>
            .
          </div>
          </Grid>
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
  receiveBulkCif: PropTypes.func,
  dropBulkInput: PropTypes.func,
  saveBulkParams: PropTypes.func,
  prototypeSearchSaveSearchTerms: PropTypes.func,
  setName: PropTypes.func,
  classes: PropTypes.object,
  name: PropTypes.string,
};

const mapStateToProps = (state) => ({
  cellParameters: state.get('bulkGeneratorReducer').cellParameters,
  name: state.get('bulkGeneratorReducer').name,
  spacegroup: state.get('bulkGeneratorReducer').spacegroup,
  wyckoffPoints: state.get('bulkGeneratorReducer').wyckoffPoints,
  bulkStructure: state.get('bulkGeneratorReducer').bulkStructure,
});

const mapDispatchToProps = (dispatch) => ({
  setCellParameters: (cellParameters) => {
    dispatch(actions.setCellParameters(cellParameters));
  },
  receiveBulkStructure: (bulkStructure) => {
    dispatch(actions.receiveBulkStructure(bulkStructure));
  },
  setName: (name) => {
    dispatch(actions.setName(name));
  },
  receiveBulkCif: (bulkCif) => {
    dispatch(catKitActions.receiveBulkCif(bulkCif));
  },
  dropBulkInput: () => {
    dispatch(catKitActions.dropBulkInput());
  },
  saveBulkParams: (bulkParams) => {
    dispatch(catKitActions.saveBulkParams(bulkParams));
  },
  prototypeSearchSaveSearchTerms: (x) => {
    dispatch(prototypeSearchActions.saveSearchTerms(x));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CellParameterInput));

