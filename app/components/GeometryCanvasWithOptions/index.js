/** ={this.state.in}
 *
 * GeometryCanvasWithOptions
 *
 */

import { compose } from 'recompose';
import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';
import ReactGA from 'react-ga';
import FileDownload from 'react-file-download';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { MdClose, MdFullscreen, MdFileDownload, MdBookmarkOutline } from 'react-icons/lib/md';

import axios from 'axios';
import { apiRoot } from 'utils/constants';
import GeometryCanvasCifdata from 'components/GeometryCanvasCifdata';

import * as actions from './actions';

const outputFormats = ['abinit', 'castep-cell', 'cfg', 'cif', 'dlp4', 'eon', 'espresso-in', 'extxyz', 'findsym',
  'gen', 'gromos', 'json', 'jsv', 'nwchem', 'proteindatabank', 'py', 'turbomole', 'v-sim', 'vasp', 'xsf', 'xyz'];


const styles = (theme) => ({
  avatar: {
    fontColor: '#000000',
    fontSize: 18,
    backgroundColor: '#ffffff',
    marginLeft: -14,
    marginRight: -14,
    marginTop: -5,
    textTranformation: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  fsIconButton: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    marginTop: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      height: 15,
      width: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      height: 10,
      width: 10,
    },
  },
  iconButton: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      height: 15,
      width: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      height: 10,
      width: 10,
    },
  },
  iconButtonIcon: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    marginTop: 7,
  },
});

const initialState = {
  open: false,
  height: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  width: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  color: '#fff',
  x: 2,
  y: 2,
  z: 1,
  borderWidth: 0,
  altLabels: {},
  perspective: true,
  tiltToRotate: true,
  in: false,
  downloadOpen: false,
};

