import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/* import IconButton from 'material-ui/IconButton';*/

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { MdClear,
  MdEdit,
  MdClose,
  MdContentCopy,
  MdDelete,
  MdFileUpload,
  MdFileDownload } from 'react-icons/lib/md';
import {
  IoLogIn,
  IoLogOut,
} from 'react-icons/lib/io';
import { withStyles } from 'material-ui/styles';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';


import * as moment from 'moment/moment';

import axios from 'axios';
import { apiRoot } from 'utils/constants';
import { styles } from './styles';

const fireworksRoot = `${apiRoot}/apps/fireworks`;
const fireworksUrl = `${fireworksRoot}/schedule_workflows`;

const initialState = {
  loading: false,
  loggingIn: false,
  nerscLoggedIn: false,
  loginModalOpen: false,
  popoverAnchorElement: null,
  nersc_username: '',
  nersc_password: '',
  newt_sessionid: '',
};


class CalculationsView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.clearCalculations = this.clearCalculations.bind(this);
    this.removeCalculation = this.removeCalculation.bind(this);
    this.editCalculation = this.editCalculation.bind(this);
    this.downloadCalculations = this.downloadCalculations.bind(this);
    this.queueCalculations = this.queueCalculations.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.submitNersc = this.submitNersc.bind(this);
  }
  clearCalculations() {
    this.props.clearCalculations();
  }
  removeCalculation(n) {
    this.props.removeCalculation(n);
    if (this.props.openCalculation === n) {
      this.props.setOpenCalculation(-1);
    } else if (this.props.openCalculation > n) {
      this.props.setOpenCalculation(this.props.openCalculation - 1);
    }
  }

  copyCalculation(n) {
    this.props.copyCalculation(n);
    if (this.props.openCalculation > n) {
      this.props.setOpenCalculation(this.props.openCalculation + 1);
    }
  }

  editCalculation(n) {
    this.props.editCalculation(n);
    this.props.stepperHandleReset();
  }

  downloadCalculations() {
    this.setState({
      loading: true,
    });

    const date = moment().format('YYYYMMDD_HHmmss');
    const zip = new JSZip();
    const dir = zip.folder(`calc_${date}`);
    let adsDir;
    let bulkDir;
    let bulkStr;
    let cdir;
    let cellsize;
    let fixed;
    let format;
    let gasDir;
    let layers;
    let miller;
    let slabDir;
    let termination;
    let vacuum;

    dir.file('calculations.json', JSON.stringify(this.props.calculations, null, 4));
    dir.file('publication.txt', JSON.stringify({
      title: 'Test Title',
      authors: ['Doe'],
      journal: '',
      volume: '',
      number: '',
      pages: '',
      year: '2018',
      publisher: '',
      doi: '',
      tags: [],

    }));

    this.props.calculations.map((calculation) => {
      cdir = dir
               .folder(calculation.bulkParams.format)
               .folder('xcFunctional');

      format = calculation.bulkParams.format;
      gasDir = cdir.folder('gas');
      _.forOwn(_.get(calculation, 'adsorbateParams.molecules', {}),
        (value, key) => {
          gasDir.file(`${key}.${format}`, value);
        }
      );

      bulkStr = `${calculation.bulkParams.elements.join('')
        }_${calculation.bulkParams.wyckoff.name}`;

      bulkDir = cdir.folder(bulkStr);
      format = calculation.bulkParams.format;
      bulkDir.file(`bulk.${format}`, calculation.bulkParams.input);
      miller = `${calculation.slabParams.millerX}${calculation.slabParams.millerY}${calculation.slabParams.millerZ}`;
      vacuum = calculation.slabParams.vacuum;
      layers = calculation.slabParams.layers;
      fixed = calculation.slabParams.fixed;
      cellsize = calculation.slabParams.unitCellSize;
      termination = calculation.slabParams.termination;
      slabDir = bulkDir.folder(`${miller}_layers:${layers}_fixed:${fixed}_termination:${termination}_cellsize:${cellsize}_vacuum:${vacuum}`);
      slabDir.file(`empty_slab.${format}`, calculation.slabParams.input);
      return calculation.adsorbateParams.inputs.map((cif, i) => {
        adsDir = slabDir.folder(calculation.adsorbateParams.equations[i]);
        return adsDir.file(`${calculation.adsorbateParams.adsorbate}.${format}`, cif);
      });
    });

    zip.generateAsync({ type: 'blob' }).then((zipFile) => {
      saveAs(zipFile, `calculations_${date}.zip`);
    });
    this.setState({ loading: false });
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleLogin() {
    this.setState({
      loggingIn: true,
    });
    const formData = new FormData();
    formData.append('username', this.state.nersc_username);
    formData.append('password', this.state.nersc_password);
    axios({
      method: 'post',
      url: 'https://newt.nersc.gov/newt/auth',
      withCredentials: true,
      data: formData }).then((response) => {
        if (response.data.auth) {
          this.setState({
            nerscLoggedIn: true,
            loggingIn: false,
          });
          this.props.openSnackbar('Login successful.');
        } else {
          this.setState({
            nerscLoggedIn: false,
            loggingIn: false,
            popoverAnchorElement: null,
          });
          this.props.openSnackbar('Login failed.');
        }
      })
      .catch((error) => {
        this.props.openSnackbar(error);
        this.setState({
          nerscLoggedIn: false,
          loggingIn: false,
        });
      });
  }

  handleLogout() {
    this.setState({
      nerscLoggedIn: false,
      newt_sessionid: '',
    });
    axios({
      method: 'post',
      url: 'https://newt.nersc.gov/newt/logout',
      withCredentials: true,
    });
  }

  handlePopoverOpen(event) {
    this.setState({
      popoverAnchorElement: event.currentTarget,
    });
  }

  handlePopoverClose() {
    this.setState({
      popoverAnchorElement: null,
    });
  }


  queueCalculations() {
    const params = { params: {
      calculations: JSON.stringify(this.props.calculations),
    } };
    axios.get(fireworksUrl, params).then(() => {
    });
  }

  submitNersc() {
    const data = new FormData();
    const calculations = _.cloneDeep(this.props.calculations);
    calculations.map((calculation) => {
      delete calculation.adsorbateParams.cifs;  // eslint-disable-line no-param-reassign
      delete calculation.adsorbateParams.inputs;  // eslint-disable-line no-param-reassign
      delete calculation.bulkParams.cif;  // eslint-disable-line no-param-reassign
      delete calculation.bulkParams.input;  // eslint-disable-line no-param-reassign
      delete calculation.bulkParams.wyckoff.cif;  // eslint-disable-line no-param-reassign
      delete calculation.slabParams.cif;  // eslint-disable-line no-param-reassign
      delete calculation.slabParams.input;  // eslint-disable-line no-param-reassign
      return null;
    });

    const executable = `/usr/bin/python3 /project/projectdirs/m2997/catalysisHub/runner.py '${JSON.stringify(calculations)}' `;
    data.append('executable', executable);
    /* data.append('loginenv', true);*/
    axios({
      url: 'https://newt.nersc.gov/newt/command/cori',
      method: 'post',
      withCredentials: true,
      data,
    }).then((response) => {
      this.props.openSnackbar(`Successfully ran: "${response.data.output}".`);
    }).catch((response) => {
      this.props.openSnackbar(`Hit a bug "${response}".`);
    });
  }

  render() {
    return (
      <div>
        {this.props.calculations.length === 0 ? null :
        <Slide
          in
          mountOnEnter
          unmountOnExit
          direction="up"
        >
          <Paper className={this.props.classes.paper} height={8}>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <h4>Stored Calculations</h4>
              </Grid>
              <Grid item>
                {this.state.nerscLoggedIn ?
                  <Button
                    raised
                    onClick={(event) => {
                      this.handleLogout();
                      this.handlePopoverClose(event);
                    }}
                  ><IoLogOut />{'\u00A0'} Log out of NERSC</Button>
                    :
                  <div>
                    <Button
                      raised
                      onClick={(event) => {
                        this.handlePopoverOpen(event);
                      }}
                    >
                      <IoLogIn />{'\u00A0'} Log into NERSC
                </Button>
                    <Popover
                      open={Boolean(this.state.popoverAnchorElement)}
                      anchorEl={this.state.popoverAnchorElement}
                      onClose={this.handlePopoverClose}
                      origin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <div className={this.props.classes.loginForm}>
                        <form>
                          <Grid
                            container
                            direction="column"
                            justify="flex-start"
                          >
                            <Grid item>

                              <TextField
                                id="nersc_username"
                                label="NERSC Username"
                                value={this.state.nersc_username}
                                onChange={this.handleChange('nersc_username')}
                                onKeyDown={((event) => {
                                  if (event.nativeEvent.keyCode === 13) {
                                    this.handleLogin();
                                  }
                                })}
                                helperText="Just your username (not email)."
                              />
                            </Grid>
                            <Grid item>
                              <TextField
                                id="nersc_password"
                                type="password"
                                label="NERSC Password"
                                value={this.state.nersc_password}
                                onChange={this.handleChange('nersc_password')}
                                onKeyDown={((event) => {
                                  if (event.nativeEvent.keyCode === 13) {
                                    this.handleLogin();
                                  }
                                })}
                              />
                            </Grid>
                            <Grid>
                              <Button
                                raised
                                onClick={this.handleLogin}
                              >Login</Button>{'\u00A0\u00A0'}
                              {this.state.loggingIn ? <CircularProgress color="primary" /> : null}
                            </Grid>
                          </Grid>
                        </form>
                      </div>
                    </Popover>
                  </div>
                }
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">Prototype</TableCell>
                  <TableCell padding="none">Composition</TableCell>
                  <TableCell padding="none">Miller</TableCell>
                  <TableCell padding="none">Layers</TableCell>
                  <TableCell padding="none">Fixed</TableCell>
                  <TableCell padding="none">Termination</TableCell>
                  <TableCell padding="none">Supercell Size</TableCell>

                  <TableCell padding="none">Vacuum</TableCell>
                  <TableCell padding="none">Adsorbates</TableCell>
                  <TableCell padding="none">Input Format</TableCell>
                  <TableCell padding="none"></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.calculations.map((calculation, i) => (
                  <TableRow
                    key={`calculation_${i}`}
                    className={(this.props.openCalculation === i)
                          ? this.props.classes.highlightedRow
                          : this.props.classes.row}
                  >
                    <TableCell padding="none">{_.get(calculation, 'bulkParams.wyckoff.name', '???')}</TableCell>
                    <TableCell padding="none">{`
            [${calculation.bulkParams.elements.join(', ')}]
              `}</TableCell>
                    <TableCell padding="none">{
              `(
              ${calculation.slabParams.millerX},
              ${calculation.slabParams.millerY},
              ${calculation.slabParams.millerZ}
            )`
            }</TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.layers}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.fixed}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.termination}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.unitCellSize}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.vacuum}`} </TableCell>
                    <TableCell padding="none">{`${calculation.adsorbateParams.adsorbate}@${calculation.adsorbateParams.siteType} [${calculation.adsorbateParams.cifs.length} sites]`} </TableCell>
                    <TableCell padding="none">{`
            ${calculation.bulkParams.format}
            `}</TableCell>
                    <TableCell padding="none">
                      <Button
                        fab
                        mini
                        className={this.props.classes.actionIcon}
                      >
                        <MdEdit
                          onClick={() => { this.editCalculation(i); }}
                        />
                      </Button>
                      <Button
                        className={this.props.classes.actionIcon}
                        fab
                        mini
                      >
                        <MdContentCopy
                          onClick={() => { this.copyCalculation(i); }}
                        />
                      </Button>
                      <Button
                        fab
                        mini
                        className={this.props.classes.actionIcon}
                      >
                        <MdDelete
                          onClick={() => { this.removeCalculation(i); }}
                        />
                      </Button>
                      {(this.props.openCalculation === i) ?
                        <Button
                          fab mini
                          className={this.props.classes.actionIcon}
                        >
                          <MdClose
                            onClick={() => { this.props.setOpenCalculation(-1); }}
                          />
                        </Button>
                        : null}
                    </TableCell>
                  </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Grid container justify="flex-end" direction="row">
              <Grid item>
                <Button raised onClick={this.clearCalculations} color="inherit" className={this.props.classes.button}><MdClear /> {'\u00A0'}Clear</Button>
              </Grid>
              <Grid item>
                <Button
                  raised
                  onClick={this.downloadCalculations}
                  className={this.props.classes.button}
                  color="primary"
                ><MdFileDownload />{'\u00A0'} Download</Button>
              </Grid>
              {!this.state.nerscLoggedIn ? null :
              <Grid item>
                <Button
                  raised
                  color="primary"
                  onClick={() => this.submitNersc()}
                  className={this.props.classes.button}
                >
                  <MdFileUpload />{'\u00A0'} Submit to NERSC
                </Button>
              </Grid>
              }
              {/*
              <Grid item>
                <Button
                  raised
                  onClick={() => {this.queueCalculations()}}
                  color="primary"
                  className={this.props.classes.button}
                ><MdCloud />{'\u00A0'} Queue</Button>
              </Grid>
              */}
            </Grid>

          </Paper>
        </Slide>
        }
        {this.state.loading ? <LinearProgress className={this.props.classes.progress} /> : null }
      </div>
    );
  }
}

CalculationsView.propTypes = {
  calculations: PropTypes.array,
  clearCalculations: PropTypes.func,
  removeCalculation: PropTypes.func,
  copyCalculation: PropTypes.func,
  openCalculation: PropTypes.number,
  setOpenCalculation: PropTypes.func,
  editCalculation: PropTypes.func,
  stepperHandleReset: PropTypes.func,
  classes: PropTypes.object,
  openSnackbar: PropTypes.func,
};

module.exports = {
  CalculationsView: withStyles(styles, { withTheme: true })(CalculationsView),
};
