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
} from './actions';
import { EnergiesPageInput } from './Input';
import { MatchingReactions } from './MatchingReactions';
import { ReactionStructures } from './ReactionStructures';

export class EnergiesPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EnergiesPage);
