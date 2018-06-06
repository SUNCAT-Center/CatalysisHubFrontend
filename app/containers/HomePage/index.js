/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { isMobile } from 'react-device-detect';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import { Link } from 'react-router';
import Img from 'containers/App/Img';
import Banner from 'components/Header/banner.png';
import { withStyles } from 'material-ui/styles';
import { FaDatabase, FaNewspaperO } from 'react-icons/lib/fa';
import {
  MdWarning,
  MdApps,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdArrowForward,
} from 'react-icons/lib/md';
import Slide from 'material-ui/transitions/Slide';

import axios from 'axios';
import { newGraphQLRoot, whiteLabel, apps } from 'utils/constants';


import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import { withCommas } from 'utils/functions';
import CenteredSection from './CenteredSection';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';

const styles = () => ({
  bold: {
    fontWeight: 'bold',
  },
  welcomeHeader: {
    marginTop: 0,
    marginBottom: '5%',
  },
  centeredSection: {
    marginLeft: '10%',
    marginRight: '10%',
  },
  truncated: {
    textAlign: 'left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxHeight: '100px',
  },
  expanded: {
    textAlign: 'justify',
  },
  textLink: {
    textDecoration: 'none',
    textColor: '#black',
  },
  banner: {
    marginTop: 50,
    width: '100%',
  },
  welcome: {
    textAlign: 'left',
  },
  homePaper: {
    backgroundColor: '#eeeeee',
    cornerRadius: 40,
    padding: 10,
    paddingTop: 5,
    marginRight: 15,
    minWidth: 280,
    maxWidth: 300,
    textAlign: 'left',
    align: 'left',
  },
  paperInfo: {
    minHeight: 30,
    marginBottom: 10,
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
      truncated: true,
    };
  }

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    axios.post(newGraphQLRoot, {
      query: '{reactions(first: 0) { totalCount edges { node { id } } }}' }).then((response) => {
        if (response.data.data.reactions === null) {
          this.setState({
            loading: false,
            error: true,
          });
        } else {
          this.setState({
            loading: false,
            reactions: response.data.data.reactions.totalCount,
          });
        }
      });
    axios.post(newGraphQLRoot, {
      query: '{publications(first: 0) { totalCount edges { node { id } } }}' }).then((response) => {
        if (response.data.data.reactions === null) {
          this.setState({
            loading: false,
            error: true,
          });
        } else {
          this.setState({
            loading: false,
            publications: response.data.data.publications.totalCount,
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
          <CenteredSection className={this.props.classes.centeredSection}>
            {whiteLabel ? null :
            <Grid
              container direction={isMobile ? 'column-reverse' : 'row'} justify="space-between"
              className={this.props.classes.welcomeHeader}
            >
              <Grid item xs={isMobile ? 12 : 6}>
                <H1 className={this.props.classes.welcome}>
                    Welcome to Catalysis-Hub.Org
                  </H1>
                <div className={this.state.truncated ? this.props.classes.truncated : this.props.classes.expanded}>
                  <div>
                      Catalysis-Hub.org is a frontend for browsing the SUNCAT CatApp database containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
                    </div>
                  <div>
                      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
                    </div>
                  <div>
                      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
                    </div>
                  <div>
                      As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.
                    </div>
                </div>
                {this.state.truncated ?
                  <Button
                    mini
                    onClick={() => {
                      this.setState({
                        truncated: false,
                      });
                    }}
                    role="button"
                  >Read More <MdKeyboardArrowDown /></Button>

                      :
                  <Button
                    mini
                    onClick={() => {
                      this.setState({
                        truncated: true,
                      });
                    }}
                    role="button"
                  >
                        Read Less <MdKeyboardArrowUp />
                  </Button>
                  }
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <Img className={this.props.classes.banner} src={Banner} alt="SUNCAT - Logo" />

              </Grid>
            </Grid>
            }
          </CenteredSection>
          <CenteredSection className={this.props.classes.centeredSection}>
            {this.state.loading ? <div>Contacting database ... <LinearProgress color="primary" /></div> : null }
            {this.state.error ? <div><MdWarning />Failed to contact database. </div> : null }
          </CenteredSection>
          <CenteredSection className={this.props.classes.centeredSection}>
            <Slide mountOnEnter unmountOnExit in direction="left">
              <div>
                <Grid container justify="flex-start">
                  <Grid item>
                    <Link to="/appsIndex" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                      >
                        <h3><MdApps size={20} /> Apps</h3>
                        <div className={this.props.classes.paperInfo}>
                          Web apps for exploring calculations
                          and finding new catalysts.
                        </div>

                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={apps.length} />
                          </Grid>
                          <Grid item>
                            <div className={this.props.classes.bold}>See our apps <MdArrowForward /></div>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>

                  <Grid item>
                    <Link to="/energies" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                        elevation={0}
                      >
                        <h3> <FaDatabase size={20} /> Reaction Energetics</h3>
                        <div className={this.props.classes.paperInfo}>
                          A database of first-principles reaction energetics.
                        </div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={withCommas(this.state.reactions)} />
                          </Grid>
                          <Grid item>
                            <div className={this.props.classes.bold}>See our reactions <MdArrowForward /></div>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>



                  <Grid item>
                    <Link to="/publications" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                        elevation={0}
                      >
                        <h3> <FaNewspaperO size={20} /> Publications</h3>
                        <div className={this.props.classes.paperInfo}>A collection of scientic publications with atomic geometries.</div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={this.state.publications} />
                          </Grid>
                          <Grid item className={this.props.classes.bold}>
                            See our publications <MdArrowForward />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>
                </Grid>
              </div>
            </Slide>
          </CenteredSection>
        </div>
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
