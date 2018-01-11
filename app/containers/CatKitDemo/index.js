/*
 *
 * CatKitDemo
 *
 */

import React from 'react';
import { connect } from 'react-redux';


import { CatKitDemoHeader } from './catKitDemoHeader';
import BulkInput from './BulkInput';
import { BulkView } from './BulkView';
import SlabInput from './SlabInput';
import { SlabView } from './SlabView';
import DftInput from './DftInput';

import * as actions from './actions';

export class CatKitDemo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <CatKitDemoHeader {...this.props} />
        <BulkInput {...this.props} />
        <BulkView {...this.props} />
        <SlabInput {...this.props} />
        <SlabView {...this.props} />
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
});

const mapStateToProps = (state) => ({
  bulkCif: state.get('catKitDemoReducer').bulkCif,
  images: state.get('catKitDemoReducer').images,
  latticeConstant: state.get('catKitDemoReducer').latticeConstant,
  bulkParams: state.get('catKitDemoReducer').bulkParams,
});

export default connect(mapStateToProps, mapDispatchToProps)(CatKitDemo);