class GeometryCanvasWithOptions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleDownloadOpen = this.handleDownloadOpen.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleDownloadClose = this.handleDownloadClose.bind(this);
  }

  componentWillMount() {
    this.setState({
      x: this.props.xRepeat,
      y: this.props.yRepeat,
      z: this.props.zRepeat,
      rotationMatrix: this.props.rotationMatrix,
    });
  }

  componentWillReceiveProps() {
    this.setState({ in: false });
    setTimeout(() => {
      this.setState({ in: true });
    }, 10);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleDownloadOpen() {
    this.setState({
      downloadOpen: true,
    });
  }

  handleDownloadClose() {
    this.setState({
      downloadOpen: false,
    });
  }

  handleDownload(format) {
    this.setState({
      downloadOpen: false,
    });
    const url = `${apiRoot}/apps/catKitDemo/convert_atoms/`;
    const params = { params: {
      format,
      cif: this.props.cifdata,
    } };
    axios.post(url, params, { headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' },
    }).then((response) => {
      FileDownload(response.data.image, !_.isEmpty(this.props.extraSlug) ? `${this.props.extraSlug}_${response.data.filename}` : response.data.filename);
      ReactGA.event({
        category: 'Download',
        action: 'Download',
        label: response.data.filename,
      });
    });
    this.props.cookies.set('preferredFormat', format);
  }

  handleChange(axis, diff) {
    return () => {
      if (axis === 'x') {
        this.props.setXRepeat(parseInt(this.state[axis], 10) + diff);
      } else if (axis === 'y') {
        this.props.setYRepeat(parseInt(this.state[axis], 10) + diff);
      } else if (axis === 'z') {
        this.props.setZRepeat(parseInt(this.state[axis], 10) + diff);
      }
      this.setState({
        [axis]: Math.max(1, this.state[axis] + diff),
      });
    };
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
            <Grid container justify="space-between" direction="row">
              <Grid item>
                <Grid container>
                  <Grid item>
                    <Grid container direction="row">
                      <Grid item>
                        <Tooltip title="Show fewer repetitions in x-directions">
                          <Button
                            onClick={this.handleChange('x', -1)}
                            disabled={this.state.x < 2}
                            mini fab className={this.props.classes.fsIconButton}
                          >-</Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <IconButton size="small" className={this.props.classes.fsIconButton}>x={this.state.x}</IconButton>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Show more repetition in x-direction">
                          <Button
                            onClick={this.handleChange('x', +1)}
                            disabled={this.state.x >= 20}
                            mini fab className={this.props.classes.fsIconButton}
                          >+</Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="row">
                      <Grid item>
                        <Tooltip title="Show fewer repetitions in y-direction">
                          <Button
                            onClick={this.handleChange('y', -1)}
                            disabled={this.state.y < 2}
                            mini fab className={this.props.classes.fsIconButton}
                          >-</Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <IconButton className={this.props.classes.fsIconButton}>y={this.state.y}</IconButton>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Show more repetitions in y-direction">
                          <Button
                            onClick={this.handleChange('y', +1)}
                            disabled={this.state.y >= 20}
                            mini fab className={this.props.classes.fsIconButton}
                          >+</Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="row">
                      <Grid item>
                        <Tooltip title="Show fewer repetitions in z-direction.">
                          <Button
                            onClick={this.handleChange('z', -1)}
                            disabled={this.state.z < 2}
                            mini fab className={this.props.classes.fsIconButton}
                          >-</Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <IconButton className={this.props.classes.fsIconButton} >z={this.state.z}</IconButton>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Show more repetitions in z-direction">
                          <Button
                            onClick={this.handleChange('z', +1)}
                            disabled={this.state.z >= 20}
                            mini fab className={this.props.classes.fsIconButton}
                          >+</Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <div>
                </div>
              </Grid>
              <Grid item>
                <Grid container direction="row" justify="flex-end">
                  <Grid item>
                    <Tooltip title="Exit fullscreen.">
                      <Button
                        mini
                        fab
                        onClick={() => { this.handleClose(); }}
                      >
                        <MdClose />
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <GeometryCanvasCifdata
              uniqueId={`fs_${this.props.uniqueId}`}
              cifdata={this.props.cifdata}
              id={`fs_${this.props.id}`}
              x={this.state.x}
              y={this.state.y}
              z={this.state.z}
              height={window.innerHeight}
              width={window.innerWidth}
              rotationMatrix={this.props.rotationMatrix}
              setRotationMatrix={this.props.setRotationMatrix}
              parent={this}
            />
          </div>
        </Modal>
        <GeometryCanvasCifdata
          uniqueId={this.props.uniqueId}
          cifdata={this.props.cifdata}
          id={this.props.id}
          x={this.state.x}
          y={this.state.y}
          z={this.state.z}
          setRotationMatrix={this.props.setRotationMatrix}
          parent={this}
        />
        <Grid
          container
          direction="row"
          justify="space-between"
        >
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <Tooltip title="Show fewer repetitions in x-directions">
                  <Button
                    onClick={this.handleChange('x', -1)}
                    disabled={this.state.x < 2}
                    mini fab className={this.props.classes.iconButton}
                  >-</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton size="small" className={this.props.classes.avatar}>x={this.state.x}</IconButton>
              </Grid>
              <Grid item>
                <Tooltip title="Show more repetition in x-direction">
                  <Button
                    onClick={this.handleChange('x', +1)}
                    disabled={this.state.x >= 20}
                    mini fab className={this.props.classes.iconButton}
                  >+</Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <Tooltip title="Show fewer repetitions in y-direction">
                  <Button
                    onClick={this.handleChange('y', -1)}
                    disabled={this.state.y < 2}
                    mini fab className={this.props.classes.iconButton}
                  >-</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton className={this.props.classes.avatar}>y={this.state.y}</IconButton>
              </Grid>
              <Grid item>
                <Tooltip title="Show more repetitions in y-direction">
                  <Button
                    onClick={this.handleChange('y', +1)}
                    disabled={this.state.y >= 20}
                    mini fab className={this.props.classes.iconButton}
                  >+</Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item>
                <Tooltip title="Show fewer repetitions in z-direction.">
                  <Button
                    onClick={this.handleChange('z', -1)}
                    disabled={this.state.z < 2}
                    mini fab className={this.props.classes.iconButton}
                  >-</Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <IconButton className={this.props.classes.avatar} >z={this.state.z}</IconButton>
              </Grid>
              <Grid item>
                <Tooltip title="Show more repetitions in z-direction">
                  <Button
                    onClick={this.handleChange('z', +1)}
                    disabled={this.state.z >= 20}
                    mini fab className={this.props.classes.iconButton}
                  >+</Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid>
            <Grid container direction="row">
              <Grid item>
                <Tooltip title="Show structure in full screen">
                  <Button
                    raised
                    mini
                    fab
                    className={this.props.classes.iconButtonIcon}
                    onClick={() => { this.setState({ open: true }); }}
                  ><MdFullscreen /></Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Download structure file.">
                  <Button
                    mini fab
                    className={this.props.classes.iconButtonIcon}
                    onClick={this.handleDownloadOpen}
                  ><MdFileDownload /> </Button>
                </Tooltip>
                <Dialog
                  open={this.state.downloadOpen}
                  onClose={this.handleDownloadClose}
                >
                  <DialogTitle>
                    Choose Format
                  </DialogTitle>
                  <List>
                    {typeof this.props.cookies.get('preferredFormat') === 'undefined' ? null :
                    <ListItem button onClick={() => this.handleDownload(this.props.cookies.get('preferredFormat'))}>
                      <ListItemText primary={this.props.cookies.get('preferredFormat')} /> <MdBookmarkOutline />
                    </ListItem>

                    }
                    {outputFormats.map((format, i) => (
                      <ListItem button key={`format_${i}`} onClick={() => this.handleDownload(format)}>
                        <ListItemText primary={format} />
                      </ListItem>
                    ))}
                  </List>
                </Dialog>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </div>
    );
  }
}

