/**
 *
 * MatchingReactions
 *
 */

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import * as Scroll from 'react-scroll';
import IFrame from 'react-iframe';
import ReactGA from 'react-ga';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import FaCube from 'react-icons/lib/fa/cube';


import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';
import { withCommas } from 'utils/functions';

import GraphQlbutton from 'components/GraphQlbutton';
import * as snackbarActions from 'containers/AppSnackBar/actions';
import * as catKitActions from 'containers/CatKitDemo/actions';
import * as actions from './actions';

const styles = (theme) => ({
  iframe: {
    marginTop: 20,
  },
  buttonLink: {
    textTransformation: 'none',
    textDecoration: 'none',
    fontColor: 'white',
    color: 'white',
    fontWeight: 'bold',

  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,

  },
  paper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit * 2,

  },
  li: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  emptyText: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableFooter: {
    marginLeft: '-30px',
    div: {
      marginLeft: '-30px',
    },
  },
  clickableRow: {
    cursor: 'pointer',
  },
  progress: {
    margin: theme.spacing.unit,
  },

});

class MatchingReactions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.fetchRow = this.fetchRow.bind(this);
    this.state = {
      order: 'asc',
      orderBy: 'energy',
      page: 0,
      rowsPerPage: 10,
      loading: false,
      pageInfo: {},
      requestFormOpen: false,
    };
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
    this.setState({
      loading: true,
    });
    this.props.handleRequestSort(event, property);
    this.setState({
      loading: false,
    });
  }

  fetchRow(reaction) {
    this.setState({
      loading: true,
    });
    this.props.saveLoading(true);
    let cathubIds;
    let cathubNames;
    let catenergyCorrections;
    if (typeof reaction.reactionSystems !== 'undefined' && reaction.reactionSystems !== null) {
      cathubIds = (reaction.reactionSystems.map((x) => x.aseId));
      cathubNames = (reaction.reactionSystems.map((x) => x.name));
      catenergyCorrections = (reaction.reactionSystems.map((x) => x.energyCorrection));
    } else {
      cathubIds = {};
      snackbarActions.open('Scroll down for detailed structure.');
    }

    const pubQuery = {
      query: `{publications(pubId: "${reaction.pubId}"){
    edges {
      node {
        year
        doi
        authors
        title
        number
        journal
        pages
        pubId
      }
    }
  }}`,
    };
    cachios.post(newGraphQLRoot, pubQuery).then((response) => {
      this.props.savePublication(response.data.data.publications.edges[0].node);
    });

    this.props.clearSystems();
    cathubIds.map((key, index) => {
      let aseId = key;
      const name = cathubNames[index];
      const energyCorrection = catenergyCorrections[index];
      if (typeof aseId === 'object') {
        aseId = aseId[1];
      }
      const query = {
        query: `query{systems(uniqueId: "${aseId}") {
  edges {
    node {
      Formula
      energy
      calculatorParameters
      Cifdata
      volume
      mass
    }
  }
}}`,
        ttl: 300,
      };
      return cachios.post(newGraphQLRoot, query).then((response) => {
        Scroll.animateScroll.scrollMore(900);
        const node = response.data.data.systems.edges[0].node;
        node.DFTCode = reaction.dftCode;
        node.DFTFunctional = reaction.dftFunctional;
        node.Facet = reaction.facet;
        node.publication = this.props.publication;
        node.aseId = aseId;
        node.energyCorrection = energyCorrection;
        node.key = name;
        node.full_key = node.Formula;
        const ads = name.replace('star', ' @');
        if (name.indexOf('gas') !== -1) {
          node.full_key = `Gas phase ${node.full_key}`;
        } else if (name.indexOf('bulk') !== -1) {
          node.full_key = `Bulk ${node.full_key}`;
        } else {
          if (name === 'star') {
            node.full_key = `Surface ${reaction.chemicalComposition}`;
          } else {
            node.full_key = `${ads} ${reaction.chemicalComposition}`;
          }
          if (typeof node.Facet !== 'undefined' && node.Facet !== '' && node.Facet !== null) {
            node.full_key = `${node.full_key} [${node.Facet}]`;
          }
        }
        this.props.saveSystem(node);
        this.setState({
          loading: false,
        });
      }).catch(() => {
        this.setState({
          loading: false,
        });
        this.props.saveLoading(false);
      });
    });
  }

  render() {
    if (this.props.matchingReactions.length === 0) {
      if (this.props.searchSubmitted && (!_.isEmpty(this.props.searchParams) || !_.isEmpty(this.props.searchString))) {
        ReactGA.event({
          category: 'Search',
          action: 'Search',
          label: `No results: ${JSON.stringify(this.props.searchParams)} / ${this.props.searchString}`,
        });
        return (
          <div>
            <Paper className={this.props.classes.paper}>
              <Grid container direction="row" justify="center">
                <Grid item>
                  <h2>No reaction energies found!</h2>
                  <div className={this.props.classes.emptyText}>
                    Here are a couple of things you could try.
                    <ul>
                      <li className={this.props.classes.li}>
                        Remove one or more filters.
                      </li>
                      <li>
                        Flip reactants and products.
                      </li>
                      <li className={this.props.classes.li}>
                        <Button
                          color="primary"
                          raised
                          className={this.props.classes.button}
                        >
                          <Link
                            className={this.props.classes.buttonLink}
                            onClick={() => {
                              this.props.catKitStepperHandleReset();
                            }}
                            to={`/catKitDemo/fcc/3.91/${this.props.searchParams.surfaceComposition}`}
                          >construct</Link>
                        </Button> your own slab calculation.
                      </li>
                      <li className={this.props.classes.li}>
                        <Button
                          color="primary"
                          raised
                          className={this.props.classes.button}
                        >
                          <Link
                            className={this.props.classes.buttonLink}
                            to={'/bulkGenerator'}
                          >import</Link>
                        </Button> your own bulk structure.
                      </li>
                      <li className={this.props.classes.li}>
                        <Button
                          color="primary"
                          raised
                          className={this.props.classes.button}
                          onClick={() => {
                            this.setState({ requestFormOpen: true });
                            ReactGA.event({
                              category: 'Search',
                              action: 'Search',
                              label: `Open Request Form: ${JSON.stringify(this.props.searchParams)} / ${this.props.searchString}`,
                            });
                          }}

                        > request </Button> a calculation.
                      </li>
                      <li>
                        Open <GraphQlbutton query={this.props.searchQuery} newSchema /> to interact with the database directly.
                      </li>
                    </ul>
                  </div>
                </Grid>
              </Grid>
            </Paper>
            {this.state.requestFormOpen === false ? null :
            <Paper className={this.props.classes.paper} >
              <IFrame
                className={this.props.classes.iframe}
                url={`https://docs.google.com/forms/d/e/1FAIpQLSdmRjKDJd3S5dLeqLrKr6xQIf2ehGHqkX9Q3SI0LpgxCwQfXA/viewform?usp=pp_url&entry.1106005645&entry.182105476&entry.1888744323=${this.props.searchParams.reactants || ''}&entry.1594900128&entry.79296069=${this.props.searchParams.surfaceComposition || ''}&entry.2134412490=${this.props.searchParams.facet || ''}&entry.194204757`}
                width="100%"
                height="80vh"
                position="relative"
                display="initial"
                allowFullScreen
              />
            </Paper>
            }

          </div>
        );
      }
      return null;
    }
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: `Successful search: ${JSON.stringify(this.props.searchParams)} / ${this.props.searchString}`,
    });
    return (
      <Paper className={this.props.classes.paper}>
        <div>
          <h2>Matching Reactions ({withCommas(this.props.resultSize)})</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none"> <div>Geometry</div></TableCell>
                <TableCell padding="none"> <div>Reaction</div> </TableCell>
                <TableCell padding="none">
                  <TableSortLabel
                    active={this.props.orderBy === 'reactionEnergy'}
                    direction={this.props.order}
                    onClick={this.createSortHandler('reactionEnergy')}
                  >
                    <div>Reaction Energy</div>
                  </TableSortLabel>
                </TableCell>
                <Hidden smDown>
                  <TableCell>
                    <TableSortLabel
                      active={this.props.orderBy === 'activationEnergy'}
                      direction={this.props.order}
                      onClick={this.createSortHandler('activationEnergy')}
                    >
                      <div>Activation Energy</div>
                    </TableSortLabel>
                  </TableCell>
                </Hidden>
                <TableCell padding="none">
                  <TableSortLabel
                    active={this.props.orderBy === 'surfaceComposition'}
                    direction={this.props.order}
                    onClick={this.createSortHandler('surfaceComposition')}
                  >
                    <div>Surface</div>
                  </TableSortLabel>
                </TableCell>
                <Hidden smDown>
                  <TableCell>
                    <TableSortLabel
                      active={this.props.orderBy === 'facet'}
                      direction={this.props.order}
                      onClick={this.createSortHandler('facet')}
                    >
                      <div>Facet</div>
                    </TableSortLabel>
                  </TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell>
                    <TableSortLabel
                      active={this.props.orderBy === 'sites'}
                      direction={this.props.order}
                      onClick={this.createSortHandler('sites')}
                    >
                      <div>Sites</div>
                    </TableSortLabel>
                  </TableCell>
                </Hidden>
                <TableCell>
                  <TableSortLabel
                    active={this.props.orderBy === 'dftFunctional'}
                    direction={this.props.order}
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
                this.props.matchingReactions
                  .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                  .map((result, i) => {
                    return (
                      <TableRow
                        hover
                        key={`row_${i}`}
                        onClick={() => {
                          this.props.selectReaction(result.node);
                          this.fetchRow(result.node);
                        }}
                        className={this.props.classes.clickableRow}
                      >
                        <TableCell padding="none"><div>{result.node.reactionSystems[0].name !== 'N/A' ? <FaCube /> : null}</div></TableCell>
                        <TableCell padding="dense"><div>{result.node.Equation.replace('->', '→')}</div></TableCell>
                        <TableCell padding="none"><div>{!result.node.reactionEnergy || `${result.node.reactionEnergy.toFixed(2)} eV` }</div></TableCell>
                        <Hidden smDown>
                          <TableCell><div>{!result.node.activationEnergy || `${result.node.activationEnergy.toFixed(2)} eV`}</div></TableCell>
                        </Hidden>
                        <TableCell padding="none"><div>{result.node.surfaceComposition}</div></TableCell>
                        <Hidden smDown>
                          <TableCell>{result.node.facet}</TableCell>
                        </Hidden>
                        <Hidden smDown>
                          <TableCell>{result.node.sites}</TableCell>
                        </Hidden>
                        <TableCell>{`${result.node.dftFunctional}/${result.node.dftCode}` || ''}</TableCell>
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
                  count={this.props.resultSize}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handlePageChange}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 100]}
                  className={this.props.classes.tableFooter}
                  labelRowsPerPage=""
                />
              </TableRow>
            </TableFooter>
          </Table>
          <GraphQlbutton query={this.props.searchQuery} newSchema />
        </div>
        {this.state.loading ? <LinearProgress color="primary" className={this.props.classes.progress} /> : null }
      </Paper>
    );
  }
}

