/*
 *
 * ScalingRelationsPage
 *
 */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Plot from 'react-plotly.js';
import { FormGroup } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { MdSearch } from 'react-icons/lib/md';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';

import ReactionAutosuggest from './ReactionAutosuggest';

const initialState = {
  reaction1: '',
  reaction2: '',
  reactionsSuggestions: [],
  systems: [],
  loading: false,
  scatterData: {},
};

const styles = (theme) => ({
  mainPaper: {
    minHeight: 200,
    padding: 15,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
    float: 'left',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  input: {
    padding: '10 20 10 20',
    float: 'left',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  suggestion: {
    display: 'block',
    zIndex: 10,
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    zIndex: 10,
  },
  textField: {
    width: '100%',
  },
});

function reactionQuery(products) {
  return {
    ttl: 300,
    query: `{
  reactions(products:"~${products}") {
    totalCount
    edges {
      node {
        Equation
        reactants
        products
        reactionEnergy
        chemicalComposition
        reactionSystems {
          id
          name
        }
      }
    }
  }
} ` };
}

const mergeReactions = (reactions1, reactions2) => {
  let systems = {};
  let tempL;

  reactions1.map((reaction) => _.get(reaction, 'node.reactionSystems', []).map((system) => {
    if (system.name === 'star') {
      tempL = (systems[system.id] || []);
      tempL.push(reaction);
      systems[system.id] = tempL;
    }
    return null;
  }));


  reactions2.map((reaction) => _.get(reaction, 'node.reactionSystems', []).map((system) => {
    if (system.name === 'star') {
      tempL = (systems[system.id] || []);
      tempL.push(reaction);
      systems[system.id] = tempL;
    }
    return null;
  }));

  systems = _.fromPairs(
    _.toPairs(systems)
    .filter((x) => x[1].length === 2
    ));


  return systems;
};


export class ScalingRelationsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = initialState;
    this.fetchAllReactions = this.fetchAllReactions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setSubstate = this.setSubstate.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getStructures = this.getStructures.bind(this);
  }

  componentDidMount() {
    this.fetchAllReactions();
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }



  getStructures() {
  }


  setSubstate(key, value) {
    this.setState({
      [key]: value,
    });
  }

  submitForm() {
    const reaction1 = _.get(this.state, 'reaction1.reaction.0.node', false);
    const reaction2 = _.get(this.state, 'reaction2.reaction.0.node', false);
    if (reaction1 && reaction2) {
      this.setState({
        loading: true,
      });
      const reactants1 = Object.keys(JSON.parse(reaction1.reactants)).join('+');
      const reactants2 = Object.keys(JSON.parse(reaction2.reactants)).join('+');
      const products1 = Object.keys(JSON.parse(reaction1.products)).join('+');
      const products2 = Object.keys(JSON.parse(reaction2.products)).join('+');

      const query1 = reactionQuery(reactants1 + products1);
      const query2 = reactionQuery(reactants2 + products2);

      cachios.post(newGraphQLRoot, query1).then((response1) => {
        cachios.post(newGraphQLRoot, query2).then((response2) => {
          const systems = mergeReactions(
            response1.data.data.reactions.edges,
            response2.data.data.reactions.edges,
          );

          const scatterData = {
            type: 'scatter',
            mode: 'markers',
            customdata: [],
            x: [],
            y: [],
            text: [],
          };

          Object.values(systems).map((system) => {
            scatterData.customdata.push(system[0].id);
            scatterData.x.push(system[0].node.reactionEnergy);
            scatterData.y.push(system[1].node.reactionEnergy);
            scatterData.text.push(`(${system[0].node.reactionEnergy}, ${system[1].node.reactionEnergy}) eV ${system[0].node.chemicalComposition}`);
            return null;
          });

          this.setState({
            systems,
            scatterData,
            loading: false,
          });
        });
      });
    }
  }


  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  fetchAllReactions() {
    const query = {
      ttl: 300,
      query: `{
  reactions(reactants:"~", products:"~", distinct: true) {
    totalCount
    edges {
      node {
        Equation
        reactants
        products
      }
    }
  }
}` };

    this.setState({
      loading: true,
    });

    cachios.post(newGraphQLRoot, query).then((response) => {
      this.setState({
        reactionsSuggestions: response.data.data.reactions.edges,
        loading: false,
      });
    });
  }

  matchReactionEnergies() {

  }

  render() {
    return (
      <div>
        {!this.state.loading ? null : <LinearProgress />}
        <Paper
          className={this.props.classes.mainPaper}
        >
          <h2>Scaling Relations</h2>
          <FormGroup row>
            <ReactionAutosuggest field="reaction1" reactionsSuggestions={this.state.reactionsSuggestions} setSubstate={this.setSubstate} submitForm={this.submitForm} label="Reaction 1" autofocus initialValue="" />
            <ReactionAutosuggest field="reaction2" reactionsSuggestions={this.state.reactionsSuggestions} setSubstate={this.setSubstate} submitForm={this.submitForm} label="Reaction 2" initialValue="" />
            <Button
              disabled={_.get(this.state, 'reaction1.reaction', false) ||
                  _.get(this.state, 'reaction2.reaction', false)
              }
              color="primary"
              onClick={() => { this.submitForm(); }}
              raised
            >
              <MdSearch /> Search

            </Button>
          </FormGroup>
          { this.state.systems.length === 0 ? null :
          <Plot
            data={[
              this.state.scatterData,

            ]}
            layout={{

            }}
            config={{
            }}
            onClick={(event) => {
              this.getStructures(event);
            }}
          />
          }
        </Paper>
      </div>
    );
  }
}

ScalingRelationsPage.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = () => ({

});

const mapDispatchToProps = () => ({
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ScalingRelationsPage)
);
