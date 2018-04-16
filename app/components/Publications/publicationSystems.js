
import React from 'react';
import PropTypes from 'prop-types';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import SingleStructureView from 'components/SingleStructureView';
import GraphQlbutton from 'components/GraphQlbutton';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
  },
  clickableRow: {
    cursor: 'pointer',
  },
});

class PublicationSystems extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.fetchRow = this.fetchRow.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.state = {
      rowsPerPage: 10,
      page: 0,
      uuid: null,
      system: {},
      order: 'asc',
      orderBy: '',
      systems: this.props.systems,
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

  createSortHandler = (property) => (event) => {
    this.handleRequestSort(event, property);
  }

  handleRequestSort(event, property) {
    let order = 'desc';
    let systems;
    const orderBy = property;

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    if (order === 'desc') {
      systems = this.state.systems.sort((a, b) => (b.node[orderBy] < a.node[orderBy] ? -1 : 1));
    } else {
      systems = this.state.systems.sort((a, b) => (b.node[orderBy] > a.node[orderBy] ? -1 : 1));
    }
    this.setState({
      systems,
      order,
      orderBy,
    });
  }

  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <h3>Geometries</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none">
                  <TableSortLabel
                    active={this.state.orderBy === 'natoms'}
                    direction={this.state.order}
                    onClick={this.createSortHandler('natoms')}
                  >
                  #Atoms
                  </TableSortLabel>
                </TableCell>
                <TableCell padding="none">
                  <TableSortLabel
                    active={this.state.orderBy === 'formula'}
                    direction={this.state.order}
                    onClick={this.createSortHandler('formula')}
                  >
                  Composition
                  </TableSortLabel>
                </TableCell>
                <TableCell padding="none">
                  <TableSortLabel
                    active={this.state.orderBy === 'facet'}
                    direction={this.state.order}
                    onClick={this.createSortHandler('facet')}
                  >
                  Facet
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.systems
                  .slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
                  .map((system, i) => (
                    <TableRow
                      hover
                      key={`publicationsystems_row_${i}`}
                      onClick={() => {
                        /* this.props.selectReaction(result.node); */
                        this.fetchRow(system);
                      }}
                      className={this.props.classes.clickableRow}
                    >
                      <TableCell padding="none">{JSON.stringify(system.natoms)}</TableCell>
                      <TableCell padding="none">{system.Formula}</TableCell>
                      <TableCell padding="none">{system.Facet}</TableCell>
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
