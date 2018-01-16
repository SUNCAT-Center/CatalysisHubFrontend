/*
 *
 * CatKitDemo
 *
 */

import React from 'react';
import { connect } from 'react-redux';


import { CatKitDemoHeader } from './catKitDemoHeader';
import BulkInput from './BulkInput';
import { CalculationsView } from './CalculationsView';
import { BulkView } from './BulkView';
import SlabInput from './SlabInput';
import { SlabView } from './SlabView';
import { AdsorbateInput } from './AdsorbateInput';
import { AdsorbateView } from './AdsorbateView';
import DftInput from './DftInput';

import * as actions from './actions';

export class CatKitDemo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <CatKitDemoHeader {...this.props} />
        <CalculationsView {...this.props} />
        <BulkInput {...this.props} />
        <BulkView {...this.props} />
        <SlabInput {...this.props} />
        <SlabView {...this.props} />
        <AdsorbateInput {...this.props} />
        <AdsorbateView {...this.props} />
        <DftInput {...this.props} />
      </div>
    );
  }
}

CatKitDemo.propTypes = {
  /* dispatch: PropTypes.func.isRequired,*/
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
  removeCalculation: (n) => {
    dispatch(actions.removeCalculation(n));
  },
});

const mapStateToProps = (state) => ({
  bulkCif: state.get('catKitDemoReducer').bulkCif,
  images: state.get('catKitDemoReducer').images,
  latticeConstant: state.get('catKitDemoReducer').latticeConstant,
  bulkParams: state.get('catKitDemoReducer').bulkParams,
  slabParams: state.get('catKitDemoReducer').slabParams,
  calculations: state.get('catKitDemoReducer').calculations,
});

export default connect(mapStateToProps, mapDispatchToProps)(CatKitDemo);
