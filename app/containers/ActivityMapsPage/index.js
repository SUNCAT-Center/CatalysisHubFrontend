/*
 *
 * ActivityMapsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Script from 'react-load-script';
import Slide from 'material-ui/transitions/Slide';

import ActivityMaps from './ActivityMaps';
import * as actions from './actions';

export class ActivityMapsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    const reaction = this.props.routeParams.reaction;
    if (['OER', 'NRR', 'CO_Hydrogenation', 'ORR'].includes(reaction)) {
      this.props.saveReaction(reaction);
    }
  }

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
  saveReaction: PropTypes.func,
  routeParams: PropTypes.object,
};

const mapStateToProps = (state) => ({
  selectedSystem: state.get('activityMapsPageReducer').selectedSystem,
  systems: state.get('activityMapsPageReducer').systems,
  structures: state.get('activityMapsPageReducer').structures,
  reaction: state.get('activityMapsPageReducer').reaction,
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
  saveReaction: (reaction) => {
    dispatch(actions.saveReaction(reaction));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMapsPage);