GeometryCanvasWithOptions.defaultProps = {
  extraSlug: '',
};

GeometryCanvasWithOptions.propTypes = {
  classes: PropTypes.object,
  uniqueId: PropTypes.string.isRequired,
  cifdata: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  extraSlug: PropTypes.string,
  cookies: instanceOf(Cookies).isRequired,
  xRepeat: PropTypes.number,
  yRepeat: PropTypes.number,
  zRepeat: PropTypes.number,
  rotationMatrix: PropTypes.array,

  setXRepeat: PropTypes.func,
  setYRepeat: PropTypes.func,
  setZRepeat: PropTypes.func,
  setRotationMatrix: PropTypes.func,
};

const mapStateToProps = (state) => ({
  xRepeat: state.get('geometryCanvasReducer').xRepeat,
  yRepeat: state.get('geometryCanvasReducer').yRepeat,
  zRepeat: state.get('geometryCanvasReducer').zRepeat,
  rotationMatrix: state.get('geometryCanvasReducer').rotationMatrix,
  canvas: state.get('geometryCanvasReducer').canvas,
});

const mapDispatchToProps = (dispatch) => ({
  setXRepeat: (x) => {
    dispatch(actions.setXRepeat(x));
  },
  setYRepeat: (x) => {
    dispatch(actions.setYRepeat(x));
  },
  setZRepeat: (x) => {
    dispatch(actions.setZRepeat(x));
  },
  setRotationMatrix: (x) => {
    dispatch(actions.setRotationMatrix(x));
  },
  saveCanvas: (x) => {
    dispatch(actions.saveCanvas(x));
  },
});


export default compose(
  withStyles(styles, { withTheme: true }),
  withCookies,
  connect(mapStateToProps, mapDispatchToProps)
)(GeometryCanvasWithOptions);
