/**
*
* Profile
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import Script from 'react-load-script';
import _ from 'lodash';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { isMobile } from 'react-device-detect';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import {
  IoDocument,
} from 'react-icons/lib/io';
import {
  MdChevronRight,
  MdFilterList,
  MdViewList } from 'react-icons/lib/md';
import {
  TiDocumentAdd,
} from 'react-icons/lib/ti';
import {
  FaExternalLink,
} from 'react-icons/lib/fa';
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

import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';

import axios from 'axios';
import { newGraphQLRoot } from 'utils/constants';
import {
  prettyPrintReference,
  toAuthorFormat,
  toTitleFormat,
  toSlugFormat,
  restoreSC,
  withCommas,
} from 'utils/functions';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';

import * as actions from './actions';
import { styles } from './styles';


const shareIconSize = 28;
class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      authorFilter: '',
      previewCifs: {},
      totalCounts: {},
      totalCount: -1,
      systems: [],
      reactionEnergies: [],
      loading: true,
      allAuthors: [],
    };
    this.loadPreviewCif = this.loadPreviewCif.bind(this);
  }
  componentDidMount() {
    this.reloadData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.routeParams.name !== this.props.routeParams.name) {
      this.reloadData();
    }
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  reloadData(authorName = '') {
    const allAuthorsQuery = `{publications(authors:"~", distinct: true) {
  edges {
    node {
      authors
    }
  }
}}`;


    axios.post(newGraphQLRoot, { query: allAuthorsQuery })
      .then((response) => {
        this.setState({
          loading: false,
          allAuthors:
          [...new Set(
            [].concat.apply([], response.data.data.publications.edges.map((edge) => (JSON.parse(edge.node.authors.replace(/'/g, '"') // eslint-disable-line prefer-spread
.replace('.', '')
.replace('\\\\o', 'o')
.replace('{\\o}', 'o')
.replace('\\o}', 'o')
.replace('\\o', 'o')
.replace('o', 'o')
.replace('{o}', 'o')
.replace('{"u}', 'u')
.replace('{"a}', 'a')
.replace('{\\x07e}', 'e')
.replace('{\\u0007e}', 'e')
.replace('{e}', 'e')
.replace('.', '')
.replace(/,(?! )/, ', ')
.replace(/ and$/gi, '')
.replace(/^and /gi, '')
            ))))
            .map((x) => {
              if (x.match(/,/g) !== null && x.match(/,/g).length > 1) {
                return x.split(',')[0];
              }
              return x;
            })
            .map((x) => x.replace('.', ''))
            .map((x) => x.replace('{\\o}', 'o'))
            .map((x) => x.replace('\\o}', 'o'))
            .map((x) => x.replace('\\o', 'o'))
            .map((x) => x.replace('{"u}', 'u'))
            .map((x) => x.replace('{"a}', 'a'))
            .map((x) => x.replace('{e}', 'e'))
            .map((x) => x.replace('.', ''))
            .map((x) => {
              if (x.indexOf(',') > -1) {
                return x;
              }
              return x.split(/\s+/).reverse().join(', ');
            })
            .map((x) => x.replace(/(<=,) ?[A-Z]$/, ''))
            .map((x) => x.replace(/, and$/, ''))
            .filter((x) => x !== 'others')
            .filter((x) => x !== 'catapp')
            .filter((x) => x !== 'Catapp')

          )].sort()
          ,
        });
      });

    if (authorName || this.props.routeParams.name) {
      let author = toAuthorFormat(authorName || this.props.routeParams.name);
      if (author === 'Norskov, Jens') {
        author = 'N{\\\\o}rskov, Jens K.';
      } else {
        author = `~${author}`;
      }


      const authorQuery = `{publications( authors:"${author}") {
    totalCount
    edges{
    node {
      pubId
      title
      authors
      year
      doi
      pages
      volume
      journal

  } } }}`;
      axios.post(newGraphQLRoot, { query: authorQuery })
      .then((response) => {
        this.setState({
          totalCount: response.data.data.publications.totalCount,
        });
        this.props.receiveReactions(response.data.data.publications.edges.map((edge) => edge.node));
      });
    } else {
      this.setState({
        totalCount: 0,
      });
    }
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
    if (this.state.totalCount === -1) {
      return (
        <h1>
          <LinearProgress color="primary" />
        </h1>
      );
    } else { // eslint-disable-line no-else-return
      return (
        <div>
          <Helmet>
            <title>{toTitleFormat(this.props.routeParams.name || 'Profiles')}</title>
            <meta name="description" content={`Datasets containing first-principles reaction energies and reaction structures by ${toTitleFormat(this.props.routeParams.name || 'many contributors')}`} />
            <meta name="keywords" content={`${toTitleFormat(this.props.routeParams.name || 'contributed')}, reaction energies, adsorbate structures, slab calculations, density functional theory, adsorption energies, reaction energies, high-symmetry sites`} />
          </Helmet>
          <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
          <Script url="/static/ChemDoodleWeb.js" />
          {(this.state.totalCount === 0) ?
            <div>
              {_.isEmpty(this.props.routeParams.name) ? null :
              <Paper className={this.props.classes.paper}>
                <h1>
                  Profile not found :-/
                </h1>
                <div>
                  But you can <Link to={'/upload'} >upload reaction geometries</Link> for {toTitleFormat(this.props.routeParams.name || '')} to create one :-).
                </div>
              </Paper>
              }
            </div>
              :
            <div>
              <h1>{restoreSC(toTitleFormat(this.props.routeParams.name))}</h1>
              <Paper className={this.props.classes.paper}>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <h2>Datasets</h2>
                  </Grid>
                  <Grid item>
                    <Grid container direction="row" className={this.props.classes.shareButtons}>
                      <Grid item>
                        <EmailShareButton
                          url={window.location.href}
                          subject={this.props.routeParams.name}
                          body={`${window.location.href} Datasets by ${this.props.routeParams.name}`}
                        ><EmailIcon size={shareIconSize} round /></EmailShareButton>
                      </Grid>
                      <Grid item>
                        <LinkedinShareButton
                          title={toTitleFormat(this.props.routeParams.name)}
                          description={`Datasets by ${toTitleFormat(this.props.routeParams.name)}`}
                          url={window.location.href}
                        >
                          <LinkedinIcon size={shareIconSize} round />
                        </LinkedinShareButton>
                      </Grid>
                      <Grid item>
                        <TwitterShareButton
                          url={window.location.href}
                          title={`Datasets by ${toTitleFormat(this.props.routeParams.name)}`}
                          hashtags={['catalysis-hub.org', toSlugFormat(this.props.routeParams.name)]}
                        > <TwitterIcon size={shareIconSize} round /> </TwitterShareButton>
                      </Grid>
                      <Grid item>
                        <FacebookShareButton
                          url={window.location.href}
                          quote={`${window.location.href} Datasets by ${this.props.routeParams.name}`}
                        >
                          <FacebookIcon size={shareIconSize} round />
                        </FacebookShareButton>
                      </Grid>
                      <Grid item>
                        <WhatsappShareButton
                          url={window.location.href}
                          title={`Datasets by ${toTitleFormat(this.props.routeParams.name)}`}
                        ><WhatsappIcon size={shareIconSize} round /></WhatsappShareButton>
                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>
                {this.props.reactions.map((reference, i) => (
                  <Paper
                    className={this.props.classes.smallPaper}
                    key={`sp_${i}`}
                  >
                    <IoDocument size={24} /> {prettyPrintReference(reference)} {`#${reference.pubId}.`}
                    <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between" className={this.props.classes.publicationActions}>
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
                                      uniqueId={`molecule_${reference.pubId}`}
                                      id={`molecule_${reference.pubId}`}
                                      height={300}
                                      width={300}
                                      showButtons={false}
                                      x={1} y={1} z={2}
                                    />
                                    }
                      </Grid>
                      <Grid item>
                        {_.isEmpty(reference.doi) ? null :
                        <ReactGA.OutboundLink
                          eventLabel={`http://dx.doi.org/${reference.doi}`}
                          to={`http://dx.doi.org/${reference.doi}`}
                          target="_blank"
                          className={this.props.classes.outboundLink}
                        >
                          <Button
                            raised
                            className={this.props.classes.publicationAction}
                          >
                            <FaExternalLink />{'\u00A0\u00A0'} DOI: {reference.doi}.
                      </Button>
                        </ReactGA.OutboundLink>
                }
                        <Link
                          className={this.props.classes.buttonLink}
                          to={`/publications/${reference.pubId}`}
                        >
                          <Button
                            raised
                            className={this.props.classes.publicationAction}
                          >
                            <MdViewList />
                            {'\u00A0\u00A0'}Checkout Reactions {'\u00A0\u00A0'} <MdChevronRight />
                          </Button>
                        </Link>
                      </Grid>
                    </Grid>
                  </Paper>
          )
        )}
              </Paper> </div>
          }
          <Paper className={this.props.classes.paper}>
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
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <h2>All Contributors ({withCommas(this.state.allAuthors.filter((x) => {
                  if (this.state.authorFilter === '') {
                    return true;
                  }
                  return x.match(new RegExp(this.state.authorFilter, 'ig'));
                }).length || '')})
                {this.state.loading ? <CircularProgress size={30} color="primary" /> : null}
                </h2>
              </Grid>
              <Grid item>
                <Input
                  className={this.props.classes.filterInput}
                  placeholder="Filter"
                  value={this.state.authorFilter}
                  onChange={this.handleChange('authorFilter')}
                  endAdornment={<MdFilterList />}
                />
              </Grid>
            </Grid>
            <ul className={this.props.classes.authorList}>
              {this.state.allAuthors
                .filter((x) => {
                  if (this.state.authorFilter === '') {
                    return true;
                  }
                  return x.match(new RegExp(this.state.authorFilter, 'ig'));
                })
                .map((author) => author.trim())
                .sort()
                .map((author, i) =>
                  /* console.log(`<url><loc>https://www.catalysis-hub.org/profile/${toSlugFormat(author)}</loc></url>`)*/
                   (
                     <Link
                       to={`/profile/${toSlugFormat(author)}`}
                       key={`li_${i}`}
                       onClick={() => {
                         this.reloadData(toSlugFormat(author));
                       }}
                     >
                       <li
                         className={this.props.classes.authorEntry}
                       >
                         {author}
                       </li>
                     </Link>
                  ))}
            </ul>
          </Paper>
        </div>
      );
    }
  }
}

Profile.propTypes = {
  routeParams: PropTypes.object,
  receiveReactions: PropTypes.func,
  classes: PropTypes.object,
  reactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  reactions: state.get('profileReducer').reactions,
  reactionSystems: state.get('profileReducer').reactionSystems,
  selectedReaction: state.get('profileReducer').selectedReaction,
  selectedAuthor: state.get('profileReducer').selectedAuthor,

});

const mapDispatchToProps = (dispatch) => ({
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  saveSystem: (system) => {
    dispatch(actions.saveSystem(system));
  },
  clearSystems: () => {
    dispatch(actions.clearSystems());
  },
  selectReaction: (reaction) => {
    dispatch(actions.selectReaction(reaction));
  },

});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
