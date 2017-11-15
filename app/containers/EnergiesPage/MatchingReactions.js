/**
 *
 * MatchingReactions
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

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

export class MatchingReactions extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
    const aseIds = Object.values(JSON.parse(reaction.aseIds));
    this.props.clearSystems();
    aseIds.map((aseId) => {
      const query = {
        query: `query{systems(uniqueId: "${aseId}") {
  edges {
    node {
    Formula
    energy
    Cifdata
    PublicationYear
    PublicationDoi
    PublicationAuthors
    PublicationTitle
    PublicationVolume
    PublicationUrl
    PublicationNumber
    PublicationJournal
    PublicationPages
    uniqueId
    volume
    mass
    }
  }
}}`,
      };
      return axios.post(graphQLRoot, query).then((response) => {
        const node = response.data.data.systems.edges[0].node;
        console.log(reaction);
        node.DftCode = reaction.dftCode;
        node.DftFunctional = reaction.dftFunctional;
        node.aseId = aseId;

        this.props.saveSystem(node);
        this.setState({
          loading: false,
        });
      }).catch((error) => {
        console.log(error);
        console.log(query);
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
    if (this.props.matchingReactions.length === 0) {
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
          <h2>Matching Reactions</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reactants</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Reaction Energy</TableCell>
                <Hidden smDown>
                  <TableCell>Activation Energy</TableCell>
                </Hidden>
                <TableCell>Surface</TableCell>
                <Hidden smDown>
                  <TableCell>Facet</TableCell>
                </Hidden>
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
                      >
                        <TableCell>{result.node.reactants}</TableCell>
                        <TableCell>{result.node.products}</TableCell>
                        <TableCell>{!result.node.reactionEnergy || result.node.reactionEnergy.toFixed(3) } eV</TableCell>
                        <Hidden smDown>
                          <TableCell>{!result.node.activationEnergy || result.node.activationEnergy.toFixed(2)}</TableCell>
                        </Hidden>
                        <TableCell>{result.node.surfaceComposition}</TableCell>
                        <Hidden smDown>
                          <TableCell>{result.node.facet}</TableCell>
                        </Hidden>
                      </TableRow>

                    );
                  })
                /* eslint-enable */
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={this.props.matchingReactions.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handlePageChange}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 100, 1000]}
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

MatchingReactions.propTypes = {
  selectReaction: PropTypes.func.isRequired,
  clearSystems: PropTypes.func.isRequired,
  saveSystem: PropTypes.func.isRequired,
  matchingReactions: PropTypes.array.isRequired,
  searchSubmitted: PropTypes.bool,
};

MatchingReactions.defaultProps = {
  searchResults: [],

};
