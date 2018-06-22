/**
 *
 * ReactionEnergies
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Hidden from 'material-ui/Hidden';
import { withStyles } from 'material-ui/styles';
import FaCube from 'react-icons/lib/fa/cube';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

const prettyPrintReaction = (reactants, products) => (`${Object.keys(JSON.parse(reactants)).join(' + ')}  ⇄  ${Object.keys(JSON.parse(products)).join(' + ')}`
  ).replace(/star/g, '*').replace(/gas/g, '(ℊ)');


const styles = () => ({
  tableFooter: {
    marginLeft: '-30px',
    div: {
      marginLeft: '-30px',
    },
  },

});

class ReactionEnergies extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.fetchRow = this.fetchRow.bind(this);
    this.state = {
      order: 'asc',
      orderBy: 'energy',
      page: 0,
      rowsPerPage: 10,
      loading: false,
    };
  }

  fetchRow(reaction) {
    this.setState({
      loading: true,
    });
    let catappKeys;
    let catappIds;
    if (typeof reaction.aseIds !== 'undefined' && reaction.aseIds !== null) {
      catappIds = JSON.parse(reaction.aseIds);
      catappKeys = Object.keys(JSON.parse(reaction.aseIds));
    } else {
      catappIds = {};
      catappKeys = [];
      this.setState({
        loading: false,
      });
    }

    this.props.clearSystems();
    catappKeys.map((key) => {
      let aseId = catappIds[key];
      if (typeof aseId === 'object') {
        aseId = aseId[1];
      }
      const query = {
        query: `query{systems(uniqueId: "${aseId}") { edges { node { Formula energy Cifdata PublicationYear PublicationDoi PublicationAuthors PublicationTitle PublicationVolume PublicationUrl PublicationNumber PublicationJournal PublicationPages uniqueId volume mass Facet } } }}`,
      };
      return axios.post(graphQLRoot, query).then((response) => {
        const node = response.data.data.systems.edges[0].node;
        node.DFTCode = reaction.dftCode;
        node.DFTFunctional = reaction.dftFunctional;
        node.aseId = aseId;
        node.key = key
          .replace(/.*TSstar/g, '‡')
          .replace(/(.*)gas/g, (match, p1) => `${p1}(ℊ)`)
          .replace(/(.+)star/, (match, p1) => `${p1}/${reaction.surfaceComposition}`)
          .replace(/star/, reaction.surfaceComposition);

        node.full_key = node.key;
        if (typeof node.Facet !== 'undefined' && node.Facet !== '' && node.Facet !== null) {
          node.full_key = `${node.full_key} [${node.Facet}]`;
        }
        if (node.key.indexOf('(ℊ)') > -1) {
          node.full_key = `Molecule ${node.full_key}`;
        } else {
          node.full_key = `Surface ${node.full_key}`;
        }

        this.props.saveSystem(node);
        this.setState({
          loading: false,
        });
      }).catch(() => {
        this.setState({
          loading: false,
        });
      });
    });
  }
  handlePageChange = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };


  render() {
    if (this.props.reactions.length === 0) {
      if (this.props.searchSubmitted) {
        return (
          <div>
            <h2>Ooops!</h2>
            No reaction energies found. Please remove one or more filters.
          </div>
        );
      }
      return null;
    }
    return (
      <div>
        <div>
          <h2>Surface Reactions</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none">Geometry</TableCell>
                <TableCell padding="none">Reaction</TableCell>
                <TableCell padding="none">Reaction Energy</TableCell>
                <Hidden smDown>
                  <TableCell>Activation Energy</TableCell>
                </Hidden>
                <TableCell padding="none">Surface</TableCell>
                <Hidden smDown>
                  <TableCell>Facet</TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /* eslint-disable arrow-body-style */
                this.props.reactions
                  .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                  .map((result, i) => {
                    return (
                      <TableRow
                        hover
                        key={`row_${i}`}
                        onClick={() => {
                          this.props.selectReaction(result);
                          this.fetchRow(result);
                        }}
                      >
                        <TableCell padding="none">{result.aseIds !== null ? <FaCube /> : null}</TableCell>
                        <TableCell padding="dense">{prettyPrintReaction(result.reactants, result.products)}</TableCell>
                        <TableCell padding="none">{!result.reactionEnergy || `${result.reactionEnergy.toFixed(2)} eV` }</TableCell>
                        <Hidden smDown>
                          <TableCell>{!result.activationEnergy || `${result.activationEnergy.toFixed(2)} eV`}</TableCell>
                        </Hidden>
                        <TableCell padding="none">{result.surfaceComposition}</TableCell>
                        <Hidden smDown>
                          <TableCell>{result.facet}</TableCell>
                        </Hidden>
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
                  count={this.props.reactions.length}
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
        </div>
        {this.state.loading ? <LinearProgress color="primary" /> : null }
      </div>
    );
  }
}

ReactionEnergies.propTypes = {
  selectReaction: PropTypes.func.isRequired,
  clearSystems: PropTypes.func.isRequired,
  saveSystem: PropTypes.func.isRequired,
  reactions: PropTypes.array.isRequired,
  searchSubmitted: PropTypes.bool,
  classes: PropTypes.object,
};

ReactionEnergies.defaultProps = {
  searchResults: [],

};

export default withStyles(styles)(ReactionEnergies);
