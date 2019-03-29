/*
 *
 * Upload
 *
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';
import { connect } from 'react-redux';
import FileDrop from 'react-file-drop';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Grid from 'material-ui/Grid';
import {
  MdRefresh,
  MdThumbUp,
  MdChevronRight,
  MdPublic,
  MdDelete,
  MdWarning,
} from 'react-icons/lib/md';
import Modal from 'material-ui/Modal';
import { CircularProgress } from 'material-ui/Progress';
import IFrame from 'react-iframe';
import ReactGA from 'react-ga';


import { createStructuredSelector } from 'reselect';
import axios from 'axios';

/* import { apiRoot, uploadGraphqlRoot } from 'utils/constants'; */
/* import { apiRoot } from 'utils/constants'; */
import * as snackbarActions from 'containers/AppSnackBar/actions';
import PublicationView from 'components/PublicationView';
import { prettyPrintReference } from 'utils/functions';
import { apiRoot } from 'utils/constants';

import { styles } from './styles';
import makeSelectUpload from './selectors';

/* const apiRoot = 'https://catappdatabase2-pr-63.herokuapp.com'; */
/* const apiRoot = 'http://localhost:5000'; */
const backendRoot = `${apiRoot}/apps/upload`;
const url = `${backendRoot}/upload_dataset/`;
const userInfoUrl = `${backendRoot}/user_info`;
const logoutUrl = `${backendRoot}/logout`;
const releaseUrl = `${backendRoot}/release`;
const endorseUrl = `${backendRoot}/endorse`;
const deleteUrl = `${backendRoot}/delete`;
/* const fileDropUrl = `${apiRoot}/apps/catKitDemo/convert_atoms`; */
const fileDropUrl = `${apiRoot}/apps/bulkEnumerator/get_wyckoff_from_structure`;

// TODO: COMMENT OUT IN PRODUCTION
/* const uploadGraphqlRoot = 'http://localhost:5000/apps/upload/graphql'; */
const uploadGraphqlRoot = `${apiRoot}/apps/upload/graphql`;

const showUploadForm = false;


