/*
 *
 * ActivityMapsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import Script from 'react-load-script';
import Slide from 'material-ui/transitions/Slide';

import ActivityMaps from './ActivityMaps';
import * as actions from './actions';

export class ActivityMapsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Script url="/static/ChemDoodleWeb.js" />
        <Slide
          onMountEnter
          onUnmountExit
          in
          direction="left"
        >
          <ActivityMaps {...this.props} />
        </Slide>
      </div>
    );
  }
}

ActivityMapsPage.propTypes = {
};

const mapStateToProps = (state) => ({
  selectedSystem: state.get('activityMapsPageReducer').selectedSystem,
  systems: state.get('activityMapsPageReducer').systems,
  structures: state.get('activityMapsPageReducer').structures,
});

const mapDispatchToProps = (dispatch) => ({
  clickDot: (dot) => {
    dispatch(actions.clickDot(dot));
  },
  saveSystems: (systems) => {
    dispatch(actions.saveSystems(systems));
  },
  saveStructures: (structures) => {
    dispatch(actions.saveStructures(structures));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMapsPage);
