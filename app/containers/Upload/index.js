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
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import {
  MdRefresh,
  MdThumbUp,
  MdChevronRight,
  MdPublic,
  MdDelete,
} from 'react-icons/lib/md';
import Modal from 'material-ui/Modal';
import { CircularProgress } from 'material-ui/Progress';
import IFrame from 'react-iframe';
import ReactGA from 'react-ga';


import { createStructuredSelector } from 'reselect';
import axios from 'axios';

/* import { apiRoot, uploadGraphqlRoot } from 'utils/constants';*/
/* import { apiRoot } from 'utils/constants';*/
import * as snackbarActions from 'containers/AppSnackBar/actions';
import PublicationView from 'components/PublicationView';
import { prettyPrintReference } from 'utils/functions';
import { apiRoot } from 'utils/constants';

import { styles } from './styles';
import makeSelectUpload from './selectors';

/* const apiRoot = 'https://catappdatabase2-pr-63.herokuapp.com';*/
/* const apiRoot = 'http://localhost:5000';*/
const backendRoot = `${apiRoot}/apps/upload`;
const url = `${backendRoot}/upload_dataset/`;
const userInfoUrl = `${backendRoot}/user_info`;
const logoutUrl = `${backendRoot}/logout`;
const releaseUrl = `${backendRoot}/release`;
const endorseUrl = `${backendRoot}/endorse`;
const deleteUrl = `${backendRoot}/delete`;

// TODO: COMMENT OUT IN PRODUCTION
/* const uploadGraphqlRoot = 'http://localhost:5000/apps/upload/graphql';*/
const uploadGraphqlRoot = `${apiRoot}/apps/upload/graphql`;



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
    this.login = this.login.bind(this);
    this.setDataset = this.setDataset.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.windowLogin = this.windowLogin.bind(this);
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
          (edge) => edge.node),
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
      label: dataset.pubId,
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
    /* console.log("WINDOW LOGIN")*/
    /* console.log(uploadUrl)*/
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
      /* console.log(response)*/
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
        <h2>Upload Datasets
          {!_.isEmpty(this.state.userInfo) ?
              `\u00A0\u00A0(${this.state.userInfo.email})`

              : null}
        </h2>
        <h3>(beta)</h3>
        <Paper className={this.props.classes.paper}>
          {!_.isEmpty(this.state.userInfo) ? null :
          <Grid container direction="row" justify="flex-end">
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
              ><div
                className={this.props.classes.loginPopover}
              >
                <Button
                  onClick={() => this.windowLogin('slack')}
                > Slack </Button>
                <Button
                  onClick={() => this.windowLogin('google')}
                > Google </Button>
              </div>
              </Popover>
            </Grid>
          </Grid>
              }
          {_.isEmpty(this.state.userInfo) ? null :
          <Grid container direction="row" justify="flex-end">
            {/*
            <Grid item>
              <MdFileUpload />{'\u00A0\u00A0'}Drag directory as zip file or gzipped tar archive here.
              <FileDrop
                frame={document}
                onDrop={this.handleFileDrop}
                dropEffect="move"

              >
                <div

                      }}
                    >
                    </Popover>
            </Grid>
          </Grid>
              }
          {_.isEmpty(this.state.userInfo) ? null :
          <Grid container direction="row" justify="flex-end">
            {/*
            <Grid item>
              <MdFileUpload />{'\u00A0\u00A0'}Drag directory as zip file or gzipped tar archive here.
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
            </Grid>
            */}
            <Grid item>
              <Button
                onClick={() => this.logout()}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
              }
          {_.isEmpty(this.state.uploadError) ? null :
          <div className={this.props.classes.error}>{this.state.uploadError}</div>
              }
        </Paper>
        <Paper className={this.props.classes.paper}>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <h3>How to Submit Reactions from Terminal</h3>
            </Grid>
            <Grid item>
              <Button
                onClick={() => { this.toggleHelp(); }}
              >
                {this.state.showHelp ? 'Got it' : 'Show help' }
              </Button>

            </Grid>
          </Grid>
          {!this.state.showHelp ? null :
          <div>
            <div>
                      For SUNCAT Users: check <a target="_blank" href="http://docs.catalysis-hub.org/en/latest/tutorials/upload.html#suncat-group-members">docs.catalysis-hub.org</a> for info how to upload data.
                    </div>
            <div>
                      For general audience, follow the steps below in the near future.
                    </div>
            <ol>
              <li>Install catkit: <pre>pip install git+https://github.com/SUNCAT-Center/CatKit.git#egg=catkit</pre></li>
              <li>Organize converged calculations, run <pre>cathub organize {'<foldername>'}</pre></li>
              <li>Turn organized folder into sqlite database, run <pre>cathub folder2db --userhandle {this.state.userInfo.email} {'<foldername>'}.organized</pre></li>
              <li>Upload database, run <pre>cathub db2server {'<NameTitlewordYear>'}.db</pre></li>
              <li>Click on {'"Fetch Data Sets"'} to see your uploaded dataset.
                            </li>
            </ol>
          </div>
              }
        </Paper>
        {_.isEmpty(this.state.userInfo) ? null :
        <Paper className={this.props.classes.paper}>
          <Grid container justify="space-between" direction="row">
            <Grid item>
              <h1>Data sets</h1>
            </Grid>
            <Grid item>
              <Button
                raised
                color="primary"
                onClick={() => { this.getDatasets(); }}
              >
                <MdRefresh /> Fetch Data Sets
                  </Button>
            </Grid>
          </Grid>
          {_.isEmpty(this.state.datasets) ? null :
                  this.state.datasets.map((dataset, i) => (
                    <Paper key={`ds_${i}`} className={this.props.classes.paper}>
                      {prettyPrintReference(dataset)}
                      {(this.state.userInfo.email !== _.get(this.state.pubEntries,
                        `${dataset.pubId}.0.username`, '')) ?
                          <div>
                            <Button
                              raised
                              onClick={() => {
                                this.handleEndorse(dataset);
                              }}
                            >
                              Endorse {'\u00A0\u00A0'} <MdThumbUp />

                            </Button> {'\u00A0\u00A0'}
                          </div>
                          : <div>
                            <Button
                              raised
                              onClick={() => { this.setDataset(dataset); }}
                            > Details <MdChevronRight /> </Button> {'\u00A0\u00A0'}
                            <Button
                              raised
                              onClick={() => {
                                this.handleRelease(dataset);
                              }}
                            >
                              Release {'\u00A0\u00A0'} <MdPublic />
                            </Button> <Button
                              raised
                              onClick={() => {
                                this.handleDelete(dataset);
                              }}
                            >
                              Delete {'\u00A0\u00A0'} <MdDelete />
                              { this.state.deleting ? <CircularProgress size={16} /> : null }
                            </Button>
                          </div>
                      }
                    </Paper>
                  ))
              }
        </Paper>
        }
        {_.isEmpty(this.state.pubId) ? null :
        <Paper>
          <PublicationView
            preview
            pubId={this.state.pubId}
            graphqlRoot={uploadGraphqlRoot}
            privilegedAccess
          />
        </Paper>
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
