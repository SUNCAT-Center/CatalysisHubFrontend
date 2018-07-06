import _ from 'lodash';
import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import IFrame from 'react-iframe';
import { GridLoader } from 'react-spinners';

import FileDrop from 'react-file-drop';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { LinearProgress } from 'material-ui/Progress';

import { MdAdd, MdFileUpload } from 'react-icons/lib/md';
import { FaExternalLink } from 'react-icons/lib/fa';


import axios from 'axios';
import cachios from 'cachios';
import { apiRoot } from 'utils/constants';

import { hmSymbols } from 'utils/data';
import * as actions from './actions';
import { styles } from './styles';
import ElementAutosuggest from './ElementAutoSuggest';

export const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'];

const backendRoot = `${apiRoot}/apps/bulkEnumerator`;
const url = `${backendRoot}/get_wyckoff_list`;
const fileDropUrl = `${backendRoot}/get_wyckoff_from_structure`;


const initialState = {
  spacegroup: 1,
  loading: false,
  wyckoffPoints: [],
  open: false,
  spacegroupInfoLoading: false,
};

export class WyckoffInput extends React.Component {  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = _.merge(initialState,
      _.pick(props, ['spacegroup', 'wyckoffPoints'])
    );
    this.props.setSpacegroup(parseInt(this.state.spacegroup, 10));

    this.handleChange = this.handleChange.bind(this);
    this.selectWyckoffPoint = this.selectWyckoffPoint.bind(this);
    this.removeWyckoffPoint = this.removeWyckoffPoint.bind(this);
    this.handleWyckoffPointChange = this.handleWyckoffPointChange.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  getWyckoffList() {
    this.setState({
      loading: true,
    });
    this.props.setSpacegroup(parseInt(this.state.spacegroup, 10));
    const params = { params: {
      spacegroup: this.state.spacegroup,
    },
      ttl: 300,
    };
    cachios.get(url, params).then((response) => {
      this.props.receiveWyckoffList(response.data.wyckoff_list);
      this.props.setWyckoffPoints([]);
      this.setState({
        loading: false,
        wyckoffPoints: [],
      });
    });
  }


