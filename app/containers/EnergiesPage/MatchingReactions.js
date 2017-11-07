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
    }
  }
}}`,
      };
      return axios.post(graphQLRoot, query).then((response) => {
        const node = response.data.data.systems.edges[0].node;
        console.log(reaction);
        node.DftCode = reaction.dftCode;
        node.DftFunctional = reaction.dftFunctional;
        this.props.saveSystem(response.data.data.systems.edges[0].node);
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
                <TableCell>Activation Energy</TableCell>
                <TableCell>Facet</TableCell>
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
                        <TableCell>{!result.node.activationEnergy || result.node.activationEnergy.toFixed(2)}</TableCell>
                        <TableCell>{result.node.Facet}</TableCell>
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
};

MatchingReactions.defaultProps = {
  searchResults: [],

};
