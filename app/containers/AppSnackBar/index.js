/*
 *
 * AppSnackBar
 *
 */
import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';


import * as actions from './actions';

import { styles } from './styles';

const initialState = {
  isOpen: false,
};

export class AppSnackBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = _.merge(initialState, {
      isOpen: this.props.isOpen,
      message: this.props.message,
    });
  }


  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.props.isOpen}
          autoHideDuration={3000}
          onClose={this.props.close}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.props.message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={this.props.classes.close}
              onClick={this.props.close}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

AppSnackBar.propTypes = {
  classes: PropTypes.object,
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  close: PropTypes.func,
};


AppSnackBar.defaultProps = {
  message: '',
};

const mapStateToProps = (state) => ({
  message: state.get('appSnackBarReducer').message,
  isOpen: state.get('appSnackBarReducer').isOpen,
});

const mapDispatchToProps = (dispatch) => ({
  open: (message) => {
    dispatch(actions.open(message));
  },
  close: () => {
    dispatch(actions.close());
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppSnackBar));
