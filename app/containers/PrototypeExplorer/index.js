/*
 *
 * PrototypeExplorer
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from 'material-ui/Table';


import { createStructuredSelector } from 'reselect';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { LinearProgress } from 'material-ui/Progress';


import makeSelectPrototypeExplorer from './selectors';
import { styles } from './styles';

const prototypes = [
  [
    ['A'],
  ], [
    ['A2'],
    ['AB'],
  ], [
    ['A3'],
    ['A2B'],
    ['ABC'],
  ], [
    ['A4'],
    ['A3B', 'A2B2'],
    ['A2BC'],
    ['ABCD'],
  ], [
    ['A5'],
    ['A4B', 'A3B2'],
    ['A3BC', 'A2B2C'],
    ['A2BCD'],
    ['ABCDE'],
  ], [
    ['A6'],
    ['A5B', 'A4B2', 'A3B3'],
    ['A4BC', 'A3B2C', 'A2B2C2'],
    ['A3BCD', 'A2B2CD'],
    ['A2BCDE'],
    ['ABCDEF'],
  ],
];

const columnData = [
  { id: 'index', numeric: true, disablePadding: true, label: 'Index' },
  { id: 'spacegroup', numeric: true, disablePadding: true, label: 'Spacegroup' },
  { id: 'synonyms', numeric: true, disablePadding: true, label: 'Synonyms' },
  { id: 'wyckoffPoints', numeric: true, disablePadding: true, label: 'Wyckoff Points' },
  { id: 'icsdStructures', numeric: true, disablePadding: true, label: '#ICSD' },
  { id: 'links', numeric: true, disablePadding: true, label: 'Links' },

];

const rawData = [];
_.range(10000).map((i) => rawData.push({
  id: i,
  spacegroup: getRandomInt(1, 230),
  synonyms: 'AB3C',
  wyckoffPoints: 'A, ...',
  icsdStructures: getRandomInt(1, 100),
  links: 'http://...',
}));

const initialState = {
  loading: false,
  nrAtoms: 1,
  nrSpecies: 1,
  prototypeComposition: 'A',
  rowsPerPage: 10,
  page: 0,
  data: rawData,
  selectedPrototype: null,
};

function getRandomInt(min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
}

export class PrototypeExplorer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  createSortHandler(property) {
    return (event) => {
      this.handleRequestSort(event, property);
    };
  }

  handleRequestSort(event, property) {
    this.setState({
      loading: true,
    });

    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    let data;
    if (order === 'desc') {
      data = this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));
    } else {
      data = this.state.data.sort((a, b) => (b[orderBy] > a[orderBy] ? -1 : 1));
    }

    this.setState({
      data,
      order,
      orderBy,
      loading: false,
    });
  }

  handleDiff(axis, diff) {
    return () => {
      this.setState({
        [axis]: Math.max(1, this.state[axis] + diff),
      });
    };
  }

  handleClick(event, selectedElement) {
    this.setState({
      selectedElement,
    });
  }
  handleChange(key, value) {
    return () => {
      this.setState({
        [key]: value,
      });
    };
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };
  render() {
    return (
      <div>
        <h1>Prototype Explorer</h1>
        <Paper className={this.props.classes.paper}>
          <Grid container direction="row" justify="space-between">
            <Grid item >
              <Grid container direction="row" justify="space-between">

                <Grid item className={this.props.classes.label} > # Atoms </Grid>
                <Grid item>
                  <Button
                    className={this.props.classes.button}
                    onClick={this.handleDiff('nrAtoms', -1)}
                    disabled={this.state.nrAtoms <= this.state.nrSpecies}
                    mini fab
                  >-</Button>
                </Grid>
                <Grid item>
                  <IconButton>
                    {this.state.nrAtoms}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button
                    className={this.props.classes.button}
                    onClick={this.handleDiff('nrAtoms', +1)}
                    disabled={this.state.nrAtoms >= 6}
                    mini fab
                  >+</Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item >
              <Grid container direction="row" justify="space-between">
                <Grid item className={this.props.classes.label} > # Species </Grid>
                <Grid item>
                  <Button
                    className={this.props.classes.button}
                    onClick={this.handleDiff('nrSpecies', -1)}
                    disabled={this.state.nrSpecies < 2}
                    mini fab
                  >-</Button>
                </Grid>
                <Grid item>
                  <IconButton>
                    {this.state.nrSpecies}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button
                    className={this.props.classes.button}
                    onClick={this.handleDiff('nrSpecies', +1)}
                    disabled={this.state.nrSpecies >= this.state.nrAtoms}
                    mini fab
                  >+</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center">
            <Grid item>
              {prototypes[this.state.nrAtoms - 1][this.state.nrSpecies - 1].map((proto, i) => (
                <Button
                  className={this.props.classes.button}
                  key={`b_${i}`}
                  raised
                  color="primary"
                  onClick={this.handleChange('prototypeComposition', proto)}
                >
                  {proto}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={this.props.classes.paper}>
          <h2>{this.state.prototypeComposition}</h2>
          {this.state.loading ? <LinearProgress color="primary" className={this.props.classes.progress} /> : null }
          <Table>
            <TableHead>
              <TableRow>
                {columnData.map((column) => (
                  <TableCell
                    key={column.id}
                    numeric={column.numeric}
                    padding={column.disablePadding ? 'none' : 'default'}
                  >
                    <TableSortLabel
                      active={this.state.orderBy === column.id}
                      direction={this.state.order}
                      onClick={this.createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.slice(this.state.page * this.state.rowsPerPage, (this.state.page * this.state.rowsPerPage) + this.state.rowsPerPage).map((n) => (
                <TableRow
                  hover
                  onClick={(event) => this.handleClick(event, n)}
                  tabIndex={-1}
                  key={n.id}
                >
                  <TableCell padding="none">{n.id}</TableCell>
                  <TableCell numeric padding="none">{n.spacegroup}</TableCell>
                  <TableCell numeric>{this.state.prototypeComposition}</TableCell>
                  <TableCell >{n.wyckoffPoints}</TableCell>
                  <TableCell numeric>{n.icsdStructures}</TableCell>
                  <TableCell numeric>{n.links}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={this.state.data.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
        {_.isEmpty(this.state.selectedElement) ? null :
        <Paper>
          <h2>{`${this.state.selectedElement.synonyms}_${this.state.selectedElement.spacegroup}`}</h2>
          <div>
                Here be dragons about {`${this.state.selectedElement.synonyms}_${this.state.selectedElement.spacegroup}`}.
              </div>
        </Paper>
        }
      </div>
    );
  }
}

PrototypeExplorer.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  PrototypeExplorer: makeSelectPrototypeExplorer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PrototypeExplorer));
