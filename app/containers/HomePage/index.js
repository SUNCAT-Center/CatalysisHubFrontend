/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { isMobile } from 'react-device-detect';
import _ from 'lodash';
import ReactGA from 'react-ga';
import Helmet from 'react-helmet';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import Script from 'react-load-script';
import { Link } from 'react-router';
import Img from 'containers/App/Img';
import CathubBanner from 'components/Header/cathub_sky.png';
import { withStyles } from 'material-ui/styles';
import { FaDatabase, FaNewspaperO, FaExternalLink } from 'react-icons/lib/fa';
import {
  MdWarning,
  MdApps,
  MdKeyboardArrowUp,
  MdChevronRight,
  MdViewList,
  MdFace,
} from 'react-icons/lib/md';
import {
  IoDocument,
} from 'react-icons/lib/io';
import Slide from 'material-ui/transitions/Slide';

import axios from 'axios';
import { newGraphQLRoot, whiteLabel, apps } from 'utils/constants';


import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import { withCommas, prettyPrintReference } from 'utils/functions';
import CenteredSection from './CenteredSection';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import { styles } from './styles';



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
      contributors: 0,
      loading: true,
      error: false,
      truncated: true,
      randomReaction: {},
      randomSystems: [],
      image: 0,
      lastPublication: {},
      lastPublicationTime: '',
    };
  }

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    axios.post(newGraphQLRoot, { query: '{reactions(first: 0) { totalCount edges { node { id } } }}' }).then((response) => {
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
        const nRandom = parseInt(Math.random() * response.data.data.reactions.totalCount, 10);
        axios.post(newGraphQLRoot, {
          query: `{ reactions(first: ${nRandom}, last: 1) {
              totalCount
              edges {
                node {
                  Equation
                  chemicalComposition
                  reactionEnergy
                  systems {
                    energy
                    Cifdata
                  }
                  publication {
                    pubId
                  }
                }
              }
            }
          }
          `,
        }).then((innerResponse) => {
          const randomReaction = _.get(innerResponse, 'data.data.reactions.edges[0].node');
          const randomSystems = _.orderBy(randomReaction.systems, 'energy').slice(0, -1);
          this.setState({
            randomReaction,
            randomSystems,
          });

          setInterval(
            () => {
              this.setState({
                image: this.state.image + 1,
              });
            }, 2000
          );
        });
      }
    });
    axios.post(newGraphQLRoot, {
      query: `{publications(stime: 0, op: ">", order: "stime", last: 1) {
  totalCount
  edges {
    node {
      pubId
      Stime
      title
      authors
      journal
      pages
      volume
      year
      doi
    }
  }
}}`,
    }).then((lpidResponse) => {
      const lastPublicationTime = _.get(lpidResponse, 'data.data.publications.edges[0].node.Stime');
      const pubTimeArray = lastPublicationTime.split(' ');
      pubTimeArray.splice(3, 1, ',');
      this.setState({
        lastPublicationTime: pubTimeArray.join(' ').replace(' ,', ''),
        lastPublication: _.get(lpidResponse, 'data.data.publications.edges[0].node'),
        publications: _.get(lpidResponse, 'data.data.publications.totalCount'),
      });
    });
    axios.post(newGraphQLRoot, {
      query: '{publications (authors:"~", distinct: true) { edges { node { authors } } }}',
    }).then((response) => {
      const contributors = new Set();
      response.data.data.publications.edges
        .map((edge) => JSON.parse(edge.node.authors)
        .filter((x) => x !== 'others')
        .filter((x) => x !== 'catapp')
        .filter((x) => x !== 'Catapp')
        .map((author) => contributors.add(author)));
      this.setState({
        contributors: contributors.size,
      });
    });
  }

  render() {
    return (
      <article>
        { whiteLabel === true ? null
          : (
            <Helmet
              title="Home Page"
              meta={[
                {
                  name: 'description', content: `Catalysis-Hub.org is a frontend for browsing reaction energies containing thousands of first-principles calculations related to heterogeneous catalysis reactions on surface systems. Its goal is to allow comprehensive and user-friendly access to raw quantum chemical simulations guided by heterogeneous catalysis concepts and commonly used graphical representations such as scaling relations and activity maps. All reaction energies are derived from periodic plane-wave density functional theory calculations. An increasing number of calculations contain the corresponding optimized geometry as well as further calculational details such as exchange-correlation (XC) functional, basis set quality, and k-point sampling. Ultimately, the goal is to provide fully self-contained data for predicting experimental observations from electronic structure calculations and using software packages such as Quantum Espresso, GPAW, VASP, and FHI-aims. Input and output with other codes is supported through the Atomic Simulation Environment (ASE). It may also serve as a natural starting point for training and developing machine-learning based approaches accelerating quantum chemical simulations.
      Features include search for specific reaction energies, transition states, structures, exploration of scaling relations, activity maps, Pourbaix diagrams and machine learning models, as well as generation of novel bulk and surface structures. Calculations are linked to peer-review publications where available. The database can be queried via a GraphQL API that can also be accessed directly.
      All code pertaining to this project is hosted as open-source under a liberal MIT license on github to encourage derived work and collaboration. The frontend is developed using the React Javascript framework based on react boilerplate. New components (apps) can be quickly spun-off and added to the project. The backend is developed using the Flask Python framework providing the GraphQL API as well as further APIs for specific apps.
      As such Catalysis-Hub.org aims to serve as a starting point for trend studies and atomic based heterogeneous catalysis explorations.`,
                },
                { name: 'robots', content: 'index,follow' },
                { name: 'keywords', content: 'heterogeneous catalysis,metals,density functional theory,scaling relations, activity maps,pourbaix diagrams,machine learning,quantum espresso,vasp,gpaw' },
                { name: 'DC.title', content: 'Catalysis-Hub.org' },
              ]}
            />
          )
        }
        <div>
          <CenteredSection className={this.props.classes.centeredSection}>
            {whiteLabel ? null
              : (
                <Grid
                  container
                  direction={isMobile ? 'column-reverse' : 'row'}
                  justify="space-between"
                  className={this.props.classes.welcomeHeader}
                >
                  <Grid item xs={isMobile ? 12 : 6}>
                    <H1 className={this.props.classes.welcome}>
                    Welcome to Catalysis Hub
                    </H1>
                    <div className={this.state.truncated ? this.props.classes.truncated : this.props.classes.expanded}>
                      <div>
            A web-platform for sharing data and software for computational catalysis research! The Surface Reactions database contains thousands of reaction energies and barriers from density functional theory (DFT) calculations on surface systems. Reactions can also be browsed under Contributors and Publications, and under Apps is a selection of computational tools.
                      </div>
                    </div>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      className={this.props.classes.mainButtons}
                    >
                      <Grid item>
                        {this.state.truncated
                          ? (
                            <Link to="/about" className={this.props.classes.textLink}>
                              <Button
                                mini
                                raised
                                role="button"
                                className={this.props.classes.hoverButton}
                              >
Read More
                                <MdChevronRight />
                              </Button>
                            </Link>
                          )

                          : (
                            <Button
                              mini
                              onClick={() => {
                                this.setState({
                                  truncated: true,
                                });
                              }}
                              role="button"
                            >
                        Read Less
                              {' '}
                              <MdKeyboardArrowUp />
                            </Button>
                          )
                        }
                      </Grid>
                      <Grid item>
                        <Link
                          className={this.props.classes.buttonLink}
                          to="/upload"
                        >
                          <Button
                            className={this.props.classes.hoverButton}
                            raised
                            color="primary"
                          >
                      Upload Surface Reactions
                            {' '}
                            <MdChevronRight />

                          </Button>
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={isMobile ? 12 : 6}>
                    {_.isEmpty(this.state.randomSystems)
                      ? (
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          style={{
                            height: '280px',
                          }}
                        >
                          <Grid item>
                            <a href="https://suncat.stanford.edu" target="_blank">
                              <Img className={this.props.classes.banner} src={CathubBanner} alt="Catalysis-Hub.org - Logo" />
                            </a>
                          </Grid>
                        </Grid>
                      )
                      : (
                        <Grid
                          container
                          direction="row"
                          justify="flex-end"
                          style={{
                            height: '280px',
                          }}
                        >
                          <Grid item>
                            <GeometryCanvasWithOptions
                              key={`mc_${this.state.randomReaction.publication.pubId}`}
                              cifdata={this.state.randomSystems[this.state.image % this.state.randomSystems.length].Cifdata}
                              uniqueId={`molecule_${this.state.randomReaction.publication.pubId}`}
                              id={`molecule_${this.state.randomReaction.publication.pubId}`}
                              height={280}
                              width={280}
                              showButtons={false}
                              x={1}
                              y={1}
                              z={2}
                            />
                          </Grid>

                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="space-around"
                              style={{
                                height: '310px',
                              }}
                            >
                              <Grid item>
                                <Link to={`/publications/${this.state.randomReaction.publication.pubId}`}>
                                  <Button
                                    className={this.props.classes.hoverButton}
                                    fab
                                    color="primary"
                                    height="100%"
                                  >
                                    <MdChevronRight size={30} />
                                  </Button>
                                </Link>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )


                    }

                  </Grid>
                </Grid>
              )
            }
          </CenteredSection>
          <CenteredSection className={this.props.classes.centeredSection}>
            {this.state.loading ? (
              <div>
Contacting database ...
                <LinearProgress color="primary" />
              </div>
            ) : null }
            {this.state.error ? (
              <div>
                <MdWarning />
Failed to contact database.
                {' '}
              </div>
            ) : null }
          </CenteredSection>
          <CenteredSection className={this.props.classes.centeredSection}>
            <Slide mountOnEnter unmountOnExit in direction="left">
              <div>
                <Grid container justify="space-between" direction="row" className={this.props.classes.centerGrid}>


                  <Grid item>
                    <Link to="/energies" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                        elevation={0}
                      >
                        <h3>
                          {' '}
                          <FaDatabase size={20} />
                          {' '}
Surface Reactions
                        </h3>
                        <div className={this.props.classes.paperInfo}>
                          A database of reaction energies and barriers.
                        </div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={withCommas(this.state.reactions)} />
                          </Grid>
                          <Grid item className={this.props.classes.bolditalic}>
                            See reactions
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>



                  <Grid item>
                    <Link to="/profile" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                        elevation={0}
                      >
                        <h3>
                          {' '}
                          <MdFace size={20} />
                          {' '}
Contributors
                        </h3>
                        <div className={this.props.classes.paperInfo}>
                          The people (and co-authors) behind the datasets.
                        </div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={withCommas(this.state.contributors)} />
                          </Grid>
                          <Grid item className={this.props.classes.bold}>
                            See contributors
                            {' '}
                            <MdChevronRight />
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
                        <h3>
                          {' '}
                          <FaNewspaperO size={20} />
                          {' '}
Publications
                        </h3>
                        <div className={this.props.classes.paperInfo}>A collection of scientific publications with geometries.</div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={this.state.publications} />
                          </Grid>
                          <Grid item className={this.props.classes.bolditalic}>
                            See publications
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>


                  <Grid item>
                    <Link to="/appsIndex" className={this.props.classes.textLink}>
                      <Paper
                        className={this.props.classes.homePaper}
                      >
                        <h3>
                          <MdApps size={20} />
                          {' '}
Apps
                        </h3>
                        <div className={this.props.classes.paperInfo}>
                          Web apps for exploring calculations
                          and catalysts.
                        </div>

                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={apps.length} />
                          </Grid>
                          <Grid item className={this.props.classes.bolditalic}>
                            See our apps
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>


                </Grid>
                {_.isEmpty(this.state.lastPublication)
                  ? (
                    <LinearProgress
                      color="primary"
                      className={this.props.classes.spaced}
                    />
                  )
                  : (
                    <Paper className={this.props.classes.publicationPaper}>
                      <h3>
Latest Dataset: {`${this.state.lastPublicationTime}`}
.
                      </h3>
                      <span className={this.props.classes.publicationEntry}>
                        <IoDocument size={24} />
                        {' '}
                        {prettyPrintReference(this.state.lastPublication)}
                        {' '}
                        {`#${this.state.lastPublication.pubId}.`}

                      </span>
                      <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" className={this.props.classes.publicationActions}>
                        <Grid item>
                        </Grid>
                        <Grid item>

                          <Link
                            to={`/publications/${this.state.lastPublication.pubId}`}
                            className={this.props.classes.textLink}
                          >

                            <Button
                              raised
                              className={this.props.classes.publicationAction}
                            >
                              <MdViewList />
                              {' '}
                              {'\u00A0\u00A0'}
Checkout Reactions
                              {' '}
                              {'\u00A0\u00A0'}
                              {' '}
                              <MdChevronRight />
                            </Button>
                          </Link>
                          {(this.state.lastPublication.doi === null
                                          || typeof this.state.lastPublication.doi === 'undefined'
                                          || this.state.lastPublication.doi === ''
                          ) ? null
                            : (
                              <ReactGA.OutboundLink
                                eventLabel={`http://dx.doi.org/${this.state.lastPublication.doi}`}
                                to={`http://dx.doi.org/${this.state.lastPublication.doi}`}
                                target="_blank"
                                className={this.props.classes.textLink}
                              >
                                <Button
                                  raised
                                  className={this.props.classes.publicationAction}
                                >
                                  <FaExternalLink />
                                  {'\u00A0\u00A0'}
                                  {' '}
DOI:
                                  {' '}
                                  {this.state.lastPublication.doi}
.
                                </Button>
                              </ReactGA.OutboundLink>
                            )
                          }
                        </Grid>
                      </Grid>

                      <br />
                    </Paper>
                  )
                }
              </div>
            </Slide>
          </CenteredSection>
        </div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
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
