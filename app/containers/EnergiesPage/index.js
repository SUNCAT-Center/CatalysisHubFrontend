/*
 *
 * EnergiesPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import { selectReaction,
  receiveReactions,
  receiveSystems,
  clearSystems,
  saveSystem,
  submitSearch,
} from './actions';
import EnergiesPageInput from './Input';
import MatchingReactions from './MatchingReactions';
import { ReactionStructures } from './ReactionStructures';
import Script from 'react-load-script';
import foo from 'react-chemdoodle-web';

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
  console.log(foo);
    return (
      <div>
        <Script
          url="https://code.jquery.com/jquery-3.2.1.min.js"
        />
        <Script
          url="https://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js"
        />

        <EnergiesPageInput {...this.props} />
        <MatchingReactions {...this.props} />
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
});

const mapDispatchToProps = (dispatch) => ({
  selectReaction: (reaction) => {
    dispatch(selectReaction(reaction));
  },
  receiveReactions: (reactions) => {
    dispatch(receiveReactions(reactions));
  },
  receiveSystems: (systems) => {
    dispatch(receiveSystems(systems));
  },
  clearSystems: () => {
    dispatch(clearSystems());
  },
  saveSystem: (system) => {
    dispatch(saveSystem(system));
  },
  submitSearch: () => {
    dispatch(submitSearch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergiesPage);
