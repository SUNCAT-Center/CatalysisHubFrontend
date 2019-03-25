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
import { people } from 'utils/constants';
import { styles } from './styles';
import ccLogoBig from './ccLogoBig.svg';

class About extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <h2>About Catalysis-Hub.org</h2>
          <div className={this.props.classes.paragraph}>
             Catalysis-Hub.org is a web-platform for sharing data and software for computational catalysis research. The Surface Reactions database (CatApp v2.0) contains thousands of reaction energies and barriers from density functional theory (DFT) calculations on surface systems.
          </div>
          <div className={this.props.classes.paragraph}>
                      Under Publications, reactions and surface geometries can also be browsed for each publication or dataset. With an increasing number of Apps, the platform allows comprehensive and user-friendly access to heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps.
                      An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
          </div>
          <div className={this.props.classes.paragraph}>
                      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
          </div>
          <div className={this.props.classes.paragraph}>
                      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
          </div>
          <div className={this.props.classes.paragraph}>
                      As such Catalysis-Hub aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.
          </div>
        </Paper>
        {/*
        <Paper className={this.props.classes.paper}>
          <h2>Database Statistics</h2>
        </Paper>
         */}

        <Paper className={this.props.classes.paper}>
          <h2>License</h2>
          <div className={this.props.classes.text}>
            Except where otherwise noted, content on Catalysis-Hub is licensed under a
            {' '}
            <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>
.
          </div>
          <img src={ccLogoBig} alt="ccLogoBig" />
        </Paper>

        <Paper className={this.props.classes.paper}>
          <h2>People and Contact</h2>
          <div>The platform is developed at the SUNCAT Center for Interface Science and Catalysis, SLAC National Accelerator Laboratory, Stanford University. Contact information for the primary people involved is provided below. For technical support please contact postdoc Kirsten Winther at winther@stanford.edu.</div>
          <ul className={this.props.classes.peopleList}>
            {Object.keys(people).map((name, i) => (
              <li key={`person_${i}`}>
                <a href={people[name][1]} target="_blank">
                  {name}
                </a>
                {'  '}
                {people[name][0]}
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
              padding: '4%',
            }}
          >
            <Grid item lg={4} className={this.props.classes.bannerBox}>
              <a href="https://www6.slac.stanford.edu/" target="_blank">
                <img
                  src={slacLogo}
                  alt="SLAC Logo"
                  style={{
                    width: '240px', height: 'auto', display: 'block', margin: '0 auto',
                  }}
                />
              </a>
            </Grid>
            <Grid item lg={4} className={this.props.classes.bannerBox}>
              <a href="https://www.stanford.edu/" target="_blank">
                <img
                  src={stanfordLogo}
                  alt="Stanford Logo"
                  style={{
                    width: '300px', height: 'auto', display: 'block', margin: '0 auto',
                  }}
                />
              </a>
            </Grid>
            <Grid item lg={4} className={this.props.classes.bannerBox}>
              <a href="https://www.energy.gov/" target="_blank">
                <img
                  src={doeLogo}
                  alt="Department of Energy Logo"
                  style={{
                    width: '260px', height: 'auto', display: 'block', margin: '0 auto',
                  }}
                />
              </a>
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
