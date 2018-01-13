/*
 *
 * EnergiesPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import Script from 'react-load-script';


import * as actions from './actions';
import EnergiesPageInput from './Input';
import MatchingReactions from './MatchingReactions';
import { ReactionStructures } from './ReactionStructures';

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {/* Required for ChemDoodle later below */}
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="https://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js" />

        <EnergiesPageInput {...this.props} />
        <MatchingReactions />
        <ReactionStructures {...this.props} />
      </div>
    );
  }
}

EnergiesPage.propTypes = {
};

const mapStateToProps = (state) => ({
  selectedReaction: state.get('energiesPageReducer').selectedReaction,
  matchingReactions: state.get('energiesPageReducer').matchingReactions,
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
  searchSubmitted: state.get('energiesPageReducer').searchSubmitted,
  searchParams: state.get('energiesPageReducer').searchParams,
  filter: state.get('energiesPageReducer').filter,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergiesPage);
