/**
 *
 * ActivitMapPlot
 *
 */

import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import _ from 'lodash';

import axios from 'axios';
import { flaskRoot, newGraphQLRoot } from 'utils/constants';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';


import * as actions from './actions';
import plotlyData from './plot_data/index';

import { styles } from './styles';

const initialState = {
  plotlyData: {},
  initialLoading: false,
  loading: false,
  xlabel: '',
  ylabel: '',
  zlabel: '',
  reference: '',
};


class ActivitMapPlot extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getSystems = this.getSystems.bind(this);
    this.clickDot = this.clickDot.bind(this);
    this.getStructures = this.getStructures.bind(this);
  }

  async componentWillReceiveProps(props) {
    this.getSystems();
    this.setState({
      plotlyData: plotlyData[props.reaction],
    });
  }

  getSystems() {
    this.setState({
      initialLoading: true,
    });
    const backendRoot = `${flaskRoot}/apps/activityMaps`;
    const url = `${backendRoot}/systems`;
    const params = { params: {
      activityMap: this.props.reaction,
    } };
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
          text: `${system.formula} [${system.facet}] =>`,
        });
        scatterData.text.push(`Composition: ${system.formula} | Facet: ${system.facet} | z = ${system.z.toFixed(2)}`);
        scatterData.x.push(system.x.toFixed(2));
        scatterData.y.push(system.y.toFixed(2));
        return null;
      });
      this.setState({
        xlabel: response.data.xlabel,
        ylabel: response.data.ylabel,
        zlabel: response.data.zlabel,
        reference: response.data.reference,
        plotlyData: {
          ...this.state.plotlyData,
          data: [
            this.state.plotlyData.data[0],
            scatterData,
          ],
        },
      });

      this.setState({
        initialLoading: false,
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
    this.props.saveStructureQuery(query);
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
        {this.state.initialLoading ? <LinearProgress /> : null }
        <Paper className={this.props.classes.paper}>
          <div ref={(el) => { this.instance = el; }}>
            <h2>Activity Map {this.props.reaction}</h2>
            <Plot
              {...this.state.plotlyData}
              layout={{
                hovermode: 'closest',
                height: Math.max(Math.min(window.innerHeight * 0.6, Number.POSITIVE_INFINITY), 120),
                width: Math.max(Math.min(window.innerWidth * 0.8, 1150), 320),
                margin: { l: 50, r: 10, b: 40, t: 10 },
                xaxis: {
                  title: this.state.xlabel,
                  range: [
                    Math.min(...this.state.plotlyData.data[0].x),
                    Math.max(...this.state.plotlyData.data[0].x),
                  ],
                },
                yaxis: {
                  title: this.state.ylabel,
                  range: [
                    Math.min(...this.state.plotlyData.data[0].y),
                    Math.max(...this.state.plotlyData.data[0].y),
                  ],
                  margin: [

                  ],
                },
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
          {_.isEmpty(this.state.reference) ? null :
          <div>{`${this.state.reference}`}</div>
          }
        </Paper>
        {this.state.loading ? <LinearProgress /> : null }
      </div>
    );
  }
}


ActivitMapPlot.propTypes = {
  clickDot: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  saveStructure: PropTypes.func.isRequired,
  saveSystems: PropTypes.func.isRequired,
  clearStructures: PropTypes.func.isRequired,
  saveStructureQuery: PropTypes.func.isRequired,
  reaction: PropTypes.string,
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
  saveStructureQuery: (query) => {
    dispatch(actions.saveStructureQuery(query));
  },
});


export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(ActivitMapPlot);
