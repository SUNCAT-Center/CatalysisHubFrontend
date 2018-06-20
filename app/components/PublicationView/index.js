/**
 *
 * PublicationView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { isMobile } from 'react-device-detect';
import _ from 'lodash';
import Grid from 'material-ui/Grid';

import { withStyles } from 'material-ui/styles';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';


import { MdChevronRight } from 'react-icons/lib/md';
import { FaExternalLink } from 'react-icons/lib/fa';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import GraphQlbutton from 'components/GraphQlbutton';

const styles = (theme) => ({
  reactionActions: {
    padding: theme.spacing.unit,
  },
  progress: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  publicationAction: {
    margin: theme.spacing.unit,
    height: 6,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
  },
  outboundLink: {
    textDecoration: 'none',
  },
  paper: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  reactionsDiv: {
    overflowY: 'scroll',
    height: '70vh',

  },
  structuresDiv: {
    overflowY: 'scroll',
    height: '70vh',
    paddingLeft: 30,
    paddingRight: 30,
  },
  reaction: {
  },
  headerDiv: {
    padding: theme.spacing.unit,
  },
  selectedReaction: {
    backgroundColor: '#cccccc',
  },
});

const initialState = {
  reactionQuery: '',
  publicationQuery: '',
  structureQuery: '',
  totalCount: 0,
  selectedReaction: -1,
  publication: {},
  reactions: [],
  reaction: {},
  structures: [],
  loadingPublication: true,
  loadingReactions: false,
  loadingStructures: false,
  endCursor: '',
  hasMoreReactions: true,
};
const restoreSC = (str) => {
  let res = str;
  if (str === null || typeof str === 'undefined') {
    return '';
  }
  if (typeof str === 'object') {
    res = str.join(' ');
  }
  return res
    .replace('{\\o}', 'ø')
    .replace('\\o', 'ø')
    .replace('{"A}', 'Ä')
    .replace('{"U}', 'Ü')
    .replace('{"O}', 'Ö')
    .replace('{"a}', 'ä')
    .replace('{"u}', 'ü')
    .replace('{"o}', 'ö')
    .replace('{\\ss}', 'ß')
    .replace('--', '–')
    .replace('Norskov', 'Nørskov')

    .replace('{', '')
    .replace('}', '');
};


const prettyPrintReference = (ref) =>
  // TODO Integrate with crossref.org api
  // if (false && typeof ref.doi === 'undefined' || ref.doi === '') {
  (<span>
    {(ref.title !== '' && ref.title !== null && typeof ref.title !== 'undefined') ? <h2>{`${restoreSC(ref.title)}`}</h2> : null }
    {(typeof ref.authors !== 'undefined' && ref.authors !== '' && ref.authors !== null) ? <span>{restoreSC(typeof ref.authors === 'string' ? JSON.parse(ref.authors).join('; ') : ref.authors.join('; '))}. </span> : null }
    {(ref.journal !== '' && typeof ref.journal !== 'undefined' && ref.journal !== null) ? <i>{ref.journal}, </i> : null }
    {(ref.volume !== '' && typeof ref.volume !== 'undefined' && ref.volume !== null) ? <span>{ref.volume} </span> : null}
    {(ref.year !== '' && typeof ref.year !== 'undefined' && ref.year !== null) ? <span>({ref.year}): </span> : null}
    {(ref.pages !== '' && typeof ref.pages !== 'undefined' && ref.pages !== null) ? <span>{ref.pages}. </span> : null}
  </span>);



class PublicationView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getStructures = this.getStructures.bind(this);
    this.getReactions = this.getReactions.bind(this);
    this.handleReactionsScroll = this.handleReactionsScroll.bind(this);
    this.sortReactions = this.sortReactions.bind(this);
  }

  componentDidMount() {
    const { pubId } = this.props;
    const publicationQuery = {
      ttl: 300,
      query: `{publications(pubId: "${pubId}") {
  edges {
    node {
      id
      pubId
      title
      authors
      pages
      volume
      journal
      doi
    }
  }
}}` };

    cachios.post(newGraphQLRoot, publicationQuery).then((response) => {
      this.setState({
        publicationQuery,
        publication: response.data.data.publications.edges[0].node,
        hasMoreReactions: true,
        loadingPublication: false,
      });
    });

    this.getReactions();
  }

  getReactions() {
    const { pubId } = this.props;
    this.setState({
      loadingReactions: true,
    });
    if (this.state.hasMoreReactions) {
      const reactionQuery = {
        ttl: 300,
        query: `query{reactions (pubId: "${pubId}", first: 100, after: "${this.state.endCursor}") {
    totalCount
     pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    }
    edges {
      node {
        Equation
        sites
        id
        pubId
        dftCode
        dftFunctional
        reactants
        products
        facet
        chemicalComposition
        facet
        reactionEnergy
        activationEnergy
        surfaceComposition
        chemicalComposition
        reactionSystems {
          name
          aseId
        }
      }
    }
  }}`,
      };
      cachios.post(newGraphQLRoot, reactionQuery).then((response) => {
        this.setState({
          reactionQuery,
          reactions: _.concat(this.state.reactions,
            response.data.data.reactions.edges.map((edge) => edge.node),
          ),
          endCursor: response.data.data.reactions.pageInfo.endCursor,
          totalCount: response.data.data.reactions.totalCount,
          hasMoreReactions: response.data.data.reactions.pageInfo.hasNextPage,
          loadingReactions: false,
          loadingMoreReactions: false,
        });
      });
    }
  }

  getStructures(reaction, i) {
    let structureQuery;
    this.setState({
      reaction,
      structures: [],
      selectedReaction: i,
      loadingStructures: true,
    });
    reaction.reactionSystems.map((system) => {
      structureQuery = {
        query: `query{systems(uniqueId: "${system.aseId}") {
  edges {
    node {
      Cifdata
      volume
      mass
      Facet
      Formula
      energy
      uniqueId
    }
  }
}}`,
        ttl: 300,
      };
      return cachios.post(newGraphQLRoot, structureQuery).then((response) => {
        this.setState({
          structureQuery,
          loadingStructures: false,
          structures: _.orderBy(_.concat(this.state.structures,
            response.data.data.systems.edges[0].node,
          ), 'energy'),
        });
      });
    });
  }

  handleReactionsScroll(e) {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.state.hasMoreReactions) {
      this.setState({
        loadingMoreReactions: true,
        hasMoreReactions: false,
      });
      this.getReactions();
    }
  }

  sortReactions(field) {
    this.setState({
      reactions: _.orderBy(this.state.reactions, field),
    });
  }

  render() {
    const { publication, reactions, structures } = this.state;
    return (
      <div>
        {this.state.loadingPublication ? <LinearProgress className={this.props.classes.progress} /> : null }

        {_.isEmpty(publication) ? null :
        <Paper className={this.props.classes.paper}>
          {prettyPrintReference(publication)}
          {_.isEmpty(this.state.publicationQuery) ? null : <GraphQlbutton query={this.state.publicationQuery.query} newSchema />}
          {_.isEmpty(publication.doi) ? null :
          <ReactGA.OutboundLink
            eventLabel={`http://dx.doi.org/${publication.doi}`}
            to={`http://dx.doi.org/${publication.doi}`}
            target="_blank"
            className={this.props.classes.outboundLink}
          >
            <Button className={this.props.classes.publicationAction}>
              <FaExternalLink />{'\u00A0\u00A0'} DOI: {publication.doi}.
                    </Button>
          </ReactGA.OutboundLink>
              }
        </Paper>
        }
        {_.isEmpty(reactions) ? null :
        <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between">
          <Grid item md={6} sm={12}>
            {(this.state.loadingReactions && !this.state.loadingMoreReactions) ? <LinearProgress className={this.props.classes.progress} /> : null }
            <Paper
              className={this.props.classes.reactionsDiv}
              onScroll={this.handleReactionsScroll}
            >
              <Grid container className={this.props.classes.headerDiv} direction="row" justify="center">
                <Grid item>
                  <h3>
                    {this.state.totalCount} reactions.
                      </h3>
                </Grid>
              </Grid>
              <div className={this.props.classes.reactionActions}>
                {_.isEmpty(this.state.reactionQuery) ? null :
                <div>
                  <GraphQlbutton
                    query={this.state.reactionQuery.query}
                    newSchema
                    className={this.props.classes.publicationAction}
                  />
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.sortReactions('reactionEnergy');
                    }}
                  >
                          Sort by Energy
                        </Button>
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.sortReactions('dftFunctional');
                    }}
                  >
                          Sort by Functional
                        </Button>
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.sortReactions('chemicalComposition');
                    }}
                  >
                          Sort by Composition
                        </Button>
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.sortReactions('facet');
                    }}
                  >
                          Sort by Facet
                        </Button>
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.sortReactions('Equation');
                    }}
                  >
                          Sort by Equation
                        </Button>
                </div>
                    }
              </div>
              <ul>
                {reactions.map((reaction, i) => (<li
                  key={`reaction_${i}`}
                  className={(this.state.selectedReaction === i ? this.props.classes.selectedReaction : this.props.classes.reaction)}
                >({i + 1}/{this.state.totalCount}) Composition: {reaction.chemicalComposition}, Facet {reaction.facet}, Sites {reaction.sites}
                  <Button
                    onClick={() => this.getStructures(reaction, i)}
                    className={this.props.classes.publicationAction}
                  > Structures <MdChevronRight />
                  </Button>
                  <ul>
                    <li>Formula: {reaction.Equation}</li>
                    <li>Reaction Energy: {reaction.reactionEnergy.toFixed(2)} eV</li>
                    <li>DFT Code: {reaction.dftCode} DFT Functional: {reaction.dftFunctional}</li>
                  </ul>
                </li>))}
              </ul>

              {this.state.loadingMoreReactions ?
                <CircularProgress />
                      : null}
            </Paper>
          </Grid>
          {this.state.structures.length === 0 ? null :
          <Grid item md={6} sm={12}>
            {this.state.loadingStructures ? <LinearProgress className={this.props.classes.progress} /> : null }
            <Paper className={this.props.classes.structuresDiv}>
              <Grid container justify="flex-start" direction="row">
                {this.state.structures.map((image, i) => (
                  <Grid item key={`item_${i}`}>
                    <h2>{structures[i].Formula}: {structures[i].energy} eV</h2>
                    <Grid container direction="row" justify="flex-start">
                      <Grid item>
                        <GeometryCanvasWithOptions
                          cifdata={structures[i].Cifdata}
                          uniqueId={`slab_preview_${i}`}
                          key={`slab_preview_${i}`}
                          id={`slab_preview_${i}`}
                          x={1} y={1} z={1}
                        />

                        {_.isEmpty(this.state.structureQuery) ? null :
                        <Grid container className={this.props.classes.headerDiv} direction="row" justify="justify-left">
                          <Grid item>
                            <GraphQlbutton
                              query={`query{systems(uniqueId: "${structures[i].uniqueId}") {
  edges {
    node {
      DftCode
      DftFunctional
      Facet
      Formula
      InputFile(format:"cif")
      Pbc
      cell
      energy
      keyValuePairs
      magmom
      magmoms
      mass
      natoms
      numbers
      positions
      tags
      uniqueId
      volume
    }
  }
}}`}
                              newSchema
                            />
                          </Grid>
                        </Grid>
                                  }



                      </Grid>
                    </Grid>
                  </Grid>
                            ))}
              </Grid>

            </Paper>
          </Grid>
                  }
        </Grid>
        }
      </div>
    );
  }
}

PublicationView.propTypes = {
  pubId: PropTypes.string.isRequired,
  classes: PropTypes.object,
};

PublicationView.defaultProps = {
  pubId: 'BoesAdsorption2018',
};


export default withStyles(styles, { withTheme: true })(PublicationView);
