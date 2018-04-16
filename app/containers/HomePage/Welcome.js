
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = (theme) => ({
  welcomeText: {
    color: '#cccccc',
    textAlign: 'justified',
    textIndent: '30px',
    marginTop: '30px',
    [theme.breakpoints.down('lg')]: {
      visibility: 'hidden',
      display: 'none',
    },
  },
});

export class Welcome extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.welcomeText}>
        <h2>About</h2>
        <div>
 Catalysis-Hub.org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
        </div>
        <div>
      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
        </div>
        <div>
      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
      As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Welcome);
