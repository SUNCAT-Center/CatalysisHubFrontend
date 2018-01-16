import React from 'react';
import PropTypes from 'prop-types';


import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { MdClear, MdEdit, MdClose, MdFileDownload } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';

const styles = (theme) => ({
  buttonList: {
    flex: 1,
    flexDirection: 'row',
    justify: 'flex-end',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class CalculationsView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.clearCalculations = this.clearCalculations.bind(this);
    this.removeCalculation = this.removeCalculation.bind(this);
  }
  clearCalculations() {
    this.props.clearCalculations();
  }
  removeCalculation(n) {
    this.props.removeCalculation(n);
  }

  render() {
    return (
      <div>
        {this.props.calculations.length === 0 ? null :
        <div>
          <h2>Stored Calculations</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none">Lattice</TableCell>
                <TableCell padding="none">Composition</TableCell>
                <TableCell padding="none">Facet</TableCell>
                <TableCell padding="none">Adsorbates</TableCell>
                <TableCell padding="none">Calculator</TableCell>
                <TableCell padding="none"><MdEdit /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.calculations.map((calculation, i) => (
                <TableRow key={`calculation_${i}`}>
                  <TableCell padding="none">{calculation.bulkParams.structure}</TableCell>
                  <TableCell padding="none">{`
            ${calculation.bulkParams.element1}
            ${calculation.bulkParams.element2}
            ${calculation.bulkParams.element3}
            ${calculation.bulkParams.element4}
              `}</TableCell>
                  <TableCell padding="none">{
              `[
              ${calculation.slabParams.miller_x},
              ${calculation.slabParams.miller_y},
              ${calculation.slabParams.miller_z}
            ]`
            }</TableCell>
                  <TableCell padding="none">TBD</TableCell>
                  <TableCell padding="none">{`
            ${calculation.dftParams.calculator}/${calculation.dftParams.functional}
            `}</TableCell>
                  <TableCell padding="none">
                    <IconButton onClick={() => { this.removeCalculation(i); }}>
                      <MdClose />
                    </IconButton>
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
          <Grid container justify="flex-end" direction="row">
            <Grid item>
              <Button raised onClick={this.clearCalculations} color="contrast" className={this.props.classes.button}><MdClear /> Clear All</Button>
            </Grid>
            <Grid item>
              <Button raised onClick={this.downloadCalculations} color="primary" className={this.props.classes.button}><MdFileDownload /> Download All</Button>
            </Grid>
          </Grid>

        </div>
      }
        <hr />
      </div>
    );
  }
}

CalculationsView.propTypes = {
  calculations: PropTypes.array,
  clearCalculations: PropTypes.func,
  removeCalculation: PropTypes.func,
  classes: PropTypes.object,
};

module.exports = {
  CalculationsView: withStyles(styles, { withTheme: true })(CalculationsView),
};
