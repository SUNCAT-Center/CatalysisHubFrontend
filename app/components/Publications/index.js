/**
 *
 * Publications
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import Helmet from 'react-helmet';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import Input from 'material-ui/Input';
import { LinearProgress } from 'material-ui/Progress';
import {
  MdChevronRight,
  MdChevronLeft,
  MdFilterList,
  MdViewList,
} from 'react-icons/lib/md';
import {
  IoDocument,
} from 'react-icons/lib/io';
import {
  TiDocumentAdd,
} from 'react-icons/lib/ti';
import _ from 'lodash';
import ReactGA from 'react-ga';
import Script from 'react-load-script';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';
import { FaExternalLink } from 'react-icons/lib/fa';

import { withStyles } from 'material-ui/styles';
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';


import axios from 'axios';
import { newGraphQLRoot } from 'utils/constants';
import { prettyPrintReference, plainPrintReference, withCommas } from 'utils/functions';

import PublicationView from 'components/PublicationView';
import PublicationSystems from './publicationSystems';
// import PublicationReactions from './publicationReactions';

import { styles } from './styles';

const shareIconSize = 28;

class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      references: {},
      previewCifs: {},
      totalCounts: {},
      dois: {},
      titles: {},
      pubIds: {},
      loading: false,
      openedPublication: null,
      systems: [],
      reactionEnergies: [],
      publicationQuery: '',
      pubId: _.get(props, 'routeParams.pubId', ''),
      reference: {},
      publicationFilter: '',
    };
    this.clickPublication = this.clickPublication.bind(this);
    this.loadPreviewCif = this.loadPreviewCif.bind(this);
    this.backToList = this.backToList.bind(this);
  }

  componentDidMount() {
    const yearQuery = '{publications { edges { node { year } } }}';
    axios.post(newGraphQLRoot, {
      query: yearQuery,
    })
      .then((response) => {
        const {
          references, dois, titles, pubIds,
        } = this.state;
        let years = response.data.data.publications.edges.map((n) => n.node.year);
        years = [...new Set(years)].sort().reverse().filter((x) => x !== null);
        this.setState({
          years,
        });
        years.map((year) => {
          const query = `{publications (year: ${year}, order: "-stime") { edges { node {  doi title year authors journal volume number pages pubId pubtextsearch  } } }}`;
          return axios.post(newGraphQLRoot, {
            query,
          })
            .then((yearResponse) => {
              const { edges } = yearResponse.data.data.publications;
              let tempReferences = edges
                .map((n) => (n.node));
              tempReferences = [...new Set(tempReferences)];
              const tempDois = edges.map((n) => (n.node.doi));
              const tempTitles = edges.map((n) => (n.node.title));
              const tempPubIds = edges.map((n) => (n.node.pubId));

              references[year] = tempReferences;
              dois[year] = tempDois;
              titles[year] = tempTitles;
              pubIds[year] = tempPubIds;

              this.setState({
                references, dois, titles, pubIds,
              });
            })
            .catch(() => {
            });
        });
      });
  }

  backToList() {
    const { router } = this.props;
    this.setState({
      pubId: '',
      systems: [],
      reactionEnergies: [],
    });
    router.push('/publications');
  }

  clickPublication(event, target, key, pubId, reference) {
    const { router } = this.props;
    this.setState({
      systems: [],
      reactionEnergies: [],
      pubId,
      reference,
    });
    router.push(`/publications/${pubId}`);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  loadPreviewCif(pubId) {
    const cifQuery = `{reactions(pubId:"${pubId}", first: 1, order:"reactionEnergy") {
    totalCount
  edges {
    node {
      id
      reactionEnergy
      systems {
        energy
        Cifdata
      }
    }
  }
}}`;
    const { previewCifs, totalCounts } = this.state;
    axios.post(newGraphQLRoot, { query: cifQuery })
      .then((response) => {
        const { reactions } = response.data.data;
        totalCounts[pubId] = reactions.totalCount;
        previewCifs[pubId] = _.sortBy(
          reactions.edges[0].node.systems,
          'energy'
        )[0];
        this.setState({
          previewCifs,
          totalCounts,
        });
      });
  }

  render() {
    const { classes } = this.props;
    const {
      pubId, pubIds, reference, publicationFilter, years, titles, previewCifs,
      openedPublication, loading, systems, dois, references, totalCounts,
    } = this.state;
    return (
      <div>
        <Helmet>
          <title>Publications and Datasets</title>
          <meta name="description" content="List of Publication and Datasets by year indexed on Catalysis-Hub.Org" />
          <meta name="keywords" content="catalysis, catalyst, chemistry, activation energy, adsorption, datasets, calculations, reaction energies, publications, csv, json, ASE atoms objects, ASE db, cathub, catkit, postgresql" />
        </Helmet>
        <Link
          className={classes.buttonLink}
          to="/upload"
        >
          <Button
            fab
            className={classes.fab}
            raised
            color="primary"
          >
            <TiDocumentAdd />

          </Button>
        </Link>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
        {!_.isEmpty(pubId) ? (
          <div>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Button
                  onClick={() => {
                    this.backToList();
                  }}
                >
                  <MdChevronLeft />
                Back to Publication List
                </Button>
              </Grid>
              <Grid>
                <Grid container direction="row" className={classes.shareButtons}>
                  <Grid item>
                    <EmailShareButton
                      subject={reference.title}
                      body={`${window.location.href} Reaction energies and structures for ${plainPrintReference(reference)}`}
                      url={window.location.href}
                    >
                      <EmailIcon size={shareIconSize} round />
                    </EmailShareButton>
                  </Grid>
                  <Grid item>
                    <LinkedinShareButton
                      title={reference.title}
                      description={`${plainPrintReference(reference)}`}
                      url={window.location.href}
                    >
                      <LinkedinIcon size={shareIconSize} round />
                    </LinkedinShareButton>
                  </Grid>
                  <Grid item>
                    <TwitterShareButton
                      url={window.location.href}
                      title={`Reaction energies and structures for ${plainPrintReference(reference)} `}
                      hashtags={[reference.pubId]}
                    >
                      {' '}
                      <TwitterIcon size={shareIconSize} round />
                      {' '}

                    </TwitterShareButton>
                  </Grid>
                  <Grid item>
                    <FacebookShareButton
                      url={window.location.href}
                      quote={`${window.location.href} Reaction energies and structures for ${plainPrintReference(reference)} `}
                    >
                      <FacebookIcon size={shareIconSize} round />
                    </FacebookShareButton>
                  </Grid>
                  <Grid item>
                    <WhatsappShareButton
                      url={window.location.href}
                      title={`Reaction energies and structures for ${plainPrintReference(reference)} `}
                    >
                      <WhatsappIcon size={shareIconSize} round />
                    </WhatsappShareButton>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
            <PublicationView pubId={pubId} />
          </div>
        )
          : (
            <div>

              <Grid
                container
                direction={isMobile ? 'column' : 'row'}
                justify="space-between"
              >
                <Grid item>
                  <h1>Publications and Datasets</h1>
                </Grid>
                <Grid item>
                  <Grid container direction="column" justify="flex-end">
                    <Grid item>

                      <Link
                        to="/profile"
                        className={classes.outboundLink}
                      >
                        <Button
                          raised
                          className={classes.publicationAction}
                        >
                      Contributors
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Input
                    className={classes.filterInput}
                    value={publicationFilter}
                    onChange={this.handleChange('publicationFilter')}
                    endAdornment={<MdFilterList />}
                  />
                </Grid>
              </Grid>

              {references === {} ? <LinearProgress color="primary" /> : null }
              {years.map((year, i) => (
                <Slide
                  key={`slide_${year}`}
                  in
                  mountOnEnter
                  unmountOnExit
                  timeout={200 * i}
                  direction="left"
                  className={classes.yearPaper}
                >
                  <div>
                    <Paper key={`div_year_${year}`} className={[classes.paper, classes.yearPaper].join(' ')}>
                      {(references[year] || []).length === 0 ? null
                        : <h2 key={`pyear_${year}`} className={classes.publicationYear}>{year}</h2>
                      }
                      {(references[year] || []).map((referenceJ, j) => {
                        const notFound = publicationFilter.trim().split(' ').map((term) => {
                          if ((referenceJ.pubtextsearch || '').toLowerCase().indexOf(term.toLowerCase()) === -1) {
                            return false;
                          }
                          return true;
                        });
                        if (!notFound.every((x) => x)) {
                          return null;
                        }
                        if (titles[year][j] !== null) {
                          return (

                            <div key={`pli_${year}_${j}`} className={classes.publicationEntry}>
                              <Paper className={classes.smallPaper}>
                                <span className={classes.publicationEntry}>
                                  <IoDocument size={24} />
                                  {' '}
                                  {prettyPrintReference(referenceJ)}
                                  {' '}
                                  {`#${referenceJ.pubId}.`}

                                </span>
                                <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" className={classes.publicationActions}>
                                  {year > 2014
                                    ? (
                                      <Grid item>
                                        {typeof previewCifs[referenceJ.pubId] === 'undefined'
                                          ? (
                                            <Button
                                              onClick={() => {
                                                this.loadPreviewCif(referenceJ.pubId);
                                              }}
                                              className={classes.publicationAction}
                                              raised
                                            >
                                          Preview
                                            </Button>
                                          )
                                          : (
                                            <GeometryCanvasWithOptions
                                              key={`mc_${referenceJ.pubId}`}
                                              cifdata={previewCifs[referenceJ.pubId].Cifdata}
                                              unique_id={`molecule_${referenceJ.pubId}`}
                                              id={`molecule_${referenceJ.pubId}`}
                                              height={300}
                                              width={300}
                                              showButtons={false}
                                              x={1}
                                              y={1}
                                              z={2}
                                            />
                                          )
                                        }
                                      </Grid>
                                    )
                                    : (
                                      <Grid item>
                                        <Button className={classes.publicationOffAction}>
                                        Geometries not available
                                        </Button>
                                      </Grid>
                                    )
                                  }
                                  <Grid item>
                                    <Button
                                      raised
                                      onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`, pubIds[year][j], referenceJ)}
                                      className={classes.publicationAction}
                                    >
                                      <MdViewList />
                                      {' '}
                                      {'\u00A0\u00A0'}
Checkout
                                      {' '}
                                      {
                                        (withCommas(totalCounts[referenceJ.pubId] || ''))
                                      }
                                      {' '}
Reactions
                                      {' '}
                                      {'\u00A0\u00A0'}
                                      {' '}
                                      <MdChevronRight />
                                    </Button>
                                    {(dois[year][j] === null
                                          || typeof dois[year][j] === 'undefined'
                                          || dois[year][j] === ''
                                    ) ? null
                                      : (
                                        <ReactGA.OutboundLink
                                          eventLabel={`http://dx.doi.org/${dois[year][j]}`}
                                          to={`http://dx.doi.org/${dois[year][j]}`}
                                          target="_blank"
                                          className={classes.outboundLink}
                                        >
                                          <Button
                                            raised
                                            className={classes.publicationAction}
                                          >
                                            <FaExternalLink />
                                            {'\u00A0\u00A0'}
                                            {' '}
DOI:
                                            {' '}
                                            {dois[year][j]}
.
                                          </Button>
                                        </ReactGA.OutboundLink>
                                      )
                                    }
                                  </Grid>
                                </Grid>

                                <div>
                                  { openedPublication !== `elem_${year}_${j}` ? null
                                    : (
                                      <span>
                                        {loading === true ? <LinearProgress color="primary" /> : null}

                                        {systems.length === 0 ? null
                                          : <PublicationSystems {...this.state} />
                                        }
                                      </span>
                                    )
                                  }
                                </div>
                                <br />
                              </Paper>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </Paper>
                  </div>
                </Slide>
              ))
              }
            </div>
          )
        }
      </div>
    );
  }
}

Publications.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(Publications);
