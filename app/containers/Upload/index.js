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

const backendRoot = `${apiRoot}/apps/catKitDemo`;
const url = `${backendRoot}/upload_dataset/`;


const styles = () => ({
});

export class Upload extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      uploadError: '',
      loginModalOpen: false,
      loginUrl: '',
    };

    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleSocialLogin = this.handleSocialLogin.bind(this);
    this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
    this.login = this.login.bind(this);
    this.windowLogin = this.windowLogin.bind(this);
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
        <h2>Upload Datasets</h2>
        <Paper className={this.props.classes.fileDrop}>
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