export class Upload extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      uploadError: '',
      loginModalOpen: false,
      loginUrl: '',
      userInfo: {},
      datasets: [],
      pubId: '',
      showHelp: true,
      pubEntries: {},
      popoverAnchorElement: null,
      deleting: false,
      molecules: [],
      reactions: [{}],
    };

    this.logout = this.logout.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.getDatasets = this.getDatasets.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleSocialLogin = this.handleSocialLogin.bind(this);
    this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
    this.handleEndorse = this.handleEndorse.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.login = this.login.bind(this);
    this.removeMolecule = this.removeMolecule.bind(this);
    this.setDataset = this.setDataset.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.windowLogin = this.windowLogin.bind(this);

    this.moleculeInput = null;
    this.reactantInput = null;
    this.productInput = null;
  }

  componentDidMount() {
    if (_.get(this.props, 'location.query.login') === 'success') {
      this.fetchUserInfo();
      this.getDatasets();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (_.get(nextProps, 'location.query.login') === 'success') {
      this.fetchUserInfo();
      this.getDatasets();
    }
  }

  getDatasets() {
    const datasetQuery = `{publications { totalCount edges { node {
    title authors doi pubId journal volume pages year
  } } }}`;
    axios.default.withCredentials = true;
    axios.post(uploadGraphqlRoot, {}, {
      method: 'POST',
      data: {
        query: datasetQuery,
      },
      withCredentials: true,
    }).then((response) => {
      this.setState({
        datasets: response.data.data.publications.edges.map(
          (edge) => edge.node
        ),
      });
    });
    const pubEntryQuery = `{reactions(username:"~", distinct: true) {
  edges { node { pubId username } } }}`;
    axios({
      url: uploadGraphqlRoot,
      method: 'POST',
      data: {
        query: pubEntryQuery,
      },
      withCredentials: true,
    }).then((response) => {
      const pubEntries = _.groupBy(response.data.data.reactions.edges.map((x) => x.node),
        'pubId');

      this.setState({
        pubEntries,
      });
    });
  }

  setDataset(dataset) {
    this.setState({
      pubId: dataset.pubId,
    });
  }

  removeMolecule(i) {
    this.setState({
      molecules: this.state.molecules.filter((elem, x) => x !== i),
    });
  }

  handleDrop(field) {
    return (files, event) => {
      /* console.log(event.toElement.innerText) */
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('field', field);
      formData.append('event', JSON.stringify(event));
      axios.post(fileDropUrl, formData,
        {
          headers:
          {
            'content-type': 'multipart/form-data',
          },
        }).then((response) => {
        /* console.log(response) */
          this.setState({
            loading: false,
            molecules: _.concat(
              this.state.molecules,
              [response.data.cif]
            ),
          });
        });
    };
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

  handleEndorse(dataset) {
    ReactGA.event({
      category: 'Endorse',
      action: 'Endorse a Dataset',
      label: ` endorse ${dataset.pubId}`,
    });

    const correspondentQuery = `{reactions(first: 1, pubId: "${dataset.pubId}") {
  edges {
    node {
      id
      username
    }
  }
}}`;
    axios.post(uploadGraphqlRoot, {}, {
      method: 'POST',
      data: {
        query: correspondentQuery,
      },
      withCredentials: true,
    }).then((response) => {
      axios.post(endorseUrl, {
        dataset,
        userInfo: this.state.userInfo,
        corresponding_email: response.data.data.reactions.edges[0].node.username,
      }).then((messageResponse) => {
        this.props.openSnackbar(messageResponse.data.message);
      });
    });
  }

  handleRelease(dataset) {
    ReactGA.event({
      category: 'Upload',
      action: 'upload a dataset',
      label: ` uploaded ${dataset.pubId}`,
    });

    const correspondentQuery = `{reactions(first: 1, pubId: "${dataset.pubId}") {
  edges {
    node {
      id
      username
    }
  }
}}`;
    axios.post(uploadGraphqlRoot, {}, {
      method: 'POST',
      data: {
        query: correspondentQuery,
      },
      withCredentials: true,
    }).then((response) => {
      axios.post(releaseUrl, {
        dataset,
        userInfo: this.state.userInfo,
        corresponding_email: response.data.data.reactions.edges[0].node.username,
      }).then((messageResponse) => {
        this.props.openSnackbar(messageResponse.data.message);
      });
    });
  }

  handleDelete(dataset) {
    // TODO: Implement confirmation dialogue
    const correspondentQuery = `{reactions(first: 1, pubId: "${dataset.pubId}") {
  edges {
    node {
      id
      username
    }
  }
}}`;
    this.setState({
      deleting: true,
    });
    axios.post(uploadGraphqlRoot, {}, {
      method: 'POST',
      data: {
        query: correspondentQuery,
      },
      withCredentials: true,
    }).then((response) => {
      axios.post(deleteUrl, {
        dataset,
        userInfo: this.state.userInfo,
        corresponding_email: response.data.data.reactions.edges[0].node.username,
      }).then((messageResponse) => {
        this.props.openSnackbar(messageResponse.data.message);
        this.getDatasets();
        this.setState({
          deleting: false,
        });
      });
    });
  }


  handleSocialLogin() {
  }


  handleSocialLoginFailure() {
  }

  fetchUserInfo() {
    axios.get(userInfoUrl, {
      data: {},
      withCredentials: true,
    }).then((response) => {
      this.setState({
        userInfo: response.data,

      });
    });
  }


  login() {
    const uploadUrl = `${apiRoot}/apps/upload/submit`;
    axios.get(uploadUrl).then((response) => {
      this.setState({
        loginModalOpen: true,
        loginUrl: response.data.location,
      });
    });
  }

  logout() {
    axios(logoutUrl, {
      method: 'post',
      data: {},
      withCredentials: true,
    }).then(() => {
      this.setState({
        userInfo: {},
        datasets: [],
        pubId: '',
      });
    });
  }

  windowLogin(provider = 'slack') {
    const uploadUrl = `${apiRoot}/apps/upload/`;

    ReactGA.event({
      category: 'Login',
      action: 'User Login',
      label: ` login with ${provider}`,
    });

    axios(uploadUrl, {
      method: 'get',
      params: {
        provider,
      },
      mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'same-origin',
    }).then((response) => {
      window.open(response.data.location);
      window.focus();
      window.close();
    });
  }

  handleClose() {
    this.setState({
      loginModalOpen: false,
    });
  }

  handleFileDrop(files) {
    const formData = new FormData();
    formData.append('file', files[0]);
    axios.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((response) => response);
  }

  toggleHelp() {
    this.setState({
      showHelp: !this.state.showHelp,
    });
  }

  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.loginModalOpen}
          onClose={() => { this.handleClose(); }}
          style={{
            backgroundColor: 'white',
          }}
        >
          <IFrame
            url={this.state.loginUrl}
            width="95vw"
            height="95vh"
            position="relative"
            top="50px"
            display="initial"
          />
        </Modal>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <h2>
Upload Datasets
              {!_.isEmpty(this.state.userInfo)
                ? `\u00A0\u00A0(${this.state.userInfo.email})`

                : null}
            </h2>
          </Grid>
          <Grid item>
            {_.isEmpty(this.state.userInfo) ? null
              : (
                <img
                  src={this.state.userInfo.picture}
                  height="72"
                  width="72"
                  alt="Portrait"
                />
              )
            }
          </Grid>
        </Grid>

        <Paper className={this.props.classes.paper}>
          {!_.isEmpty(this.state.userInfo) ? null
            : (
              <Grid container direction="row" justify="flex-end">
                <Grid item>
                  <Button
                    raised
                    onClick={() => { this.toggleHelp(); }}
                  >
                    {this.state.showHelp ? 'Hide Help' : 'Show Help' }
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    raised
                    color="primary"
                    onClick={(event) => {
                      this.handlePopoverOpen(event);
                    }}
                  >
                      Login
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
                    <div
                      className={this.props.classes.loginPopover}
                    >
                      <Button
                        onClick={() => this.windowLogin('google')}
                      >
                        {' '}
Google
                        {' '}
                      </Button>
                      <Button
                        onClick={() => this.windowLogin('slack')}
                      >
                        {' '}
Slack
                        {' '}
                      </Button>
                    </div>
                  </Popover>
                </Grid>
              </Grid>
            )
          }
          {_.isEmpty(this.state.userInfo) ? null
            : (
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <Button
                    raised
                    onClick={() => { this.toggleHelp(); }}
                  >
                    {this.state.showHelp ? 'Hide Help' : 'Show Help' }
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => this.logout()}
                  >
                        Logout
                  </Button>
                </Grid>
              </Grid>
            )
          }
          {_.isEmpty(this.state.uploadError) ? null
            : <div className={this.props.classes.error}>{this.state.uploadError}</div>
          }
        </Paper>
        {!this.state.showHelp ? null
          : (
            <Paper className={this.props.classes.paper}>
              <div style={{ width: '62%', textAlign: 'justify', lineHeight: '24px' }}>
                <MdWarning />
                {' '}
                 Disclaimer: data submitted to the preview section can be seen by all registered users
                 of catalysis-hub.org.
                <h3>Why should I submit calculations of reaction energies?</h3>
                <ul>
                  <li>
                    Create an easy-to-use interactive supplementary information for your
                    {' '}
                    <a href="/publications">publication</a>
                    {' '}
                    with its own URL.
                  </li>
                  <li>
                    Get your own
                    {' '}
                    <a href="/profile">profile page</a>
                  </li>
                  <li>
                    Accelerate transfer of your theoretical insight to experimentalists in the field.</li>
                  <li>
                    Support
                    {' '}
                    <a href="/catLearn">ongoing machine-learning efforts</a>
                    in the community by providing first-principles based training data.
                  </li>
                  <li>
                    Get your dataset referenced in
                    {' '}
                    <a target="_blank" href="https://toolbox.google.com/datasetsearch/search?query=catalysis%20hub&docid=NNswoG6o3ztB5JwUAAAAAA%3D%3D">{'Google\'s Dataset Search'}</a>.
                  </li>
                </ul>
                <h3>How to submit with the CatHub terminal client</h3>
                <div>
                  Check
                  {' '}
                  <a target="_blank" href="http://docs.catalysis-hub.org/en/latest/tutorials/upload.html#suncat-group-members">docs.catalysis-hub.org</a>
                  {' '}
                  for a detailed guide on how to upload data. Below a short guide is provided. If you have problems, please contact Kirsten Winther ({'winther@stanford.edu'}) or use the
                  {' '}
                  <a href="https://gitter.im/catalysis-hub-org/Lobby#"> Chat room </a>
                  {' '}
                  for assistance.
                </div>
                <ol>
                  <li>
                    Install CatHub:
                    <pre style={{ margin: '8px' }}>pip install cathub --upgrade --user </pre>
                  </li>
                  <li>
                    For an overview of commands, run in your terminal:
                    <pre style={{ margin: '8px' }}>cathub --help </pre>
                    <pre style={{ margin: '8px' }}>cathub make_folders --help </pre>
                    <pre style={{ margin: '8px' }}>cathub organize --help </pre>
                  </li>
                  <li>
Organize your DFT output files into a folder tree. Choose one of two options:
                    <ul>
                      <li>
                        For automated organization of folders and files (adsorption energies only):
                        <pre style={{ margin: '8px' }}> cathub organize {'<foldername>'} -a {'<adsorbate1,adsorbate2>'} </pre>
                        <pre style={{ margin: '8px' }}> -c {'<dft-code>'} -x {'<xc-functional>'} -f {'<facet>'} </pre>
                      </li>
                      <li>
                        For more complicated reactions, create an empty folder tree and dump the files yourself:
                        <pre style={{ margin: '8px' }}> cathub make_folders {'<template>'}</pre>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Turn organized folder into a database file (SQLite3 format):
                    <pre>
                      cathub folder2db {'<organized folder>'}
                    </pre>
                  </li>
                  <li>
                    Upload the database file to the server:
                    <pre>cathub db2server {'<NameTitlewordYear>'}.db</pre>
                  </li>
                  <li>
                    Go to www.catalysis-hub.org/upload and login with the email you provided together with your files.
                  </li>
                  <li>
                    Click on {'"Fetch Data Sets"'} to see your uploaded dataset.
                  </li>
                  <li>
                    Check that the data looks right. Click on {'"Release"'}, and the dataset will be made available to the public as soon as possible.
                  </li>
                </ol>
              </div>
            </Paper>
          )
        }
        {!showUploadForm ? null
          : (
            <Paper className={this.props.classes.paper}>
              <h1>Manual Upload</h1>
              <TextField
                className={this.props.classes.textField}
                id="title"
                label="Title *"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Highly Efficient Catalyst from Non-Toxic Earth Abundant Materials for XY"
                fullWidth
                margin="normal"
              />
              <TextField
                className={this.props.classes.textField}
                id="authors"
                label="Authors *"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="A Einstein"
                fullWidth
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="Volume"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="8"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="Number"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="13"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="Pages"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="2140-2267"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="Year *"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="2018"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="Publisher"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Wiley"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="DOI"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="10.1002/cssc.201500322"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="DFT Code"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Quantum Espresso"
                margin="normal"
              />

              <TextField
                className={this.props.classes.textField}
                label="DFT Functional(s)"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="BEEF-vdW"
                margin="normal"
              />
              <h2>Gas Phase Molecules</h2>
              <div>
                <input
                  accept="text/*"
                  id="molecule-upload-button"
                  ref={(el) => { this.moleculeInput = el; }}
                  type="file"
                  className={this.props.classes.input}
                  multiple
                />
                <label
                  htmlFor="molecule-upload-button"
                >
                  <Button
                    raised
                    type="file"
                    className={this.props.classes.button}
                    component="span"
                  >
        + Molecule
                    {/* frame={this.moleculeInput} */}
                    <FileDrop
                      onDrop={this.handleDrop('molecule')}
                      dropEffect="copy"
                    >
          (Drop)
                    </FileDrop>
                  </Button>
                </label>
              </div>
              <div>
                <Grid container direction="row" justify="flex-start">
                  {this.state.molecules.map((molecule, i) => (
                    <Grid
                      item
                      key={`ml_${i}`}
                    >
                      <Grid container direction="column" justify="flex-start">
                        <Grid item>
                          <GeometryCanvasWithOptions
                            key={`mc_${i}`}
                            cifdata={molecule}
                            unique_id={`molecule_${i}`}
                            id={`molecule_${i}`}
                            height={400}
                            width={400}
                            showButtons={false}
                            x={1}
                            y={1}
                            z={2}
                          />
                        </Grid>
                        <Grid>
                          <Grid container direction="row" justify="flex-start">
                            <Grid item>
                              <Button
                                onClick={() => { this.removeMolecule(i); }}
                                raised
                              >
                                <MdDelete />
                                {' '}
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
              <h2>Reactions</h2>
              <Grid container direction="column" justify="flex-start">
                {this.state.reactions.map((reaction, i) => (
                  <Grid item key={`reaction_${i}`}>
                    <h3>
Reaction
                      {i + 1}
                    </h3>
                  </Grid>
                ))}
              </Grid>
              <div>
                <input
                  accept="text/*"
                  ref={(el) => { this.reactantInput = el; }}
                  id="reactants-upload-button"
                  type="file"
                  className={this.props.classes.input}
                  multiple
                />
                <label
                  htmlFor="reactants-upload-button"
                >
                  <Button
                    raised
                    component="span"
                    className={this.props.classes.button}
                  >
        + Reactant
                    {/* frame={this.reactantInput} */}
                    <FileDrop
                      onDrop={this.handleDrop('molecule')}
                      dropEffect="copy"
                    >
          (Drop)
                    </FileDrop>
                  </Button>
                </label>
                <input
                  accept="text/*"
                  id="products-upload-button"
                  type="file"
                  className={this.props.classes.input}
                  ref={(el) => { this.productInput = el; }}
                  multiple
                />
                <label
                  htmlFor="products-upload-button"
                >
                  <Button
                    raised
                    component="span"
                    className={this.props.classes.button}
                  >
        + Product
                    {/* frame={this.productInput} */}
                    <FileDrop
                      onDrop={this.handleDrop('molecule')}
                      dropEffect="copy"
                    >
          (Drop)
                    </FileDrop>
                  </Button>
                </label>
              </div>

            </Paper>
          )
        }

        {_.isEmpty(this.state.userInfo) ? null
          : (
            <Paper className={this.props.classes.paper}>
              <Grid container justify="space-between" direction="row">
                <Grid item>
                  <h1>Data Sets</h1>
                </Grid>
                <Grid item>
                  <Button
                    raised
                    color="primary"
                    onClick={() => { this.getDatasets(); }}
                  >
                    <MdRefresh />
                    {' '}
Fetch Data Sets
                  </Button>
                </Grid>
              </Grid>
              {_.isEmpty(this.state.datasets) ? null
                : this.state.datasets.map((dataset, i) => (
                  <Paper key={`ds_${i}`} className={this.props.classes.paper}>
                    {prettyPrintReference(dataset)}
                    {(this.state.userInfo.email !== _.get(this.state.pubEntries,
                      `${dataset.pubId}.0.username`, '') && _.get(this.state.pubEntries,
                      `${dataset.pubId}.0.username`, '') !== 'anonymous')
                      ? (
                        <div>
                          <Button
                            raised
                            onClick={() => {
                              this.handleEndorse(dataset);
                            }}
                          >
                                  Endorse
                            {' '}
                            {'\u00A0\u00A0'}
                            {' '}
                            <MdThumbUp />

                          </Button>
                          {' '}
                          {'\u00A0\u00A0'}
                        </div>
                      )
                      : (
                        <div>
                          <Button
                            raised
                            onClick={() => {
                              this.handleRelease(dataset);
                            }}
                          >
                                  Release
                            {' '}
                            {'\u00A0\u00A0'}
                            {' '}
                            <MdPublic />
                          </Button>
                          {'\u00A0\u00A0\u00A0'}
                          <div>
                            {JSON.stringify(this.state.userInfo)}
                          </div>
                          <div>
                            {_.get(this.state.pubEntries, `${dataset.pubId}.0.username`, '')}
                          </div>
                          <Button
                            raised
                            onClick={() => {
                              this.handleDelete(dataset);
                            }}
                          >
                                  Delete
                            {' '}
                            {'\u00A0\u00A0'}
                            {' '}
                            <MdDelete />
                            { this.state.deleting ? <CircularProgress size={16} /> : null }
                          </Button>
                          {'\u00A0\u00A0\u00A0'}
                          <Button
                            raised
                            onClick={() => { this.setDataset(dataset); }}
                          >
                            {' '}
Details
                            <MdChevronRight />
                          </Button>
                        </div>
                      )
                    }
                  </Paper>
                ))
              }
            </Paper>
          )
        }
        {_.isEmpty(this.state.pubId) ? null
          : (
            <Paper>
              <PublicationView
                preview
                pubId={this.state.pubId}
                graphqlRoot={uploadGraphqlRoot}
                privilegedAccess
              />
            </Paper>
          )
        }
      </div>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object,
  openSnackbar: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  Upload: makeSelectUpload(),
});

const mapDispatchToProps = (dispatch) => ({
  openSnackbar: (message) => {
    dispatch(snackbarActions.open(message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Upload));
