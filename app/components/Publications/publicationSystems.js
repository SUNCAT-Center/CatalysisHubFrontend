
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
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import SingleStructureView from 'components/SingleStructureView';
import GraphQlbutton from 'components/GraphQlbutton';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
  },
});

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
        <Paper className={this.props.classes.paper}>
          <h3>Geometries</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none">#Atoms</TableCell>
                <TableCell padding="none">Composition</TableCell>
                <TableCell padding="none">Facet</TableCell>
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
                      <TableCell padding="none">{JSON.stringify(system.node.natoms)}</TableCell>
                      <TableCell padding="none">{system.node.Formula}</TableCell>
                      <TableCell padding="none">{system.node.Facet}</TableCell>
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
                  labelRowsPerPage=""
                />
              </TableRow>
            </TableFooter>
          </Table>
          <GraphQlbutton query={this.props.publicationQuery} />
        </Paper>
        <div>
          {this.state.uuid === null ? null :
          <SingleStructureView selectedUUID={this.state.uuid} selectedSystem={this.state.system} />
              }
        </div>
        <hr />
      </div>
    );
  }

}

PublicationSystems.propTypes = {
  systems: PropTypes.array,
  classes: PropTypes.object,
  publicationQuery: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(PublicationSystems);
