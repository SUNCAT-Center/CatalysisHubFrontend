/*
 *
 * ActivityMapsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import { backendRoot } from 'utils/constants';

import ActivityMaps from './ActivityMaps';
import * as actions from './actions';

export class ActivityMapsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <ActivityMaps {...this.props} />
      </div>
    );
  }
}

ActivityMapsPage.propTypes = {
};

const mapStateToProps = (state) => ({
  selectedDot: state.get('activityMapsPageReducer').selectedDot,
  cifUrls: [
    `${backendRoot}get_cif/?path=6f_doping/${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping/addOempty/final_geo_for_db_${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping_addOempty.traj`,
    `${backendRoot}get_cif/?path=6f_doping/${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping/addOaddOH/final_geo_for_db_${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping_addOaddOH.traj`,
    `${backendRoot}get_cif/?path=6f_doping/${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping/addOaddO/final_geo_for_db_${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping_addOaddO.traj`,
    `${backendRoot}get_cif/?path=6f_doping/${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping/addOaddOOH/final_geo_for_db_${state.get('activityMapsPageReducer').selectedDot.text}_6f_doping_addOaddOOH.traj`,
  ],
});

const mapDispatchToProps = (dispatch) => ({
  clickDot: (dot) => {
    dispatch(actions.clickDot(dot));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMapsPage);
