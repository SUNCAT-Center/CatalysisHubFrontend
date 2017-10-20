/**
 *
 * ResultTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
//

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class ResultTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {this.props.results.length === 0 ? null :
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
                this.props.results.map((result, i) => {
                  return (
                    <TableRow key={`row_${i}`}>
                      <TableCell>{result.id}</TableCell>
                      <TableCell>{result.Formula}</TableCell>
                      <TableCell>{result.Density}</TableCell>
                      <TableCell>{result.Volume}</TableCell>
                      <TableCell>{result.Facet}</TableCell>
                    </TableRow>

                  );
                })
              /* eslint-enable */
            }
            </TableBody>
          </Table>
        </div>
        }
      </div>
    );
  }
}

ResultTable.propTypes = {
  results: PropTypes.array.isRequired,
};

ResultTable.defaultProps = {
  results: [],

};

export default ResultTable;
