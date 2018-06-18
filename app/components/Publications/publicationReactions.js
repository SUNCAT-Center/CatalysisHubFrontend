
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
import Hidden from 'material-ui/Hidden';

const prettyPrintReaction = (reactants, products) => (`${Object.keys(JSON.parse(reactants)).join(' + ')}  ⇄  ${Object.keys(JSON.parse(products)).join(' + ')}`
  ).replace(/star/g, '*').replace(/gas/g, '(ℊ)');


class PublicationReactions extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.fetchRow = this.fetchRow.bind(this);
    this.state = {
      rowsPerPage: 10,
      page: 0,
      uuid: null,
      system: {},
    };
  }
  fetchRow(system) {
    this.setState({
      uuid: system.uniqueId,
      system,
    });
  }

  handlePageChange = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Surface Reactions</h3>
        <Table>
          <TableHead>
            <TableRow>
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
            {this.props.reactionEnergies
                .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                .map((result, i) => (
                  <TableRow
                    hover
                    key={`row_${i}`}
                  >
                    <TableCell padding="dense">{prettyPrintReaction(result.node.reactants, result.node.products)}</TableCell>
                    <TableCell padding="none">{!result.node.reactionEnergy || `${result.node.reactionEnergy.toFixed(2)} eV` }</TableCell>
                    <Hidden smDown>
                      <TableCell>{!result.node.activationEnergy || `${result.node.activationEnergy.toFixed(2)} eV`}</TableCell>
                    </Hidden>
                    <TableCell padding="none">{result.node.surfaceComposition}</TableCell>
                    <Hidden smDown>
                      <TableCell>{result.node.facet}</TableCell>
                    </Hidden>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={this.props.reactionEnergies.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 100, 1000]}
                labelRowsPerPage=""
              />
            </TableRow>
          </TableFooter>
        </Table>
        <hr />
      </div>
    );
  }

}

PublicationReactions.propTypes = {
  reactionEnergies: PropTypes.array,

};

export default PublicationReactions;

