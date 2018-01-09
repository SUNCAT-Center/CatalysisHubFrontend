/*
 *
 * GeneralSearchContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import SingleStructureView from 'components/SingleStructureView';

import ResultTable from './ResultTable';
import GeneralSearchInput from './Input';
import { selectUUID, receiveResults, saveSystem } from './actions';

export class GeneralSearchContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <GeneralSearchInput {...this.props} />
        <ResultTable {...this.props} />
        <SingleStructureView {...this.props} />
      </div>
    );
  }
}

GeneralSearchContainer.propTypes = {
};

const mapStateToProps = (state) => ({
  selectedUUID: state.get('generalSearchReducer').selectedUUID,
  searchResults: state.get('generalSearchReducer').searchResults,
  selectedSystem: state.get('generalSearchReducer').selectedSystem,
});

const mapDispatchToProps = (dispatch) => ({
  selectUUID: (uuid) => {
    dispatch(selectUUID(uuid));
  },
  receiveResults: (results) => {
    dispatch(receiveResults(results));
  },
  saveSystem: (results) => {
    dispatch(saveSystem(results));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSearchContainer);
