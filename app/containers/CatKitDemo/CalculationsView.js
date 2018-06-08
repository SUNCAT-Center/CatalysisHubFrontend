import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  MdDelete,
  MdFileDownload } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';


import * as moment from 'moment/moment';

import axios from 'axios';
import { apiRoot } from 'utils/constants';
import { styles } from './styles';

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

    const date = moment().format('YYYYMMDD_HHmmss');
    const zip = new JSZip();
    const dir = zip.folder(`calc_${date}`);
    let adsDir;
    let bulkDir;
    let bulkStr;
    let cdir;
    let format;
    let gasDir;
    let layers;
    let miller;
    let slabDir;
    let termination;
    let vacuum;

    dir.file('calculations.json', JSON.stringify(this.props.calculations, null, 4));

    this.props.calculations.map((calculation) => {
      cdir = dir
               .folder(calculation.bulkParams.format)
               .folder('xcFunctional');

      format = calculation.bulkParams.format;
      gasDir = cdir.folder('gas');
      _.forOwn(_.get(calculation, 'adsorbateParams.molecules', {}),
        (value, key) => {
          gasDir.file(`${key}.${format}`, value);
        }
      );

      bulkStr = `${calculation.bulkParams.elements.join('')
        }_${calculation.bulkParams.wyckoff.name}`;

      bulkDir = cdir.folder(bulkStr);
      format = calculation.bulkParams.format;
      bulkDir.file(`bulk.${format}`, calculation.bulkParams.input);
      miller = `${calculation.slabParams.millerX}${calculation.slabParams.millerY}${calculation.slabParams.millerZ}`;
      vacuum = calculation.slabParams.vacuum;
      layers = calculation.slabParams.layers;
      termination = calculation.slabParams.termination;
      slabDir = bulkDir.folder(`${miller}_layers:${layers}_termination:${termination}_vacuum:${vacuum}`);
      slabDir.file(`empty_slab.${format}`, calculation.slabParams.input);
      return calculation.adsorbateParams.inputs.map((cif, i) => {
        adsDir = slabDir.folder(calculation.adsorbateParams.equations[i]);
        return adsDir.file(`${calculation.adsorbateParams.adsorbate}.${format}`, cif);
      });
    });

    zip.generateAsync({ type: 'blob' }).then((zipFile) => {
      saveAs(zipFile, `calculations_${date}.zip`);
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
                  <TableCell padding="none">Miller</TableCell>
                  <TableCell padding="none">Layers</TableCell>
                  <TableCell padding="none">Termination</TableCell>
                  <TableCell padding="none">Vacuum</TableCell>
                  <TableCell padding="none">Adsorbates</TableCell>
                  <TableCell padding="none">Input Format</TableCell>
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
                    <TableCell padding="none">{`${calculation.adsorbateParams.adsorbate}@${calculation.adsorbateParams.siteType} [${calculation.adsorbateParams.cifs.length} sites]`} </TableCell>
                    <TableCell padding="none">{`
            ${calculation.bulkParams.format}
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
                        <MdDelete
                          onClick={() => { this.removeCalculation(i); }}
                        />
                      </Button>
                      {(this.props.openCalculation === i) ?
                        <Button
                          fab mini
                          className={this.props.classes.actionIcon}
                        >
                          <MdClose
                            onClick={() => { this.props.setOpenCalculation(-1); }}
                          />
                        </Button>
                        : null}
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
        {this.state.loading ? <LinearProgress className={this.props.classes.progress} /> : null }
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
