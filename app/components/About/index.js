/**
 *
 * About
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';


const styles = (theme) => ({
  paper: {
    marginBottom: 3 * theme.spacing.unit,
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
});


class About extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <h2>About Catalysis-Hub.Org</h2>
          <div>
Catalysis-Hub.Org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
          </div>
        </Paper>
        {/*
        <Paper className={this.props.classes.paper}>
          <h2>Database Statistics</h2>
        </Paper>
        */}
        <Paper className={this.props.classes.paper}>
          <h2>People</h2>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h2>Partners and Support</h2>
        </Paper>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object,

};


export default withStyles(styles, { withTheme: true })(About);
