/**
 *
 * About
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import slacLogo from 'components/Header/SLAC_Logo.png';
import doeLogo from 'components/Header/DOE_Logo.gif';
import stanfordLogo from 'components/Header/stanford_crop.png';



const styles = (theme) => ({
  bannerStyle: {
    width: '240px',
    height: '150px',
  },
  peopleList: {
    display: 'flex',
    height: '150px',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  paper: {
    marginBottom: 3 * theme.spacing.unit,
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
});

const people = [
  'Ankit Jain',
  'Jake Boes',
  'Kirsten Winther',
  'Martin Hansen',
  'Max Hoffmann',
  'Meng Zhao',
  'Michal Bajdich',
  'Osman Mamun',
  'Paul Jennings',
  'Thomas Bligaard',
];


class About extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <h2>About Catalysis-Hub.Org</h2>
          <div>
Catalysis-Hub.Org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE).
          </div>
        </Paper>
        {/*
        <Paper className={this.props.classes.paper}>
          <h2>Database Statistics</h2>
        </Paper>
        */}
        <Paper className={this.props.classes.paper}>
          <h2>People</h2>
          <ul className={this.props.classes.peopleList}>
            {people.map((name, i) => (
              <li key={`person_${i}`}>
                {name}
              </li>
              ))}

          </ul>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h2>Partners and Support</h2>
          <Grid
            container
            direction="row"
            justify="space-between"
            style={{
              padding: '10%',
            }}
          >
            <Grid item lg={3} className={this.props.classes.bannerBox}>
              <img src={slacLogo} alt="SLAC Logo" style={{ width: '240px', height: 'auto', display: 'block', margin: '0 auto' }} />
            </Grid>
            <Grid item lg={3} className={this.props.classes.bannerBox}>
              <img src={stanfordLogo} alt="Stanford Logo" style={{ width: '300px', height: 'auto', display: 'block', margin: '0 auto' }} />
            </Grid>
            <Grid item lg={3} className={this.props.classes.bannerBox}>
              <img src={doeLogo} alt="Department of Energy Logo" style={{ width: '260px', height: 'auto', display: 'block', margin: '0 auto' }} />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object,

};


export default withStyles(styles, { withTheme: true })(About);
