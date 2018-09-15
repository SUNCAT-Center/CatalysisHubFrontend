/*
 *
 * CatKitDemo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { MdChevronLeft, MdChevronRight } from 'react-icons/lib/md';
import { isMobileOnly } from 'react-device-detect';
import Helmet from 'react-helmet';

import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Slide from 'material-ui/transitions/Slide';

import * as snackbarActions from 'containers/AppSnackBar/actions';
import CatKitDemoHeader from './catKitDemoHeader';
import BulkInput from './BulkInput';
import { CalculationsView } from './CalculationsView';
import { BulkView } from './BulkView';
import SlabInput from './SlabInput';
import { SlabView } from './SlabView';
import AdsorbateInput from './SimpleAdsorbateInput';
import { AdsorbateView } from './AdsorbateView';
import DftInput from './DftInput';

import * as actions from './actions';
import { styles } from './styles';

function getSteps() {
  return [
    'Configure bulk structure',
    'Configure surface slab',
    'Add adsorbates',
  ];
}

function nextStepReady(step, props) {
  switch (step) {
    case 0:
      return !_.isEmpty(props.bulkCif);
    case 1:
      return !_.isEmpty(props.images);
    case 2:
      return false;
    case 3:
      return false;
    default:
      return false;
  }
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      /* return 'Make choices for bulk cell'*/
      return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div>
            <BulkInput {...props} />
            <BulkView {...props} />
          </div>
        </Slide>
      );
    case 1:
      /* return 'Make choices for surface slab'*/
      return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div>
            <SlabInput {...props} />
            <SlabView {...props} />
          </div>
        </Slide>
      );
    case 2:
      /* return 'Add some adsorbates'*/
      return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div>
            <AdsorbateInput {...props} />
            <AdsorbateView {...props} />
          </div>
        </Slide>
      );
    case 3:
      /* return 'Configure calculator'*/
      return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
          <div>
            <DftInput {...props} />
          </div>
        </Slide>
      );
    default:
      return `Unkown step ${typeof activeStep}`;
  }
}

export class CatKitDemo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  handleNext =() => {
    this.props.stepperHandleNext();
  }

  handleReset = () => {
    this.props.stepperHandleReset();
  }

  handleBack = () => {
    this.props.stepperHandleBack();
  }

  render() {
    const steps = getSteps();
    const { activeStep } = this.props;

    return (
      <div>
        <Helmet>
          <title>CatKit Generator Demo</title>
          <meta name="description" content="CatKit Generator Demo is a GUI which demonstrates show CatKit can be used to create slab geometries with adsorbates in high-symmetry sites." />
          <meta name="keywords" content="catkit, adsorption, slab generator, surface slab, adsorbates, catalysis, miller index, high symmetry sites, constraints, adsorption energies, density functional theory, input files" />
        </Helmet>
        <div >
          <div className={this.props.classes.header} >
            <CatKitDemoHeader {...this.props} />
          </div>
          <Paper className={this.props.classes.paper}>
            <Grid
              container
              justify="space-between"
              direction="row"
              className={this.props.classes.buttongrid}
            >
              <Grid item>
                <Stepper activeStep={activeStep} className={this.props.classes.lightsandhill} orientation={isMobileOnly ? 'vertical' : 'horizontal'}>
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
                  disabled={activeStep === 0 ||
                      (activeStep === 2 && _.isEmpty(this.props.slabParams))}
                  onClick={this.handleBack}
                >
                  <MdChevronLeft /> Back
                  </Button><Button
                    raised
                    className={this.props.classes.button}
                    disabled={!nextStepReady(activeStep, this.props)}
                    color="primary"
                    onClick={this.handleNext}
                  >
                  Next <MdChevronRight />
                  </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Paper className={this.props.classes.paper} height={12}>
          {getStepContent(activeStep, this.props)}
        </Paper>
        <CalculationsView {...this.props} />
      </div>
    );
  }
}

