/*
 *
 * Upload
 *
 */

import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { MdFileUpload } from 'react-icons/lib/md';


import { createStructuredSelector } from 'reselect';
import FileDrop from 'react-file-drop';
import axios from 'axios';
import { flaskRoot } from 'utils/constants';

import makeSelectUpload from './selectors';

const backendRoot = `${flaskRoot}/apps/catKitDemo`;
const url = `${backendRoot}/upload_dataset/`;


const styles = () => ({
});

export class Upload extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      uploadError: '',
    };

    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  handleFileDrop(files) {
    const formData = new FormData();
    formData.append('file', files[0]);
    axios.post(url, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((response) => response);
  }

  render() {
    return (
      <div>
        <h2>Upload Datasets</h2>
        <Paper className={this.props.classes.fileDrop}>
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
