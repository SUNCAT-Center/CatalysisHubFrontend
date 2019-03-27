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
  MdViewList } from 'react-icons/lib/md';
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
              let references = yearResponse.data.data.publications.edges
                  .map((n) => (n.node));
              references = [...new Set(references)];
              const dois = yearResponse.data.data.publications.edges.map((n) => (n.node.doi));
              const titles = yearResponse.data.data.publications.edges.map((n) => (n.node.title));
              const pubIds = yearResponse.data.data.publications.edges.map((n) => (n.node.pubId));

              const allReferences = this.state.references;
              const allDois = this.state.dois;
              const allTitles = this.state.titles;
              const allPubIds = this.state.pubIds;

              allReferences[year] = references;
              allDois[year] = dois;
              allTitles[year] = titles;
              allPubIds[year] = pubIds;

              this.setState({
                references: allReferences,
                dois: allDois,
                titles: allTitles,
                pubIds: allPubIds,
              });
            })
            .catch(() => {
            });
        });
      });
  }
  backToList() {
    this.setState({
      pubId: '',
      systems: [],
      reactionEnergies: [],
    });
    this.props.router.push('/publications');
  }
  clickPublication(event, target, key, pubId, reference) {
    this.setState({
      systems: [],
      reactionEnergies: [],
      pubId,
      reference,
    });
    this.props.router.push(`/publications/${pubId}`);
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
    const previewCifs = this.state.previewCifs;
    const totalCounts = this.state.totalCounts;
    axios.post(newGraphQLRoot, { query: cifQuery })
      .then((response) => {
        totalCounts[pubId] = response.data.data.reactions.totalCount;
        previewCifs[pubId] = _.sortBy(
          response.data.data.reactions.edges[0].node.systems,
          'energy')[0];
        this.setState({
          previewCifs,
          totalCounts,
        });
      });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Publications and Datasets</title>
          <meta name="description" content="List of Publication and Datasets by year indexed on Catalysis-Hub.Org" />
          <meta name="keywords" content="catalysis, catalyst, chemistry, activation energy, adsorption, datasets, calculations, reaction energies, publications, csv, json, ASE atoms objects, ASE db, cathub, catkit, postgresql" />
        </Helmet>
        <Link
          className={this.props.classes.buttonLink}
          to={'/upload'}
        >
          <Button
            fab
            className={this.props.classes.fab}
            raised
            color="primary"
          >
            <TiDocumentAdd />

          </Button>
        </Link>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
        {!_.isEmpty(this.state.pubId) ? <div>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <Button
                onClick={() => {
                  this.backToList();
                }}
              >
                <MdChevronLeft />
                Back to Publication List</Button>
            </Grid>
            <Grid>
              <Grid container direction="row" className={this.props.classes.shareButtons}>
                <Grid item>
                  <EmailShareButton
                    subject={this.state.reference.title}
                    body={`${window.location.href} Reaction energies and structures for ${plainPrintReference(this.state.reference)}`}
                    url={window.location.href}
                  ><EmailIcon size={shareIconSize} round /></EmailShareButton>
                </Grid>
                <Grid item>
                  <LinkedinShareButton
                    title={this.state.reference.title}
                    description={`${plainPrintReference(this.state.reference)}`}
                    url={window.location.href}
                  >
                    <LinkedinIcon size={shareIconSize} round />
                  </LinkedinShareButton>
                </Grid>
                <Grid item>
                  <TwitterShareButton
                    url={window.location.href}
                    title={`Reaction energies and structures for ${plainPrintReference(this.state.reference)} `}
                    hashtags={[this.state.reference.pubId]}
                  > <TwitterIcon size={shareIconSize} round /> </TwitterShareButton>
                </Grid>
                <Grid item>
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`${window.location.href} Reaction energies and structures for ${plainPrintReference(this.state.reference)} `}
                  >
                    <FacebookIcon size={shareIconSize} round />
                  </FacebookShareButton>
                </Grid>
                <Grid item>
                  <WhatsappShareButton
                    url={window.location.href}
                    title={`Reaction energies and structures for ${plainPrintReference(this.state.reference)} `}

                  ><WhatsappIcon size={shareIconSize} round /></WhatsappShareButton>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
          <PublicationView pubId={this.state.pubId} />
        </div>
            : <div>

              <Grid
                container direction={isMobile ? 'column' : 'row'}
                justify="space-between"
              >
                <Grid item>
                  <h1>Publications and Datasets</h1>
                </Grid>
                <Grid item>
                  <Grid container direction="column" justify="flex-end">
                    <Grid item>

                      <Link
                        to={'/profile'}
                        className={this.props.classes.outboundLink}
                      >
                        <Button
                          raised
                          className={this.props.classes.publicationAction}
                        >
                      Contributors
                    </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Input
                    className={this.props.classes.filterInput}
                    value={this.state.publicationFilter}
                    onChange={this.handleChange('publicationFilter')}
                    endAdornment={<MdFilterList />}
                  />
                </Grid>
              </Grid>

              {this.state.references === {} ? <LinearProgress color="primary" /> : null }
              {this.state.years.map((year, i) => (
                <Slide
                  key={`slide_${i}`}
                  in
                  mountOnEnter
                  unmountOnExit
                  timeout={200 * i}
                  direction="left"
                  className={this.props.classes.yearPaper}
                >
                  <div>
                    <Paper key={`div_year_${i}`} className={[this.props.classes.paper, this.props.classes.yearPaper].join(' ')}>
                      {(this.state.references[year] || []).length === 0 ? null :
                      <h2 key={`pyear_${year}`} className={this.props.classes.publicationYear}>{year}</h2>
                      }
                      {(this.state.references[year] || []).map((reference, j) => {
                        const notFound = this.state.publicationFilter.trim().split(' ').map((term) => {
                          if ((reference.pubtextsearch || '').toLowerCase().indexOf(term.toLowerCase()) === -1) {
                            return false;
                          }
                          return true;
                        });
                        if (!notFound.every((x) => x)) {
                          return null;
                        }
                        if (this.state.titles[year][j] !== null) {
                          return (

                            <div key={`pli_${i}_${j}`} className={this.props.classes.publicationEntry}>
                              <Paper className={this.props.classes.smallPaper}>
                                <span className={this.props.classes.publicationEntry}>
                                  <IoDocument size={24} /> {prettyPrintReference(reference)} {`#${reference.pubId}.`}

                                </span>
                                <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" className={this.props.classes.publicationActions}>
                                  {year > 2014 ?
                                    <Grid item>
                                      {typeof this.state.previewCifs[reference.pubId] === 'undefined' ?
                                        <Button
                                          onClick={() => {
                                            this.loadPreviewCif(reference.pubId);
                                          }}
                                          className={this.props.classes.publicationAction}
                                          raised
                                        >
                                          Preview
                                        </Button>
                                          :
                                        <GeometryCanvasWithOptions
                                          key={`mc_${reference.pubId}`}
                                          cifdata={this.state.previewCifs[reference.pubId].Cifdata}
                                          unique_id={`molecule_${reference.pubId}`}
                                          id={`molecule_${reference.pubId}`}
                                          height={300}
                                          width={300}
                                          showButtons={false}
                                          x={1} y={1} z={2}
                                        />
                                      }
                                    </Grid>
                                     :
                                    <Grid item>
                                      <Button className={this.props.classes.publicationOffAction}>
                                        Geometries not available
                                      </Button>
                                    </Grid>
                                  }
                                  <Grid item>
                                    <Button
                                      raised
                                      onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`, this.state.pubIds[year][j], reference)} className={this.props.classes.publicationAction}
                                    >
                                      <MdViewList /> {'\u00A0\u00A0'}Checkout {
                                          (withCommas(this.state.totalCounts[reference.pubId] || ''))
                                      } Reactions {'\u00A0\u00A0'} <MdChevronRight />
                                    </Button>
                                    {(this.state.dois[year][j] === null
                                          || typeof this.state.dois[year][j] === 'undefined'
                                          || this.state.dois[year][j] === ''
                                        ) ? null :
                                        <ReactGA.OutboundLink
                                          eventLabel={`http://dx.doi.org/${this.state.dois[year][j]}`}
                                          to={`http://dx.doi.org/${this.state.dois[year][j]}`}
                                          target="_blank"
                                          className={this.props.classes.outboundLink}
                                        >
                                          <Button
                                            raised
                                            className={this.props.classes.publicationAction}
                                          >
                                            <FaExternalLink />{'\u00A0\u00A0'} DOI: {this.state.dois[year][j]}.
                                              </Button>
                                        </ReactGA.OutboundLink>
                                        }
                                  </Grid>
                                </Grid>

                                <div>
                                  { this.state.openedPublication !== `elem_${year}_${j}` ? null :
                                  <span>
                                    {this.state.loading === true ? <LinearProgress color="primary" /> : null}

                                    {/*
                        true || this.state.reactionEnergies.length === 0 ? null :
                        <PublicationReactions {...this.state} />
                        */}
                                    {this.state.systems.length === 0 ? null :
                                    <PublicationSystems {...this.state} />
                        }
                                  </span>
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
        }
      </div>
    );
  }
}

Publications.propTypes = {
  classes: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(Publications);