CatKitDemo.propTypes = {
  /* dispatch: PropTypes.func.isRequired,*/
  classes: PropTypes.object,
  activeStep: PropTypes.number,
  stepperHandleNext: PropTypes.func,
  stepperHandleBack: PropTypes.func,
  stepperHandleReset: PropTypes.func,
  slabParams: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  receiveBulkCif: (cif) => {
    dispatch(actions.receiveBulkCif(cif));
  },
  receiveSlabCifs: (images) => {
    dispatch(actions.receiveSlabCifs(images));
  },
  saveLatticeConstant: (latticeConstant) => {
    dispatch(actions.saveLatticeConstant(latticeConstant));
  },
  saveBulkParams: (bulkParams) => {
    dispatch(actions.saveBulkParams(bulkParams));
  },
  saveSlabParams: (slabParams) => {
    dispatch(actions.saveSlabParams(slabParams));
  },
  saveCalculation: (params) => {
    dispatch(actions.saveCalculation(params));
  },
  clearBulkParams: () => {
    dispatch(actions.clearBulkParams());
  },
  clearSlabParams: () => {
    dispatch(actions.clearSlabParams());
  },
  clearBulkCif: () => {
    dispatch(actions.clearBulkCif());
  },
  clearSlabCifs: () => {
    dispatch(actions.clearSlabCifs());
  },
  clearCalculations: () => {
    dispatch(actions.clearCalculations());
  },
  setOpenCalculation: (n) => {
    dispatch(actions.setOpenCalculation(n));
  },
  editCalculation: (n) => {
    dispatch(actions.editCalculation(n));
  },
  copyCalculation: (n) => {
    dispatch(actions.copyCalculation(n));
  },
  removeCalculation: (n) => {
    dispatch(actions.removeCalculation(n));
  },
  saveAdsorptionSites: (adsorptionSites) => {
    dispatch(actions.saveAdsorptionSites(adsorptionSites));
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
  saveAltLabels: (altLabels) => {
    dispatch(actions.saveAltLabels(altLabels));
  },
  forgetCustomBulk: () => {
    dispatch(actions.forgetCustomBulk());
  },
  forgetCustomSlab: () => {
    dispatch(actions.forgetCustomSlab());
  },
  dropSlabInput: (file) => {
    dispatch(actions.dropSlabInput(file));
  },
  dropBulkInput: (file) => {
    dispatch(actions.dropBulkInput(file));
  },
  saveSiteOccupations: (siteOccupations) => {
    dispatch(actions.saveSiteOccupations(siteOccupations));
  },
  clearSiteOccupations: () => {
    dispatch(actions.clearSiteOccupations());
  },
  appendSiteOccupation: (siteOccupation) => {
    dispatch(actions.appendSiteOccupation(siteOccupation));
  },
  openSnackbar: (message) => {
    dispatch(snackbarActions.open(message));
  },
  saveAdsorbateParams: (adsorbateParams) => {
    dispatch(actions.saveAdsorbateParams(adsorbateParams));
  },
});

const mapStateToProps = (state) => ({
  bulkCif: state.get('catKitDemoReducer').bulkCif,
  images: state.get('catKitDemoReducer').images,
  latticeConstant: state.get('catKitDemoReducer').latticeConstant,
  bulkParams: state.get('catKitDemoReducer').bulkParams,
  slabParams: state.get('catKitDemoReducer').slabParams,
  calculations: state.get('catKitDemoReducer').calculations,
  openCalculation: state.get('catKitDemoReducer').openCalculation,
  adsorptionSites: state.get('catKitDemoReducer').adsorptionSites,
  activeStep: state.get('catKitDemoReducer').activeStep,
  altLabels: state.get('catKitDemoReducer').altLabels,
  customBulkInput: state.get('catKitDemoReducer').customBulkInput,
  customSlabInput: state.get('catKitDemoReducer').customSlabInput,
  siteOccupations: state.get('catKitDemoReducer').siteOccupations,
  adsorbateParams: state.get('catKitDemoReducer').adsorbateParams,
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(CatKitDemo)
);
