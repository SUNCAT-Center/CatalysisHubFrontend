/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
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
    const { username, onSubmitForm } = this.props;
    const { image } = this.state;
    if (username && username.trim().length > 0) {
      onSubmitForm();
    }
    console.log(username);
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
                image: image + 1,
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
    const { classes } = this.props;
    const {
      centeredSection, welcomeHeader, welcome, truncatedSection, expanded,
      textLink, mainButtons, hoverButton, buttonLink, banner,
      centerGrid, homePaper, paperInfo, bolditalic, bold,
      spaced, publicationPaper, publicationEntry, publicationAction,
      publicationActions,
    } = classes;
    const {
      truncated, randomSystems, randomReaction, image, loading, error,
      reactions, contributors, publications, lastPublication,
      lastPublicationTime,
    } = this.state;
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
          <CenteredSection className={centeredSection}>
            {whiteLabel ? null
              : (
                <Grid
                  container
                  direction={isMobile ? 'column-reverse' : 'row'}
                  justify="space-between"
                  className={welcomeHeader}
                >
                  <Grid item xs={isMobile ? 12 : 6}>
                    <H1 className={welcome}>
                    Welcome to Catalysis Hub
                    </H1>
                    <div className={truncated ? truncatedSection : expanded}>
                      <div>
            A web-platform for sharing data and software for computational catalysis research! The Surface Reactions database contains thousands of reaction energies and barriers from density functional theory (DFT) calculations on surface systems. Reactions can also be browsed under Contributors and Publications, and under Apps is a selection of computational tools.
                      </div>
                    </div>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      className={mainButtons}
                    >
                      <Grid item>
                        {truncated
                          ? (
                            <Link to="/about" className={textLink}>
                              <Button
                                mini
                                raised
                                role="button"
                                className={hoverButton}
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
                          className={buttonLink}
                          to="/upload"
                        >
                          <Button
                            className={hoverButton}
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
                    {_.isEmpty(randomSystems)
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
                              <Img className={banner} src={CathubBanner} alt="Catalysis-Hub.org - Logo" />
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
                              key={`mc_${randomReaction.publication.pubId}`}
                              cifdata={randomSystems[image % randomSystems.length].Cifdata}
                              uniqueId={`molecule_${randomReaction.publication.pubId}`}
                              id={`molecule_${randomReaction.publication.pubId}`}
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
                                <Link to={`/publications/${randomReaction.publication.pubId}`}>
                                  <Button
                                    className={hoverButton}
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
          <CenteredSection className={centeredSection}>
            {loading ? (
              <div>
Contacting database ...
                <LinearProgress color="primary" />
              </div>
            ) : null }
            {error ? (
              <div>
                <MdWarning />
Failed to contact database.
                {' '}
              </div>
            ) : null }
          </CenteredSection>
          <CenteredSection className={centeredSection}>
            <Slide mountOnEnter unmountOnExit in direction="left">
              <div>
                <Grid container justify="space-between" direction="row" className={centerGrid}>


                  <Grid item>
                    <Link to="/energies" className={textLink}>
                      <Paper
                        className={homePaper}
                        elevation={0}
                      >
                        <h3>
                          {' '}
                          <FaDatabase size={20} />
                          {' '}
Surface Reactions
                        </h3>
                        <div className={paperInfo}>
                          A database of reaction energies and barriers.
                        </div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={withCommas(reactions)} />
                          </Grid>
                          <Grid item className={bolditalic}>
                            See reactions
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>



                  <Grid item>
                    <Link to="/profile" className={textLink}>
                      <Paper
                        className={homePaper}
                        elevation={0}
                      >
                        <h3>
                          {' '}
                          <MdFace size={20} />
                          {' '}
Contributors
                        </h3>
                        <div className={paperInfo}>
                          The people (and co-authors) behind the datasets.
                        </div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={withCommas(contributors)} />
                          </Grid>
                          <Grid item className={bold}>
                            See contributors
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>




                  <Grid item>
                    <Link to="/publications" className={textLink}>
                      <Paper
                        className={homePaper}
                        elevation={0}
                      >
                        <h3>
                          {' '}
                          <FaNewspaperO size={20} />
                          {' '}
Publications
                        </h3>
                        <div className={paperInfo}>A collection of scientific publications with geometries.</div>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={publications} />
                          </Grid>
                          <Grid item className={bolditalic}>
                            See publications
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>


                  <Grid item>
                    <Link to="/appsIndex" className={textLink}>
                      <Paper
                        className={homePaper}
                      >
                        <h3>
                          <MdApps size={20} />
                          {' '}
Apps
                        </h3>
                        <div className={paperInfo}>
                          Web apps for exploring calculations
                          and catalysts.
                        </div>

                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <Chip label={apps.length} />
                          </Grid>
                          <Grid item className={bolditalic}>
                            See our apps
                            {' '}
                            <MdChevronRight />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Link>
                  </Grid>


                </Grid>
                {_.isEmpty(lastPublication)
                  ? (
                    <LinearProgress
                      color="primary"
                      className={spaced}
                    />
                  )
                  : (
                    <Paper className={publicationPaper}>
                      <h3>
                        Latest Dataset:
                        {`${lastPublicationTime}`}
                        .
                      </h3>
                      <span className={publicationEntry}>
                        <IoDocument size={24} />
                        {' '}
                        {prettyPrintReference(lastPublication)}
                        {' '}
                        {`#${lastPublication.pubId}.`}

                      </span>
                      <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" className={publicationActions}>
                        <Grid item>
                        </Grid>
                        <Grid item>

                          <Link
                            to={`/publications/${lastPublication.pubId}`}
                            className={textLink}
                          >
                            <Button
                              raised
                              className={publicationAction}
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
                          {(lastPublication.doi === null
                                          || typeof lastPublication.doi === 'undefined'
                                          || lastPublication.doi === ''
                          ) ? null
                            : (
                              <ReactGA.OutboundLink
                                eventLabel={`http://dx.doi.org/${lastPublication.doi}`}
                                to={`http://dx.doi.org/${lastPublication.doi}`}
                                target="_blank"
                                className={textLink}
                              >
                                <Button
                                  raised
                                  className={publicationAction}
                                >
                                  <FaExternalLink />
                                  {'\u00A0\u00A0'}
                                  {' '}
DOI:
                                  {' '}
                                  {lastPublication.doi}
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
  onSubmitForm: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
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
