/**
*
* Profile
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import MdStars from 'react-icons/lib/md/stars';
import { LinearProgress } from 'material-ui/Progress';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

import * as actions from './actions';
import ReactionEnergies from './ReactionEnergies';
import { ReactionStructures } from './ReactionStructures';


function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


function toAuthorFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  res = [res[res.length - 1]].concat(res.slice(0, 1)).join('@ ').replace('@', ',').replace(/@/g, ' ');
  return res;
}

function toTitleFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  return res.join(' ');
}

class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      totalCount: -1,
      systems: [],
      reactionEnergies: [],
      loading: true,
    };
  }
  componentDidMount() {
    const authorQuery = `{catapp( publication_Authors:"~${toAuthorFormat(this.props.routeParams.name)}") {
    totalCount
    edges{
    node {
      dftCode
      dftFunctional
      reactants
      products
      aseIds
      facet
      chemicalComposition
      reactionEnergy
      activationEnergy
      surfaceComposition
  } } }}`;
    axios.post(graphQLRoot, { query: authorQuery })
      .then((response) => {
        this.setState({
          totalCount: response.data.data.catapp.totalCount,
        });
        this.props.receiveReactions(response.data.data.catapp.edges.map((edge) => edge.node));
      });
  }
  render() {
    if (this.state.totalCount === -1) {
      return (
        <h1>
          <LinearProgress color="primary" />
        </h1>
      );
    } else if (this.state.totalCount === 0) {
      return (
        <div>No entries found.</div>
      );
    } else { // eslint-disable-line no-else-return
      return (
        <div>
          <h1>{toTitleFormat(this.props.routeParams.name)}</h1>
          <ReactGA.OutboundLink
            eventLabel={`http://suncat.stanford.edu/theory/people/${this.props.routeParams.name}`}
            to={`http://suncat.stanford.edu/theory/people/${this.props.routeParams.name}`}
            target="_blank"
          >
          SUNCAT Profile
        </ReactGA.OutboundLink>
          <ReactionEnergies {...this.props} />
          <ReactionStructures {...this.props} />
        </div>
      );
    }
  }
}

Profile.propTypes = {
  routeParams: PropTypes.object,
  receiveReactions: PropTypes.function,
};

const mapStateToProps = (state) => ({
  reactions: state.get('profileReducer').reactions,
  reactionSystems: state.get('profileReducer').reactionSystems,
  selectedReaction: state.get('profileReducer').selectedReaction,

});

const mapDispatchToProps = (dispatch) => ({
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  saveSystem: (system) => {
    dispatch(actions.saveSystem(system));
  },
  clearSystems: () => {
    dispatch(actions.clearSystems());
  },
  selectReaction: (reaction) => {
    dispatch(actions.selectReaction(reaction));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
