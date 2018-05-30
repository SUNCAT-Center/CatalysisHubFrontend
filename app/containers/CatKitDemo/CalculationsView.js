import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import FileDownload from 'react-file-download';

/* import IconButton from 'material-ui/IconButton';*/

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { MdClear,
  MdEdit,
  MdClose,
  MdContentCopy,
  MdFileDownload } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';


import * as moment from 'moment/moment';

import axios from 'axios';
import { apiRoot } from 'utils/constants';
import { styles } from './styles';

const backendRoot = `${apiRoot}/apps/catKitDemo`;
const url = `${backendRoot}/generate_dft_input`;

const fireworksRoot = `${apiRoot}/apps/fireworks`;
const fireworksUrl = `${fireworksRoot}/schedule_workflows`;

const initialState = {
  loading: false,
};


class CalculationsView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.clearCalculations = this.clearCalculations.bind(this);
    this.removeCalculation = this.removeCalculation.bind(this);
    this.editCalculation = this.editCalculation.bind(this);
    this.downloadCalculations = this.downloadCalculations.bind(this);
    this.queueCalculations = this.queueCalculations.bind(this);
  }
  clearCalculations() {
    this.props.clearCalculations();
  }
  removeCalculation(n) {
    this.props.removeCalculation(n);
    if (this.props.openCalculation === n) {
      this.props.setOpenCalculation(-1);
    } else if (this.props.openCalculation > n) {
      this.props.setOpenCalculation(this.props.openCalculation - 1);
    }
  }

  copyCalculation(n) {
    this.props.copyCalculation(n);
    if (this.props.openCalculation > n) {
      this.props.setOpenCalculation(this.props.openCalculation + 1);
    }
  }

  editCalculation(n) {
    this.props.editCalculation(n);
    this.props.stepperHandleReset();
  }

  downloadCalculations() {
    this.setState({
      loading: true,
    });
    const params = { params: {
      calculations: JSON.stringify(this.props.calculations),
    },
      responseType: 'arraybuffer',
    };
    axios.get(url, params).then((response) => {
      FileDownload(response.data, `calculations_${moment().format('YYYYMMDD_HHmmss')}.zip`);
    });
    this.setState({ loading: false });
  }

  queueCalculations() {
    const params = { params: {
      calculations: JSON.stringify(this.props.calculations),
    } };
    axios.get(fireworksUrl, params).then(() => {
    });
  }

  render() {
    return (
      <div>
        {this.props.calculations.length === 0 ? null :
        <Slide
          in
          mountOnEnter
          unmountOnExit
          direction="up"
        >
          <Paper className={this.props.classes.paper} height={8}>
            <h4>Stored Calculations</h4>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="none">Prototype</TableCell>
                  <TableCell padding="none">Composition</TableCell>
                  <TableCell padding="none">Facet</TableCell>
                  <TableCell padding="none">Layers</TableCell>
                  <TableCell padding="none">Termination</TableCell>
                  <TableCell padding="none">Vacuum</TableCell>
                  <TableCell padding="none">Adsorbates</TableCell>
                  <TableCell padding="none">Calculator</TableCell>
                  <TableCell padding="none"></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.calculations.map((calculation, i) => (
                  <TableRow
                    key={`calculation_${i}`}
                    className={(this.props.openCalculation === i)
                          ? this.props.classes.highlightedRow
                          : this.props.classes.row}
                  >
                    <TableCell padding="none">{_.get(calculation, 'bulkParams.wyckoff.name', '???')}</TableCell>
                    <TableCell padding="none">{`
            [${calculation.bulkParams.elements.join(', ')}]
              `}</TableCell>
                    <TableCell padding="none">{
              `(
              ${calculation.slabParams.millerX},
              ${calculation.slabParams.millerY},
              ${calculation.slabParams.millerZ}
            )`
            }</TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.layers}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.termination}`} </TableCell>
                    <TableCell padding="none">{`${calculation.slabParams.vacuum}`} </TableCell>
                    <TableCell padding="none">{`${calculation.adsorbateParams.adsorbate}@${calculation.adsorbateParams.siteType}`} </TableCell>
                    <TableCell padding="none">{`
            ${calculation.dftParams.calculator}/${calculation.dftParams.functional}
            `}</TableCell>
                    <TableCell padding="none">
                      <Button
                        fab
                        mini
                        className={this.props.classes.actionIcon}
                      >
                        <MdEdit
                          onClick={() => { this.editCalculation(i); }}
                        />
                      </Button>
                      <Button
                        className={this.props.classes.actionIcon}
                        fab
                        mini
                      >
                        <MdContentCopy
                          onClick={() => { this.copyCalculation(i); }}
                        />
                      </Button>
                      <Button
                        fab
                        mini
                        className={this.props.classes.actionIcon}
                      >
                        <MdClose
                          onClick={() => { this.removeCalculation(i); }}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Grid container justify="flex-end" direction="row">
              <Grid item>
                <Button raised onClick={this.clearCalculations} color="inherit" className={this.props.classes.button}><MdClear /> {'\u00A0'}Clear</Button>
              </Grid>
              <Grid item>
                <Button
                  raised
                  onClick={this.downloadCalculations}
                  className={this.props.classes.button}
                  color="primary"
                ><MdFileDownload />{'\u00A0'} Download</Button>
              </Grid>
              {/*
              <Grid item>
                <Button
                  raised
                  onClick={() => {this.queueCalculations()}}
                  color="primary"
                  className={this.props.classes.button}
                ><MdCloud />{'\u00A0'} Queue</Button>
              </Grid>
              */}
            </Grid>

          </Paper>
        </Slide>
        }
        {this.state.loading ? <LinearProgress className={this.state.classes.progress} /> : null }
      </div>
    );
  }
}

CalculationsView.propTypes = {
  calculations: PropTypes.array,
  clearCalculations: PropTypes.func,
  removeCalculation: PropTypes.func,
  copyCalculation: PropTypes.func,
  openCalculation: PropTypes.number,
  setOpenCalculation: PropTypes.func,
  editCalculation: PropTypes.func,
  stepperHandleReset: PropTypes.func,
  classes: PropTypes.object,
};

module.exports = {
  CalculationsView: withStyles(styles, { withTheme: true })(CalculationsView),
};