  handleFileDrop(files) {
    this.setState({
      loading: true,
    });
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('outFormat', 'cif');
    axios.post(fileDropUrl, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((response) => {
      this.setState({
        loading: false,
      });

      const cellParams = {};
      response.data.parameter_values.map((param) => { cellParams[param.name.split("'")[1]] = param.value; return param.value; });

      this.props.setCellParameters(cellParams);

      const name = response.data.name.split("'")[1];
      this.props.setName(name);

      const permutations = response.data.species_permutations.map((perm) => perm.split("'")[1]);
      this.props.setPermutations(permutations);

      this.props.receiveBulkStructure(response.data.cif);
      this.props.setSpacegroup(parseInt(response.data.spacegroup, 10));
      this.props.receiveWyckoffList(response.data.wyckoff_list.map((point) => ({
        ...point,
        symbol: point.symbol.split("'")[1],
      })));
      const wyckoffPoints = _.zip(response.data.species, response.data.wyckoff).map((p) => ({
        species: p[0].split("'")[1],
        symbol: p[1].split("'")[1],
      }));
      this.props.setWyckoffPoints(wyckoffPoints);
      this.setState({
        spacegroup: response.data.spacegroup,
        wyckoffPoints,
      });
    });
  }

  handleWyckoffPointChange(i, { value }) {
    const wyckoffPoints = this.state.wyckoffPoints;
    wyckoffPoints[i].species = value;

    this.setState({
      wyckoffPoints,
    });
    this.props.setWyckoffPoints(wyckoffPoints);
  }

  removeWyckoffPoint(event, i) {
    if (event.target.type === 'text') {
      // ugly hack, necessary to propagate
      // delete event on a chip.
      let val = event.nativeEvent.target.value;
      val = val.slice(0, val.length - 1);
      event.nativeEvent.target.value = val; // eslint-disable-line  no-param-reassign
    } else {
      this.setState({
        wyckoffPoints: this.state.wyckoffPoints.filter((x, j) => i !== j),
      });
      this.props.setWyckoffPoints(this.state.wyckoffPoints.filter((x, j) => i !== j));
    }
    return event;
  }

  handleChange(name) {
    return (event) => {
      if (name === 'spacegroup') {
        const value = event.target.value;
        if (_.isEmpty(value) || (!!parseInt(value, 10) && parseInt(value, 10) > 0 && parseInt(value, 10) < 231)) {
          this.setState({
            [name]: parseInt(event.target.value, 10) || null,
          });
        }
        this.props.setSpacegroup(parseInt(this.state.spacegroup, 10) || null);
      } else {
        this.setState({
          [name]: event.target.value,
        });
      }
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  selectWyckoffPoint(point) {
    const wyckoffPoints = _.concat(this.state.wyckoffPoints, _.cloneDeep([point]));
    this.setState({
      wyckoffPoints,
    });
    this.props.setWyckoffPoints(wyckoffPoints);
  }
  render() {
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={() => { this.handleClose(); }}
        >
          <div>
            {this.state.spacegroupInfoLoading ?
              <Grid container direction="column" justify="center">
                <Grid item>
                  <Grid container direction="row" justify="center">
                    <GridLoader />
                  </Grid>
                </Grid>
              </Grid>
              :
              null
          }
            <IFrame
              className={this.props.classes.iframe}
              url={`http://www.cryst.ehu.es/cgi-bin/cryst/programs/nph-wp-list?gnum=${this.props.spacegroup}`}
              width="95vw"
              height="95vh"
              position="relative"
              onLoad={() => {
                this.setState({
                  spacegroupInfoLoading: false,
                });
              }}
              top="50px"
              display="initial"
            />
          </div>
        </Modal>
        <Paper className={this.props.classes.fileDrop}>
          <MdFileUpload />{'\u00A0\u00A0'}Drag a bulk structure here for analyzing existing structures.
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
        <h2>Choose Spacegroup</h2>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <FormControl className={this.props.classes.formControl} >
              <InputLabel htmlFor="spacegroup-simple">Spacegroup Number</InputLabel>
              <Input
                id="spacegroup-helper"
                value={this.state.spacegroup}
                onChange={this.handleChange('spacegroup')}
                onKeyDown={((event) => {
                  if (event.nativeEvent.keyCode === 13) {
                    this.getWyckoffList();
                  }
                }
                )}
              />
              <FormHelperText id="name-helper-text">Between 1 and 230</FormHelperText>

            </FormControl>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              raised
              onClick={() => this.getWyckoffList()}
            >
              Set Spacegroup
            </Button>
          </Grid>
        </Grid>
        {this.state.loading ? <LinearProgress className={this.props.classes.loading} /> : null }
        {_.isEmpty(this.props.wyckoffList) ? null :
        <div>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <h2>Select Wyckoff Points</h2>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  this.setState({
                    open: true,
                    spacegroupInfoLoading: true,
                  });
                  setTimeout(() => {
                    this.setState({
                      spacegroupInfoLoading: false,
                    });
                  }, 2000);
                }}
                className={this.props.classes.menuLink}
              >
                About Spacegroup {this.props.spacegroup} [{_.get(hmSymbols, this.props.spacegroup - 1, '').replace(/ /g, '')}]
              </Button>
            </Grid>
          </Grid>

          {this.props.wyckoffList.map((point, i) => (
            <Tooltip
              key={`wyckoff_button_${i}`}
              title={point.if_repeatable === 1 ? `Repeatable point ${point.symbol} can be added multiple times` : `Point ${point.symbol} can only be added once`}
            >
              <span>
                <Button
                  fab
                  disabled={parseInt(point.if_repeatable, 10) === -1 && !!_.find(this.state.wyckoffPoints, (x) => x.symbol === point.symbol)}
                  color="primary"
                  value={point.symbol}
                  onClick={() => { this.selectWyckoffPoint(point); }}
                  className={this.props.classes.button}
                >
                  {point.symbol}{point.if_repeatable === 1 ? <MdAdd size={12} /> : null}
                </Button>
              </span>
            </Tooltip>
              ))}
        </div>
        }
        {_.isEmpty(this.props.wyckoffPoints) ? null :
        <div>
          <h2>Configure Wyckoff Points</h2>
          <Paper className={this.props.classes.paper} >
            {this.props.wyckoffPoints.map((point, i) => (
              <Chip
                avatar={<Avatar>{point.symbol}</Avatar>}
                key={`chip_${i}`}
                onKeyDown={((event) => {
                  if (event.nativeEvent.keyCode === 13) {
                    this.props.stepperHandleNext();
                  }
                })}
                label={
                  <div>
                    <ElementAutosuggest
                      setSubstate={(field, newValue) => { this.handleWyckoffPointChange(field, newValue); }}
                      key={`element_input_${i}`}
                      helperText={'Must be an element.'}
                      field={`${i}`}
                      initialValue={point.species}
                    />
                  </div>
                    }
                onDelete={(event) => { this.removeWyckoffPoint(event, i); }}
                className={this.props.classes.chip}
              />
                ))}
          </Paper>
        </div>
        }
        <Paper className={this.props.classes.paper} >
          <Grid container direction="row" justify="flex-end">
            <Grid item>
          Background information on space groups and Wyckoff positions:
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/List_of_space_groups" target="_blank">List of space groups (Wikipedia) <FaExternalLink /></a></li>
            <li><a href="http://www.cryst.ehu.es/cgi-bin/cryst/programs/nph-wp-list" target="_blank">Bilbao Crystallographic Server <FaExternalLink /></a></li>
          </ul>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

WyckoffInput.propTypes = {
  setName: PropTypes.func,
  wyckoffPoints: PropTypes.array,
  setPermutations: PropTypes.func,
  classes: PropTypes.object,
  setSpacegroup: PropTypes.func,
  wyckoffList: PropTypes.array,
  spacegroup: PropTypes.number,
  receiveWyckoffList: PropTypes.func,
  setWyckoffPoints: PropTypes.func,
  setCellParameters: PropTypes.func,
  receiveBulkStructure: PropTypes.func,
  stepperHandleNext: PropTypes.func,
};

const mapStateToProps = (state) => ({
  wyckoffPoints: state.get('bulkGeneratorReducer').wyckoffPoints,
});

const mapDispatchToProps = (dispatch) => ({
  receiveWyckoffList: (wyckoffList) => {
    dispatch(actions.receiveWyckoffList(wyckoffList));
  },
  setWyckoffPoints: (wyckoffPoints) => {
    dispatch(actions.setWyckoffPoints(wyckoffPoints));
  },
  setCellParameters: (cellParameters) => {
    dispatch(actions.setCellParameters(cellParameters));
  },
  setName: (name) => {
    dispatch(actions.setName(name));
  },
  setPermutations: (permutations) => {
    dispatch(actions.setPermutations(permutations));
  },
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(WyckoffInput);

