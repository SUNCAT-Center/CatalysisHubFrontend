
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
import Flexbox from 'flexbox-react';
import SingleStructureView from 'components/SingleStructureView';

class PublicationSystems extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#Atoms</TableCell>
              <TableCell>Composition</TableCell>
              <TableCell>Facet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.systems
                .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                .map((system, i) => (
                  <TableRow
                    hover
                    key={`publicationsystems_row_${i}`}
                    onClick={() => {
                      /* this.props.selectReaction(result.node); */
                      this.fetchRow(system.node);
                    }}
                  >
                    <TableCell>{JSON.stringify(system.node.natoms)}</TableCell>
                    <TableCell>{system.node.Formula}</TableCell>
                    <TableCell>{system.node.Facet}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={this.props.systems.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 100, 1000]}
              />
            </TableRow>
          </TableFooter>
        </Table>
        <div>
          {this.state.uuid === null ? null :
          <Flexbox flexDirection="row">
            <SingleStructureView selectedUUID={this.state.uuid} selectedSystem={this.state.system} />
          </Flexbox>
          }
        </div>
      </div>
    );
  }

}

PublicationSystems.propTypes = {
  systems: PropTypes.array,

};

export default PublicationSystems;
