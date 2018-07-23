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
import Hidden from 'material-ui/Hidden';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from 'material-ui/Table';

import { withStyles } from 'material-ui/styles';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import { MdChevronRight } from 'react-icons/lib/md';
import {
  FaExternalLink,
  FaCube,
  FaArrowDown,
  FaTable,
  FaList,
} from 'react-icons/lib/fa';

import axios from 'axios';
import { newGraphQLRoot } from 'utils/constants';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import GraphQlbutton from 'components/GraphQlbutton';
import CompositionBar from 'components/CompositionBar';

import { styles } from './styles';

const initialState = {
  resultSize: 0,
  rowsPerPage: 100,
  order: 'asc',
  orderBy: 'energy',
  page: 0,
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
  tableView: false,
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
    this.toggleView = this.toggleView.bind(this);
    this.getStructures = this.getStructures.bind(this);
    this.getReactions = this.getReactions.bind(this);
    this.handleReactionsScroll = this.handleReactionsScroll.bind(this);
    this.sortReactions = this.sortReactions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.loadingReactions === true) {
      return true;
    }
    const { pubId } = nextProps;
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

    return axios(this.props.graphqlRoot,
      {
        method: 'post',
        data: publicationQuery,
        withCredentials: this.props.privilegedAccess,
      }).then((response) => {
        this.setState({
          publicationQuery,
          reactions: [],
          structures: [],
          hasMoreReactions: true,
          loadingPublication: false,
          publication: response.data.data.publications.edges[0].node,
        });
        if (!this.state.loadingReactions) {
          this.getReactions();
        }
      });
  }


  getReactions() {
    const { pubId } = this.props;
    if (this.state.hasMoreReactions) {
      this.setState({
        loadingReactions: true,
      });
      const reactionQuery = {
        ttl: 300,
        query: `query{reactions (pubId: "${pubId}",
        first: ${Math.min(1000, Math.max(100, parseInt(this.state.reactions.length * 0.5, 10)))}, after: "${this.state.endCursor}") {
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
      axios(this.props.graphqlRoot, {
        method: 'post',
        data: reactionQuery,
        withCredentials: this.props.privilegedAccess,
      }).then((response) => {
        const newReactions = _.concat(this.state.reactions,
          response.data.data.reactions.edges.map((edge) => edge.node),
        );
        this.setState({
          reactionQuery,
          reactions: newReactions,
          resultSize: newReactions.length,
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
      keyValuePairs
    }
  }
}}`,
        ttl: 300,
      };
      return axios(this.props.graphqlRoot, {
        method: 'post',
        data: structureQuery,
        withCredentials: this.props.privilegedAccess,
      }).then((response) => {
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
    const bottom = e.target.scrollHeight - e.target.scrollTop >= (e.target.clientHeight);
    if (bottom && this.state.hasMoreReactions) {
      this.setState({
        loadingMoreReactions: true,
        hasMoreReactions: false,
      });
      if (!this.state.loadingMoreReactions) {
        this.getReactions();
      }
    }
  }

  sortReactions(field) {
    this.setState({
      reactions: _.orderBy(this.state.reactions, field),
    });
  }

  toggleView() {
    this.setState({
      tableView: !this.state.tableView,
    });
  }

  handlePageChange = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  createSortHandler = (property) => (event) => {
    this.handleRequestSort(event, property);
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order;
    let reactions;
    this.setState({
      loading: true,
    });



    this.state.order = 'desc';
    if (this.state.orderBy === orderBy && this.state.order === 'desc') {
      order = 'asc';
    }

    if (order === 'desc') {
      reactions = this.state.reactions.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));
    } else {
      reactions = this.state.reactions.sort((a, b) => (b[orderBy] > a[orderBy] ? -1 : 1));
    }
    this.setState({
      loading: false,
      reactions,
      order,
      orderBy,
    });
  }
  render() {
    const { publication, reactions, structures } = this.state;
    return (
      <div>
        {this.state.loadingPublication ? <LinearProgress className={this.props.classes.progress} /> : null }

        {_.isEmpty(publication) ? null :
        <Paper className={this.props.classes.paper}>
          {this.props.preview === false ? null :
          <div className={this.props.classes.important}>
                  This is just a preview. The final dataset will appear under <a>{`https://www.catalysis-hub.org/publications/${publication.pubId}`}</a>
          </div>
              }
          {prettyPrintReference(publication)} {`#${publication.pubId}.`}
          <div>
            <Button
              className={this.props.classes.publicationAction}
              onClick={() => {
                this.toggleView();
              }}
            >
              {this.state.tableView ?
                <div>
                  <FaList /> List View
                  </div>
                  :
                  <div>
                    <FaTable /> Table View
                  </div>
              }
            </Button>
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
          </div>
        </Paper>
        }
        {_.isEmpty(reactions) ? <LinearProgress className={this.props.classes.progress} /> : [(this.state.tableView ?

          <div>
            <Paper
              className={this.props.classes.paper}
            >
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="none">
                      <div>Geometry</div></TableCell>
                    <TableCell padding="none">
                      <TableSortLabel
                        active={this.state.orderBy === 'Equation'}
                        direction={this.state.order}
                        onClick={this.createSortHandler('Equation')}
                      >
                        <div>Reaction</div>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell padding="none">
                      <TableSortLabel
                        active={this.state.orderBy === 'reactionEnergy'}
                        direction={this.state.order}
                        onClick={this.createSortHandler('reactionEnergy')}
                      >
                        <div>Reaction Energy</div>
                      </TableSortLabel>
                    </TableCell>
                    <Hidden smDown>
                      <TableCell>
                        <TableSortLabel
                          active={this.state.orderBy === 'activationEnergy'}
                          direction={this.state.order}
                          onClick={this.createSortHandler('activationEnergy')}
                        >
                          <div>Activation Energy</div>
                        </TableSortLabel>
                      </TableCell>
                    </Hidden>
                    <TableCell padding="none">
                      <TableSortLabel
                        active={this.state.orderBy === 'surfaceComposition'}
                        direction={this.state.order}
                        onClick={this.createSortHandler('surfaceComposition')}
                      >
                        <div>Surface</div>
                      </TableSortLabel>
                    </TableCell>
                    <Hidden smDown>
                      <TableCell>
                        <TableSortLabel
                          active={this.state.orderBy === 'facet'}
                          direction={this.state.order}
                          onClick={this.createSortHandler('facet')}
                        >
                          <div>Facet</div>
                        </TableSortLabel>
                      </TableCell>
                    </Hidden>
                    <Hidden smDown>
                      <TableCell>
                        <TableSortLabel
                          active={this.state.orderBy === 'sites'}
                          direction={this.state.order}
                          onClick={this.createSortHandler('sites')}
                        >
                          <div>Sites</div>
                        </TableSortLabel>
                      </TableCell>
                    </Hidden>
                    <TableCell>
                      <TableSortLabel
                        active={this.state.orderBy === 'dftFunctional'}
                        direction={this.state.order}
                        onClick={this.createSortHandler('dftFunctional')}
                      >
                        <div>XC Functional</div>
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                  /* eslint-disable arrow-body-style */
                  reactions
                    .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                    .map((result, i) => {
                      return (
                        <TableRow
                          hover
                          key={`row_${i}`}
                          onClick={() => {
                            this.getStructures(result, i);
                          }}
                          className={this.props.classes.clickableRow}
                        >
                          <TableCell padding="none"><div>{result.reactionSystems[0].name !== 'N/A' ? <FaCube /> : null}</div></TableCell>
                          <TableCell padding="dense"><div>{result.Equation.replace('->', '→')}</div></TableCell>
                          <TableCell padding="none"><div>{!result.reactionEnergy || `${result.reactionEnergy.toFixed(2)} eV` }</div></TableCell>
                          <Hidden smDown>
                            <TableCell><div>{!result.activationEnergy || `${result.activationEnergy.toFixed(2)} eV`}</div></TableCell>
                          </Hidden>
                          <TableCell padding="none"><div>{result.surfaceComposition}</div></TableCell>
                          <Hidden smDown>
                            <TableCell>{result.facet}</TableCell>
                          </Hidden>
                          <Hidden smDown>
                            <TableCell>{result.sites}</TableCell>
                          </Hidden>
                          <TableCell>{`${result.dftFunctional}/${result.dftCode}` || ''}</TableCell>
                        </TableRow>

                      );
                    })
                  /* eslint-enable */
                }
                </TableBody>
                <TableFooter
                  className={this.props.classes.tableFooter}
                >
                  <TableRow>
                    <TablePagination
                      count={this.state.resultSize}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      onChangePage={this.handlePageChange}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      rowsPerPageOptions={[10, 25, 100, 1000]}
                      className={this.props.classes.tableFooter}
                      labelRowsPerPage=""
                    />
                  </TableRow>
                </TableFooter>
              </Table>


              {!this.state.hasMoreReactions ? null :
              <div>
                  Switch to
                  <Button
                    className={this.props.classes.publicationAction}
                    onClick={() => {
                      this.toggleView();
                    }}
                  >
                    List View
                  </Button> and scroll down to load remaining reactions.
                </div>
            }
            </Paper>
            <Paper className={this.props.classes.structuresDiv}>
              <Grid direction="row" justify="center">
                <Grid item>
                  <h2><FaArrowDown /> scroll down for more structures</h2>
                  <Grid container justify="flex-start" direction="row">
                    {this.state.structures.map((image, i) => (
                      <Grid item key={`structure_${i}`}>
                        <Grid container direction="row" justify="center">
                          <Grid item>
                            <h2>{structures[i].Formula}  ({structures[i].energy} eV)</h2>
                            <GeometryCanvasWithOptions
                              cifdata={structures[i].Cifdata}
                              uniqueId={`slab_preview_${i}`}
                              key={`slab_preview_${i}`}
                              id={`slab_preview_${i}`}
                              x={1} y={1} z={1}
                            />

                            {_.isEmpty(this.state.structureQuery) ? null :
                            <Grid container className={this.props.classes.headerDiv} direction="row" justify="flex-start">
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
                </Grid>
              </Grid>

            </Paper>

          </div>
          :

          <Grid container direction={isMobile ? 'column' : 'row'} justify="space-between">
            <Grid item md={5} sm={12}>
              {(this.state.loadingReactions && !this.state.loadingMoreReactions) ? <LinearProgress className={this.props.classes.progress} /> : null }
              <Paper
                className={this.props.classes.reactionsDiv}
                onScroll={this.handleReactionsScroll}
              >
                <Grid
                  container
                  className={this.props.classes.headerDiv} direction="row" justify="center"
                >
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
                  {reactions.map((reaction, i) => (
                    <div key={`reaction_${i}`}>
                      <li
                        className={(this.state.selectedReaction === i ? this.props.classes.selectedReaction : this.props.classes.reaction)}
                      >({i + 1}/{this.state.totalCount}) Composition: {reaction.chemicalComposition}, Facet {reaction.facet}, Sites {reaction.sites}
                        <ul>
                          <li>
                            <CompositionBar
                              composition={reaction.chemicalComposition}
                              height={10}
                            />
                          </li>
                          <li>Formula: {reaction.Equation}</li>
                          <li>Reaction Energy: {reaction.reactionEnergy.toFixed(2)} eV</li>
                          <li>DFT Code: {reaction.dftCode}, DFT Functional: {reaction.dftFunctional}</li>
                        </ul>
                      </li>
                      <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        className={this.props.classes.structureBar}
                      >
                        <Grid item>
                          <Button
                            onClick={() => this.getStructures(reaction, i)}
                            className={this.props.classes.publicationAction}
                          > Structures <MdChevronRight />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </ul>

                {this.state.loadingMoreReactions ?
                  <Grid container direction="row" justify="center">
                    <Grid item>
                      <CircularProgress />
                    </Grid>
                  </Grid>
                    : null}
              </Paper>
            </Grid>
            {this.state.structures.length === 0 ? null :
            <Grid item md={7} sm={12}>
              {this.state.loadingStructures ? <LinearProgress className={this.props.classes.progress} /> : null }
              <Paper className={this.props.classes.structuresDiv}>
                <h2><FaArrowDown /> scroll down for more structures</h2>
                <Grid container justify="flex-start" direction="column">
                  {this.state.structures.map((image, i) => (
                    <Grid item key={`item_${i}`}>
                      <Grid container direction="row" justify="center">
                        <Grid item>
                          <h2>{structures[i].Formula}  ({structures[i].energy} eV)</h2>
                          <GeometryCanvasWithOptions
                            cifdata={structures[i].Cifdata}
                            uniqueId={`slab_preview_${i}`}
                            key={`slab_preview_${i}`}
                            id={`slab_preview_${i}`}
                            x={1} y={1} z={1}
                          />

                          {_.isEmpty(this.state.structureQuery) ? null :
                          <Grid container className={this.props.classes.headerDiv} direction="row" justify="flex-start">
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
        )]
        }
      </div>
    );
  }
}

PublicationView.propTypes = {
  pubId: PropTypes.string.isRequired,
  classes: PropTypes.object,
  graphqlRoot: PropTypes.string,
  preview: PropTypes.bool,
  privilegedAccess: PropTypes.bool,
};

PublicationView.defaultProps = {
  pubId: 'BoesAdsorption2018',
  graphqlRoot: newGraphQLRoot,
  preview: false,
  privilegedAccess: false,
};


export default withStyles(styles, { withTheme: true })(PublicationView);
