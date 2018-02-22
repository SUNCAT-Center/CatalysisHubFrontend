/**
 *
 * ActivityMapOer
 *
 */

import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import _ from 'lodash';

import axios from 'axios';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';
import { flaskRoot, newGraphQLRoot } from 'utils/constants';


import * as actions from './actions';
import plotlydata from './plot_data/OER.json';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },

});

const initialState = {
  plotlyData: plotlydata,
  loading: false,
};


class ActivityMapOer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getSystems = this.getSystems.bind(this);
    this.clickDot = this.clickDot.bind(this);
    this.getStructures = this.getStructures.bind(this);
  }
  async componentDidMount() {
    this.getSystems();
  }

  getSystems() {
    const backendRoot = `${flaskRoot}/apps/activityMaps`;
    const url = `${backendRoot}/systems`;
    const params = { params: {} };
    axios.get(url, params).then((response) => {
      const systems = response.data.systems;
      this.props.saveSystems(systems);

      const scatterData = {
        type: 'scatter',
        mode: 'markers',
        name: '',
        customdata: [],
        text: [],
        x: [],
        y: [],
        uid: [],
        marker: { size: 12 },
      };
      systems.map((system) => {
        /* scatterData.name.push(`${system.formula} ${system.facet}`)*/
        scatterData.customdata.push({
          uid: system.uid,
          text: `${system.formula} [${system.facet}]`,
        });
        scatterData.text.push(`${system.formula} [${system.facet}]`);
        scatterData.x.push(system.x.toFixed(2));
        scatterData.y.push(system.y.toFixed(2));
        return null;
      });
      this.setState({
        plotlyData: {
          ...this.state.plotlyData,
          data: [
            scatterData,
            this.state.plotlyData.data[0],
          ],
        },
      });
    });
  }
  getStructures(event) {
    if (_.isEmpty(event.points[0].data.customdata)) {
      return {};
    }

    this.setState({
      loading: true,
    });

    const pointEvent = event.points[0];
    const query = `{reactionSystems(aseId: "${pointEvent.customdata.uid}") {
  edges {
    node{
        reactions {
          dftFunctional
          dftCode
          reactionSystems{
          name
          systems {
            Formula
            energy
            InputFile(format: "cif")
            publication {
              authors
              title
              journal
              doi
              pages
              year
            }
          }
          }
        } 
  }
}}} `;
    this.props.clearStructures();
    return axios.post(newGraphQLRoot, { query }).then((response) => response.data.data.reactionSystems.edges.map((edge) => edge.node.reactions.reactionSystems.map(({ systems, name }) => {
      const system = {
        ...systems,
        name,
        dftFunctional: edge.node.reactions.dftFunctional,
        dftCode: edge.node.reactions.dftCode,
      };
      this.props.saveStructure(system);
      return this.setState({
        loading: false,
      });
    })));
  }

  clickDot(event) {
    if (!_.isEmpty(event.points[0].data.customdata)) {
      this.props.clickDot(event);
    }
  }


  render() {
    return (
      <div>
        <Paper className={this.props.classes.paper}>
          <div ref={(el) => { this.instance = el; }}>
            <h2>Activity Map</h2>
            <Plot
              {...this.state.plotlyData}
              layout={{
                hovermode: 'closest',
                height: Math.max(Math.min(window.innerHeight * 0.6, Number.POSITIVE_INFINITY), 120),
                width: Math.max(Math.min(window.innerWidth * 0.8, 1150), 320),
                margin: { l: 20, r: 20, b: 10, t: 10 },
              }}
              config={{ scrollZoom: false,
                displayModeBar: false,
                legendPosition: true,
                showTips: false }}
              onClick={(event) => {
                this.getStructures(event);
                this.clickDot(event);
              }}
            />
          </div>
        </Paper>
        {this.state.loading ? <LinearProgress /> : null }
      </div>
    );
  }
}


ActivityMapOer.propTypes = {
  clickDot: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  saveStructure: PropTypes.func.isRequired,
  saveSystems: PropTypes.func.isRequired,
  clearStructures: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  clickDot: (dot) => {
    dispatch(actions.clickDot(dot));
  },
  saveStructure: (structure) => {
    dispatch(actions.saveStructure(structure));
  },
  clearStructures: () => {
    dispatch(actions.clearStructures());
  },
});


export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(ActivityMapOer);
