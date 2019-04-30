/*
 *
 * ScalingRelationsPage
 *
 */

import React from 'react';
import _ from 'lodash';
import Script from 'react-load-script';
import regression from 'regression';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Plot from 'react-plotly.js';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { MdSearch } from 'react-icons/lib/md';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';

import StructureView from './StructureView';
import { styles } from './styles';

const initialState = {
  plotTitle: '',
  reaction1: {
    name: 'H2O(g) - 0.5H2(g) + * -> OH*',
    reaction: [
      { node: {
        Equation: 'H2O(g) + * -> OH* + 0.5H2(g)',
        products: '{"OHstar": 1}',
        reactants: '{"H2gas": 0.5, "star": 1, "H2Ogas": 1}',
      } },
    ],
  },
  reaction2: {
    name: '2.0H2O(g) - 1.5H2(g) + * -> OOH*',
    reaction: [
      { node: {
        Equation: '2.0H2O(g) + * -> OOH* + 1.5H2(g)',
        products: '{"OOHstar": 1}',
        reactants: '{"H2gas": 1.5, "star": 1, "H2Ogas": 2.0}',
      } }],
  },
  publication: {
    label: 'MichalLixCoO22017',
    pubId: 'MichalLixCoO22017',
  },
  reactionsSuggestions: [],
  publicationsSuggestions: [],
  systems: [],
  loading: false,
  loadingStructures: false,
  scatterData: {},
  linRegData: {},
  geometries: [],
};


function reactionQuery(reactants, products, pubId) {
  return {
    ttl: 300,
    query: `{
  reactions(reactants: "${reactants}", products:"${products}", pubId:"${pubId}") {
    totalCount
    edges {
      node {
        Equation
        reactants
        products
        reactionEnergy
        chemicalComposition
        reactionSystems {
          aseId
          name
        }
      }
    }
  }
} ` };
}

const mergeReactions = (reactions1, reactions2, equation1, equation2) => {
  let systems = {};
  let tempL;

  reactions1.map((reaction) => _.get(reaction, 'node.reactionSystems', []).map((system) => {
    if (system.name === 'star') {
      tempL = (systems[system.aseId] || []);
      if (tempL.length > 0) {
        if (tempL[0].node.reactionEnergy > reaction.node.reactionEnergy) {
          tempL[0] = reaction;
          systems[system.aseId] = tempL;
        }
      } else {
        tempL.push(reaction);
        systems[system.aseId] = tempL;
      }
    }
    return null;
  }));


  reactions2.map((reaction) => _.get(reaction, 'node.reactionSystems', []).map((system) => {
    if (system.name === 'star') {
      tempL = (systems[system.aseId] || []);
      if (tempL.length > 1) {
        if (tempL[1].node.reactionEnergy > reaction.node.reactionEnergy) {
          tempL[1] = reaction;
          systems[system.aseId] = tempL;
        }
      } else {
        tempL.push(reaction);
        systems[system.aseId] = tempL;
      }
    }
    return null;
  }));


  systems = _.fromPairs(
    _.toPairs(systems)
    .filter((x) => x[1].length >= 2
    ).filter((x) => !(
        (x[1][0].node.Equation.indexOf(equation1) > -1 && x[1][1].node.Equation.indexOf(equation1) > -1) ||
        (x[1][0].node.Equation.indexOf(equation2) > -1 && x[1][1].node.Equation.indexOf(equation2) > -1)
      )).map((x) => [
        x[0],
          [x[1][0], x[1][1]],
      ])
  );

  return systems;
};


