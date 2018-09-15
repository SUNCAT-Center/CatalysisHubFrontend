/*
 *
 * BulkGenerator
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Slide from 'material-ui/transitions/Slide';

import { MdChevronLeft, MdChevronRight } from 'react-icons/lib/md';
import { isMobileOnly } from 'react-device-detect';

import * as snackbarActions from 'containers/AppSnackBar/actions';

import { styles } from './styles';
import * as actions from './actions';
import BulkEnumeratorHeader from './bulkEnumeratorHeader';
import CellParameterInput from './CellParameterInput';
import WyckoffInput, { elements } from './WyckoffInput';


const initialState = {
  spacegroup: 1,
};

function getSteps() {
  return [
    'Configure Wyckoff Points',
    'Configure Cell Parameters',
  ];
}

function nextStepReady(step, props) {
  switch (step) {
    case 0:
      if (props.wyckoffList.length === 0) {
        return 'No spacegroup set.';
      } else if (props.wyckoffPoints.length === 0) {
        return 'No Wyckoff point set.';
      } else if (props.wyckoffPoints.filter((point) => elements.indexOf(point.species) === -1).length === 0) {
        return true;
      }
      return `${JSON.stringify(props.wyckoffPoints.filter((point) => elements.indexOf(point.species) === -1).map((point) => point.species || '<empty>').join(', '))} not valid element(s).`;

    case 1:
      return 'There is not next step, yet.';

    default:
      return false;
  }
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return (
        <WyckoffInput {...props} />
      );
    case 1: {
      return (
        <CellParameterInput />
      );
    }
    default:
      return `Unkown step ${step}`;
  }
}

export class BulkGenerator extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  handleNext = () => {
    const message = nextStepReady(this.props.activeStep, this.props);
    if (message === true) {
      this.props.stepperHandleNext();
    } else {
      this.props.openSnackbar(message);
    }
  }

  handleReset = () => {
    this.props.stepperHandleReset();
  }

  handleBack = () => {
    this.props.stepperHandleBack();
  }

  render() {
    const steps = getSteps();
    return (
      <Slide
        mountOnEnter
        unmountOnExit
        in
        direction="left"
      >
        <div>
          <Helmet>
            <title>Wyckoff Bulk Generator</title>
            <meta name="description" content="Wyckoff Bulk Generator is an online tools that helps in creating arbitrary atomistic bulk structure using the symmetry derived primitives of spacegroups and Wyckoff positions." />
            <meta name="keywords" content="wyckoff, spacegroups, symmetry, bulk structure, atoms, nano technology, crystall structure, crystallography, cif, ankit jain, suncat, stanford" />
          </Helmet>
          <BulkEnumeratorHeader />
          <Paper className={this.props.classes.stepperPaper}>
            <Grid
              container
              justify="space-between"
              direction="row"
              className={this.props.classes.buttongrid}
            >
              <Grid item>
                <Stepper activeStep={this.props.activeStep} className={this.props.classes.stepper} orientation={isMobileOnly ? 'vertical' : 'horizontal'}>
                  {steps.map((label) => {
                    const props = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...props}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Grid>
              <Grid item>
                <Button
                  className={this.props.classes.button}
                  disabled={this.props.activeStep === 0}
                  onClick={this.handleBack}
                >
                  <MdChevronLeft /> Back
                </Button><Button
                  raised
                  className={this.props.classes.button}
                  color="primary"
                  onClick={this.handleNext}
                >
                Next <MdChevronRight />
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={this.props.classes.paper} height={12}>
            {getStepContent(this.props.activeStep, this.props)}
          </Paper>

          <Paper className={this.props.classes.stepperPaper}>
            <Grid
              container
              justify="space-between"
              direction="row"
              className={this.props.classes.buttongrid}
            >
              <Grid item>
                <Stepper activeStep={this.props.activeStep} className={this.props.classes.stepper} orientation={isMobileOnly ? 'vertical' : 'horizontal'}>
                  {steps.map((label) => {
                    const props = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...props}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Grid>
              <Grid item>
                <Button
                  className={this.props.classes.button}
                  disabled={this.props.activeStep === 0}
                  onClick={this.handleBack}
                >
                  <MdChevronLeft /> Back
                </Button><Button
                  raised
                  className={this.props.classes.button}
                  color="primary"
                  onClick={this.handleNext}
                >
                Next <MdChevronRight />
                </Button>
              </Grid>
            </Grid>
          </Paper>

        </div>
      </Slide>
    );
  }
}

BulkGenerator.propTypes = {
  classes: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  stepperHandleNext: PropTypes.func.isRequired,
  stepperHandleBack: PropTypes.func.isRequired,
  stepperHandleReset: PropTypes.func.isRequired,

  openSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  spacegroup: state.get('bulkGeneratorReducer').spacegroup,
  wyckoffList: state.get('bulkGeneratorReducer').wyckoffList,
  wyckoffPoints: state.get('bulkGeneratorReducer').wyckoffPoints,
  cellParameters: state.get('bulkGeneratorReducer').cellParameters,
  bulkStructure: state.get('bulkGeneratorReducer').bulkStructure,
  activeStep: state.get('bulkGeneratorReducer').activeStep,
  name: state.get('bulkGeneratorReducer').name,
  permutations: state.get('bulkGeneratorReducer').permutations,
});

const mapDispatchToProps = (dispatch) => ({
  setSpacegroup: (spacegroup) => {
    dispatch(actions.setSpacegroup(spacegroup));
  },
  stepperHandleNext: () => {
    dispatch(actions.stepperHandleNext());
  },
  stepperHandleBack: () => {
    dispatch(actions.stepperHandleBack());
  },
  stepperHandleReset: () => {
    dispatch(actions.stepperHandleReset());
  },
  receiveBulkStructure: (bulkStructure) => {
    dispatch(actions.receiveBulkStructure(bulkStructure));
  },
  setCellParameters: (cellParameters) => {
    dispatch(actions.setCellParameters(cellParameters));
  },
  openSnackbar: (message) => {
    dispatch(snackbarActions.open(message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(BulkGenerator));
