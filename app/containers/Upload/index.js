/*
 *
 * Upload
 *
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { MdFileUpload } from 'react-icons/lib/md';
import Modal from 'material-ui/Modal';
import IFrame from 'react-iframe';


import { createStructuredSelector } from 'reselect';
import FileDrop from 'react-file-drop';
import axios from 'axios';
import { apiRoot } from 'utils/constants';

import SocialButton from './SocialButton';
import makeSelectUpload from './selectors';

const backendRoot = `${apiRoot}/apps/upload`;
const url = `${backendRoot}/upload_dataset/`;
const userInfoUrl = `${backendRoot}/user_info`;


const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
  },
});

export class Upload extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      uploadError: '',
      loginModalOpen: false,
      loginUrl: '',
      userInfo: {},
    };

    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.handleSocialLogin = this.handleSocialLogin.bind(this);
    this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    this.login = this.login.bind(this);
    this.windowLogin = this.windowLogin.bind(this);
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
  handleSocialLogin() {
  }


  handleSocialLoginFailure() {
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

  windowLogin() {
    const uploadUrl = `${apiRoot}/apps/upload/submit`;
    axios.get(uploadUrl).then((response) => {
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

  render() {
    return (
      <div>
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
        <Paper className={this.props.classes.paper}>
          <SocialButton
            provider="github"
            appId="94895cb9f588ac74ab9d"
            onLoginSuccess={this.handleSocialLogin}
            onLoginFailure={this.handleSocialLoginFailure}
          >
            Login with GitHub
          </SocialButton>
          <Button
            onClick={() => {
              this.login();
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              this.windowLogin();
            }}
          >
            Login in new window
          </Button>
          <Button
            onClick={() => {
              this.fetchUserInfo();
            }}
          >
            Get user info
          </Button>
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
          {_.isEmpty(this.state.uploadError) ? null :
          <div className={this.props.classes.error}>{this.state.uploadError}</div>
          }
        </Paper>
        {_.get(this.state, 'userInfo.email', false)
            ?
              <Paper className={this.props.classes.paper}>
                <div>
                Hi {this.state.userInfo.email}, wanna upload some adsorption energies?
              </div>
              </Paper>

              : null
          }
        <Paper className={this.props.classes.paper}>
          <h3>Method 1: from the terminal.</h3>
          <ol>
            <li>Install catkit: pip install git+https://github.com/SUNCAT-Center/CatKit.git#egg=catkit</li>
            <li>Run catkit organize foldername</li>
            <li>Run catkit folder2db foldername.organized</li>
            <li>Run catkit db2server foldername.organize.db --userhandle {this.state.userInfo.email}</li>
          </ol>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h3>Method 2: using terminal + git (WIP).</h3>
          <ol>
            <li>Install catkit: pip install git+https://github.com/SUNCAT-Center/CatKit.git#egg=catkit</li>
            <li>Run catkit organize foldername</li>
            <li>Push your organized folder as one directory to e.g. github.</li>
            <li>Get a DOI for your repository: https://guides.github.com/activities/citable-code/</li>
            <li>Enter the respository URL below.</li>
          </ol>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h3>Method 3: drag and drop (WIP).</h3>
          <ol>
            <li>Go to your results folder using e.g. Finder on Mac, Nautilus on Linux, etc.</li>
            <li>Drag and drop your folder (up to 10 MB)<Button>HERE</Button>.</li>
          </ol>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h1>Data sets</h1>
        </Paper>
      </div>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  Upload: makeSelectUpload(),
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Upload));
