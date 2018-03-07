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
  /* TableFooter,*/
  /* TablePagination,*/
  TableSortLabel,
} from 'material-ui/Table';


import { createStructuredSelector } from 'reselect';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';


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
  { id: 'links', numeric: true, disablePadding: true, label: 'Links' },

];

const initialState = {
  nrAtoms: 1,
  nrSpecies: 1,
  prototypeComposition: 'A',
};

export class PrototypeExplorer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  createSortHandler(property) {
    return (event) => {
      this.props.onRequestSort(event, property);
    };
  }

  handleDiff(axis, diff) {
    return () => {
      this.setState({
        [axis]: Math.max(1, this.state[axis] + diff),
      });
    };
  }
  handleChange(key, value) {
    return () => {
      this.setState({
        [key]: value,
      });
    };
  }
  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <Grid container direction="row" justify="space-between">
            <Grid item >
              <Grid container direction="row" justify="space-between">

                <Grid item className={this.props.classes.label} > # Atoms </Grid>
                <Grid item>
                  <Button
                    className={this.props.classes.button}
                    onClick={this.handleDiff('nrAtoms', -1)}
                    disabled={this.state.nrAtoms < 2}
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
              {_.range(10).map((index, i) => (
                <TableRow key={`row_${i}`}>
                  <TableCell> {i} </TableCell>
                  <TableCell> {this.state.prototypeComposition} </TableCell>
                  <TableCell> HERE BE DRAGONS </TableCell>
                  <TableCell> HERE BE DRAGONS </TableCell>
                  <TableCell> HERE BE DRAGONS </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

PrototypeExplorer.propTypes = {
  classes: PropTypes.object,
  onRequestSort: PropTypes.func,
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
