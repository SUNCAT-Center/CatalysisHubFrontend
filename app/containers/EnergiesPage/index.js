/*
 *
 * EnergiesPage
 *
 */

import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import Script from 'react-load-script';
import Slide from 'material-ui/transitions/Slide';


import * as actions from './actions';
import EnergiesPageInput from './Input';
import EnergiesPageSimpleInput from './SimpleInput';
import MatchingReactions from './MatchingReactions';
import { ReactionStructures } from './ReactionStructures';

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Slide
        mountOnEnter
        unmountOnExit
        in
        direction="left"
      >
        <div>
          {/* Required for ChemDoodle later below */}
          <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
          <Script url="/static/ChemDoodleWeb.js" />

          {this.props.simpleSearch ?
            <EnergiesPageSimpleInput />
            :
            <EnergiesPageInput {...this.props} />
        }
          <MatchingReactions />
          <ReactionStructures {...this.props} />
        </div>
      </Slide>
    );
  }
}

EnergiesPage.propTypes = {
  simpleSearch: PropTypes.bool,

};

const mapStateToProps = (state) => ({
  selectedReaction: state.get('energiesPageReducer').selectedReaction,
  matchingReactions: state.get('energiesPageReducer').matchingReactions,
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
  searchSubmitted: state.get('energiesPageReducer').searchSubmitted,
  searchParams: state.get('energiesPageReducer').searchParams,
  filter: state.get('energiesPageReducer').filter,
  withGeometry: state.get('energiesPageReducer').withGeometry,
  simpleSearch: state.get('energiesPageReducer').simpleSearch,
});

const mapDispatchToProps = (dispatch) => ({
  selectReaction: (reaction) => {
    dispatch(actions.selectReaction(reaction));
  },
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  receiveSystems: (systems) => {
    dispatch(actions.receiveSystems(systems));
  },
  clearSystems: () => {
    dispatch(actions.clearSystems());
  },
  saveSystem: (system) => {
    dispatch(actions.saveSystem(system));
  },
  submitSearch: (params) => {
    dispatch(actions.submitSearch(params));
  },
  updateFilter: (field, value) => {
    dispatch(actions.updateFilter(field, value));
  },
  toggleGeometry: () => {
    dispatch(actions.toggleGeometry());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergiesPage);
