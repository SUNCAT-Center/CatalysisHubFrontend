/**
*
* Profile
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { Link } from 'react-router';

import { LinearProgress } from 'material-ui/Progress';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

import * as actions from './actions';
import ReactionEnergies from './ReactionEnergies';
import { ReactionStructures } from './ReactionStructures';


/* Turn the first letter of a string into uppercase*/
/* and the rest into lower case*/
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


/* Turn the author name provided as slug in URL*/
/* into form typically used in citation reference*/
function toAuthorFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  res = [res[res.length - 1]].concat(res.slice(0, 1)).join('@ ').replace('@', ',').replace(/@/g, ' ');
  return res;
}


/* Turn the authorname provided as slug in URL*/
/* into form presentable as title at top of page*/
function toTitleFormat(s) {
  let res;
  res = s.split('-');
  res = res.map(toTitleCase);
  return res.join(' ');
}

function toSlugFormat(s) {
  return s.split(',')
    .reverse()
    .map((x) => x.trim())
    .join(' ')
    .replace('.', '')
    .replace(/\s/g, '-')
    .toLowerCase();
}

class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      totalCount: -1,
      systems: [],
      reactionEnergies: [],
      loading: true,
      allAuthors: [],
    };
  }
  componentDidMount() {
    this.reloadData();
  }
  reloadData() {
    const allAuthorsQuery = `{catapp(publication_Authors:"~", distinct: true) {
  totalCount
  edges {
    node {
      
      PublicationAuthors
    }
  }
}}`;


    axios.post(graphQLRoot, { query: allAuthorsQuery })
      .then((response) => {
        this.setState({
          allAuthors:
          [...new Set(
            [].concat.apply([], response.data.data.catapp.edges.map((edge) => (JSON.parse(edge.node.PublicationAuthors.replace(/'/g, '"')
.replace('.', '')
.replace('\\\\o', 'o')
.replace('{\\o}', 'o')
.replace('\\o}', 'o')
.replace('\\o', 'o')
.replace('o', 'o')
.replace('{"u}', 'u')
.replace('{"a}', 'a')
.replace('{\\x07e}', 'e')
.replace('{\\u0007e}', 'e')
.replace('{e}', 'e')
.replace('.', '')
            ))))
            .map((x) => x.replace('.', ''))
            .map((x) => x.replace('{\\o}', 'o'))
            .map((x) => x.replace('\\o}', 'o'))
            .map((x) => x.replace('\\o', 'o'))
            .map((x) => x.replace('{"u}', 'u'))
            .map((x) => x.replace('{"a}', 'a'))
            .map((x) => x.replace('{e}', 'e'))
            .map((x) => x.replace('.', ''))
          )].sort(),
        });
      });

    if (this.props.routeParams.name) {
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
    } else {
      this.setState({
        totalCount: 0,
      });
    }
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
        <div>
          <h2>All Authors</h2>
          <ul>
            {this.state.allAuthors.map((author, i) => (
              <li key={`li_${i}`}>
                <Link key={`link_${i}`} to={`/profile/${toSlugFormat(author)}`}> {author} </Link> </li>
            ))}
          </ul>
        </div>
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
          <h2>All Authors</h2>
          <ul>
            {this.state.allAuthors.map((author, i) => (
              <li key={`li_${i}`}>
                <Link
                  to={`/profile/${toSlugFormat(author)}`}
                  onClick={() => {
                    this.reloadData();
                  }}
                > {author} </Link>
              </li>
            ))}
          </ul>
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