export class ScalingRelationsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = initialState;
    this.fetchAllPublications = this.fetchAllPublications.bind(this);
    this.fetchAllReactions = this.fetchAllReactions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setSubstate = this.setSubstate.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getStructures = this.getStructures.bind(this);
  }

  componentDidMount() {
    this.fetchAllPublications();
    this.fetchAllReactions(this.state.publication.pubId);
  }

  getStructures(e) {
    this.setState({
      structures: [],
      loadingStructures: true,
    });
    const results = Object.keys(e.points[0].customdata).map(async (aseId) => cachios.post(newGraphQLRoot, { ttl: 300, query: `{systems(uniqueId:"${aseId}") {
  edges {
    node {
      id
      InputFile(format:"cif")
      numbers
      Formula
      energy
      DftCode
      DftFunctional
      publication {
        authors
        pages
        title
        journal
        doi
        volume
        year
        pubId
      }
    }
  }
}}` }).then((response) => (response.data.data.systems.edges[0].node)));
    Promise.all(results).then((structures) => {
      this.setState({
        structures: _.sortBy(structures, 'energy'),
        loadingStructures: false,
      });
    });
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

      const query1 = reactionQuery(reactants1, products1, this.state.publication.pubId);
      const query2 = reactionQuery(reactants2, products2, this.state.publication.pubId);

      cachios.post(newGraphQLRoot, query1).then((response1) => {
        cachios.post(newGraphQLRoot, query2).then((response2) => {
          const systems = mergeReactions(
            response1.data.data.reactions.edges,
            response2.data.data.reactions.edges,
            reaction1.name,
            reaction2.name,
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
            scatterData.customdata.push(_.groupBy(
              _.concat(
                system[0].node.reactionSystems,
                system[1].node.reactionSystems,
              ), 'aseId'));
            scatterData.x.push(system[0].node.reactionEnergy);
            scatterData.y.push(system[1].node.reactionEnergy);
            scatterData.text.push(`(${system[0].node.reactionEnergy.toFixed(2)}, ${system[1].node.reactionEnergy.toFixed(2)}) eV ${system[0].node.chemicalComposition}`);
            return null;
          });

          const linReg = regression.linear(
            _.zip(scatterData.x,
              scatterData.y)
          );
          const sortedX = _.sortBy(scatterData.x.concat());
          const linRegData = {
            type: 'scatter',
            mode: 'lines',
            x: [sortedX[0], sortedX[sortedX.length - 1]],
            y: [linReg.predict(sortedX[0])[1], linReg.predict(sortedX[sortedX.length - 1])[1]],
          };

          this.setState({
            plotTitle: `${linReg.string} ; r2 = ${linReg.r2}`,
            systems,
            scatterData,
            linRegData,
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

  fetchAllPublications() {
    const query = {
      ttl: 300,
      query: `{
  publications(year: 2014, op: ">", order: "-stime") {
    edges {
      node {
        title
        year
        authors
        pubId
      }
    }
  }
}` };

    this.setState({
      loading: true,
    });

    cachios.post(newGraphQLRoot, query).then((response) => {
      this.setState({
        publicationsSuggestions: response.data.data.publications.edges,
        loading: false,
      });
    });
  }

  fetchAllReactions(pubId) {
    const query = {
      ttl: 300,
      query: `{
  reactions(reactants:"~", products:"~", distinct: true, pubId:"${pubId}") {
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

  render() {
    return (
      <div>
        <Script url="/static/ChemDoodleWeb.js" />
        {!this.state.loading ? null : <LinearProgress className={this.props.classes.progressBar} />}
        <Paper
          className={this.props.classes.mainPaper}
        >
          <h2>Scaling Relations</h2>
          <div style={{ width: '75%', textAlign: 'justify' }}> Investigate the correlation between different adsorption and/or reaction energies.
            <ul>
              <li> Start by choosing a dataset. </li>
              <li> Choose two different reactions, where the reaction energies of Reaction 1 and Reaction 2 will be plotted along the x and y- axis respectively. </li>
              <li> If several adsorption sites are available for the same reaction and surface, the lowest energy site will be chosen by the appication. </li>
            </ul>
          </div>
          <form>
            <FormControl className={this.props.classes.formControl} >
              <InputLabel
                className={this.props.classes.formControl}
                htmlFor="input-format-helper"
              >
                Publication
              </InputLabel>
              <Select
                id="input-format-helper"
                value={this.state.publication.pubId}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: '75%',
                    },
                  },
                }}
                onChange={(event) => {
                  this.setState({
                    publication: {
                      pubId: event.target.value,
                      label: event.target.value,
                    },
                    reactionsSuggestions: [],
                  });
                  this.fetchAllReactions(event.target.value);
                }}
              >
                {this.state.publicationsSuggestions.map((pub, i) => (
                  <MenuItem key={`pub_${i}`} value={pub.node.pubId}>{pub.node.pubId}</MenuItem>))}
              </Select>
            </FormControl>
          </form>
          <form>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel
                className={this.props.classes.formControl}
                htmlFor="reaction1"
              >
                Reaction
              </InputLabel>
              <Select
                id="reaction1"
                value={this.state.reaction1.name}
                onChange={(event) => {
                  this.setState({
                    reaction1: {
                      reaction: [this.state.reactionsSuggestions[event.target.value]],
                      name: event.target.value,
                    },
                  });
                }}
              >
                {this.state.reactionsSuggestions.map((react1, i) => (
                  <MenuItem key={`react_${i}`} value={`${i}`}>{react1.node.Equation}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl} >
              <InputLabel
                className={this.props.classes.formControl}
                htmlFor="reaction2"
              >
                Reaction
              </InputLabel>
              <Select
                id="reaction2"
                value={this.state.reaction2.name}
                onChange={(event) => {
                  this.setState({
                    reaction2: {
                      reaction: [this.state.reactionsSuggestions[event.target.value]],
                      name: event.target.value,
                    },
                  });
                }}
              >
                {this.state.reactionsSuggestions.map((react2, i) => (
                  <MenuItem key={`react2_${i}`} value={`${i}`}>{react2.node.Equation}</MenuItem>))}
              </Select>
            </FormControl>
            <Button
              disabled={_.isEmpty(_.get(this.state, 'reaction1.reaction', [])) || _.isEmpty(_.get(this.state, 'reaction2.reaction', []))
                       }
              color="primary"
              onClick={() => { this.submitForm(); }}
              raised
            >
              <MdSearch /> Search
            </Button>
          </form>
          { this.state.systems.length === 0 ? null :
          <Grid container direction="row" justify="center">
            <Grid item>
              <Paper>
                <Plot
                  data={[
                    this.state.scatterData,
                    this.state.linRegData,
                  ]}
                  layout={{
                    hovermode: 'closest',
                    title: this.state.plotTitle,
                    xaxis: {
                      title: this.state.reaction1.reaction[0].node.Equation,
                    },
                    yaxis: {
                      title: this.state.reaction2.reaction[0].node.Equation,
                    },
                  }}
                  config={{
                    scrollZoom: false,
                    displayModeBar: false,
                    legendPosition: true,
                    showTips: false,
                  }}
                  onClick={(event) => {
                    this.getStructures(event);
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
          }
        </Paper>
        {!this.state.loadingStructures ?
            null
            : <LinearProgress
              className={this.props.classes.progressBar}
            />}
        <StructureView geoms={this.state.structures} />
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
