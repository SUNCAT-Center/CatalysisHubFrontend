/**
 *
 * ResultTable
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

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';


class ResultTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.fetchRow = this.fetchRow.bind(this);
    this.state = {
      order: 'asc',
      orderBy: 'energy',
      page: 0,
      rowsPerPage: 10,
    };
  }

  fetchRow(uuid) {
    axios.post(graphQLRoot, {
      query: `query{systems(uniqueId: "${uuid}") {
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
    }
  }
}}`,
    }).then((response) => {
      this.props.saveSystem(response.data.data.systems.edges[0].node);
    });
  }
  handlePageChange = (event, page) => {
    this.setState({ page });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    if (this.props.searchResults.length === 0) {
      return null;
    }
    return (
      <div>
        <div>
          <h2>Search Results</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Formula</TableCell>
                <TableCell>Density</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Facet</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /* eslint-disable arrow-body-style */
                this.props.searchResults
                  .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                  .map((result, i) => {
                    return (
                      <TableRow
                        key={`row_${i}`}
                        onClick={() => {
                          this.props.selectUUID(result.node.uniqueId);
                          this.fetchRow(result.node.uniqueId);
                        }}
                      >
                        <TableCell>{result.node.uniqueId}</TableCell>
                        <TableCell>{result.node.Formula}</TableCell>
                        <TableCell>{result.node.Density}</TableCell>
                        <TableCell>{result.node.volume.toFixed(2)}</TableCell>
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
                  count={this.props.searchResults.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handlePageChange}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />

              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }
}

ResultTable.propTypes = {
  selectUUID: PropTypes.func,
  saveSystem: PropTypes.func,
  searchResults: PropTypes.array,
};

ResultTable.defaultProps = {
  results: [],

};

export default ResultTable;
