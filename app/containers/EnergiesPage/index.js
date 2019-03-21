/*
 *
 * EnergiesPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import Script from 'react-load-script';
import Helmet from 'react-helmet';
import Slide from 'material-ui/transitions/Slide';


import * as actions from './actions';
import EnergiesPageInput from './Input';
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
          <Helmet>
            <title>Surface Reactions</title>
            <meta name="description" content="Search for first-principles reaction energies based on reactants, products, surface, or facet." />
            <meta name="keywords" content="reaction energies, activations energies, catalysis, heterogeneous catalysis, surface structure, adsorbates, search" />
          </Helmet>
          {/* Required for ChemDoodle later below */}
          <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
          <Script url="/static/ChemDoodleWeb.js" />

          <EnergiesPageInput {...this.props} />

          <MatchingReactions />
          <ReactionStructures {...this.props} />
        </div>
      </Slide>
    );
  }
}

EnergiesPage.propTypes = {
};

const mapStateToProps = (state) => ({
  loading: state.get('energiesPageReducer').loading,
  selectedReaction: state.get('energiesPageReducer').selectedReaction,
  publication: state.get('energiesPageReducer').publication,
  matchingReactions: state.get('energiesPageReducer').matchingReactions,
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
  searchSubmitted: state.get('energiesPageReducer').searchSubmitted,
  searchParams: state.get('energiesPageReducer').searchParams,
  filter: state.get('energiesPageReducer').filter,
  withGeometry: state.get('energiesPageReducer').withGeometry,
  simpleSearch: state.get('energiesPageReducer').simpleSearch,
});

const mapDispatchToProps = (dispatch) => ({
  saveLoading: (loading) => {
    dispatch(actions.saveLoading(loading));
  },
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
  savePublication: (x) => {
    dispatch(actions.savePublication(x));
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