MatchingReactions.propTypes = {
  searchQuery: PropTypes.string,
  selectReaction: PropTypes.func.isRequired,
  clearSystems: PropTypes.func.isRequired,
  saveSystem: PropTypes.func.isRequired,
  savePublication: PropTypes.func.isRequired,
  saveLoading: PropTypes.func.isRequired,
  matchingReactions: PropTypes.array.isRequired,
  searchSubmitted: PropTypes.bool,
  searchParams: PropTypes.object,
  classes: PropTypes.object,
  catKitStepperHandleReset: PropTypes.func,
  resultSize: PropTypes.number,
  searchString: PropTypes.string,
  handleRequestSort: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  publication: PropTypes.object,
};

MatchingReactions.defaultProps = {
  searchResults: [],
  searchString: '',
};

const mapStateToProps = (state) => ({
  loading: state.get('energiesPageReducer').loading,
  filter: state.get('energiesPageReducer').filter,
  matchingReactions: state.get('energiesPageReducer').matchingReactions,
  searchSubmitted: state.get('energiesPageReducer').searchSubmitted,
  search: state.get('energiesPageReducer').search,
  resultSize: state.get('energiesPageReducer').resultSize,
  searchParams: state.get('energiesPageReducer').searchParams,
  searchQuery: state.get('energiesPageReducer').searchQuery,
  order: state.get('energiesPageReducer').order,
  orderBy: state.get('energiesPageReducer').orderBy,
  publication: state.get('energiesPageReducer').publication,
});

const mapDispatchToProps = (dispatch) => ({
  catKitStepperHandleReset: () => {
    dispatch(catKitActions.stepperHandleReset());
  },
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  selectReaction: (reaction) => {
    dispatch(actions.selectReaction(reaction));
  },
  clearSystems: () => {
    dispatch(actions.clearSystems());
  },
  receiveSystems: (systems) => {
    dispatch(actions.receiveSystems(systems));
  },
  saveSystem: (system) => {
    dispatch(actions.saveSystem(system));
  },
  savePublication: (x) => {
    dispatch(actions.savePublication(x));
  },
  saveLoading: (x) => {
    dispatch(actions.saveLoading(x));
  },
  handleRequestSort: (event, property) => {
    dispatch(actions.handleRequestSort(event, property));
  },
});


export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(MatchingReactions));
