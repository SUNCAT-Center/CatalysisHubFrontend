import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },

});

class ScalingRelationsInput extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <Paper className={this.props.classes.paper}>
        <div>Form Input coming soon.</div>
      </Paper>
    );
  }
}


ScalingRelationsInput.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(ScalingRelationsInput);
