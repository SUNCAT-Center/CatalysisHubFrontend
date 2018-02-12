/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import { FaDatabase } from 'react-icons/lib/fa';
import { MdWarning } from 'react-icons/lib/md';
import View from 'flexbox-react';

import axios from 'axios';
import { graphQLRoot, whiteLabel, apps } from 'utils/constants';


import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import CenteredSection from './CenteredSection';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import Welcome from './Welcome';

const styles = () => ({
  textLink: {
    textDecoration: 'none',
  },

});

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  constructor(props) {
    super(props);
    this.state = {
      geometries: 0,
      reactions: 0,
      publications: 0,
      loading: true,
      error: false,
    };
  }

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    axios.post(graphQLRoot, {
      query: '{catapp (first: 0) { totalCount }}',
    }).then((response) => {
      if (response.data.data.catapp === null) {
        this.setState({
          loading: false,
          error: true,
        });
      } else {
        this.setState({
          loading: false,
          reactions: response.data.data.catapp.totalCount,
        });
      }
    });
    axios.post(graphQLRoot, {
      query: '{systems { edges { node { id } } }}',
    }).then((response) => {
      if (response.data.data.systems === null) {
        this.setState({
          loading: false,
          error: true,
        });
      } else {
        this.setState({
          loading: false,
          geometries: response.data.data.systems.edges.length,
        });
      }
    });
    axios.post(graphQLRoot, {
      query: '{catapp(publication:"~", distinct: true) {totalCount}}',
    }).then((response) => {
      if (response.data.data.catapp === null) {
        this.setState({
          loading: false,
          error: true,
        });
      } else {
        this.setState({
          loading: false,
          publications: response.data.data.catapp.totalCount,
        });
      }
    });
  }

  render() {
    return (
      <article>
        { whiteLabel === true ? null :
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: `Catalysis-Hub.org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
      As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.` },
            { name: 'robots', content: 'index,follow' },
            { name: 'keywords', content: 'heterogeneous catalysis,metals,density functional theory,scaling relations, activity maps,pourbaix diagrams,machine learning,quantum espresso,vasp,gpaw' },
            { name: 'DC.title', content: 'Catalysis-Hub.org' },
          ]}
        />
        }
        <div>
          <CenteredSection>
            {whiteLabel ? null :
            <H1>
              <FormattedMessage {...messages.startProjectHeader} />
            </H1>
            }
          </CenteredSection>
          <CenteredSection>
            {this.state.loading ? <div>Contacting database ... <LinearProgress color="primary" /></div> : null }
            {this.state.error ? <div><MdWarning />Failed to contact database. </div> : null }
          </CenteredSection>
          <Grid container justify="center">
            <Grid item>
              <Link to="/energies" className={this.props.classes.textLink}>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    maxWidth: 300,
                    textAlign: 'center',
                  }}
                >
                  <h3>Reaction Energetics</h3>
                  <View style={{ justifyContent: 'space-around' }}>
                    <Chip
                      label={this.state.reactions} avatar={
                        <Avatar>
                          <FaDatabase size={24} />
                        </Avatar>
                    }
                    />
                  </View>
                </Paper>
              </Link>
            </Grid>
            {/*
            <Grid item>
              <Link to="/generalSearch" className={this.props.classes.textLink}>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    maxWidth: 300,
                    textAlign: 'center',
                    align: 'center',
                  }}
                >
                  <h3>Geometries</h3>
                  <View style={{ justifyContent: 'center' }}>
                    <Chip label={this.state.geometries} avatar={<FaDatabase size={24} />} />
                  </View>
                </Paper>
              </Link>
            </Grid>
            */}
            <Grid item>
              <Link to="/publications" className={this.props.classes.textLink}>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    maxWidth: 300,
                    textAlign: 'center',
                    align: 'center',
                  }}
                >
                  <h3>Publications</h3>
                  <View style={{ justifyContent: 'center' }}>
                    <Chip
                      label={this.state.publications} avatar={
                        <Avatar>
                          <FaDatabase size={24} />
                        </Avatar>
                    }
                    />
                  </View>
                </Paper>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/appsIndex" className={this.props.classes.textLink}>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    maxWidth: 300,
                    textAlign: 'center',
                    align: 'center',
                  }}
                >
                  <h3>Apps</h3>
                  <View style={{ justifyContent: 'center' }}>
                    <Chip
                      label={apps.length} avatar={
                        <Avatar>
                          <FaDatabase size={24} />
                        </Avatar>
                    }
                    />
                  </View>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        </div>
        <Welcome />
      </article>
    );
  }
}

HomePage.propTypes = {
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  classes: React.PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(HomePage));
