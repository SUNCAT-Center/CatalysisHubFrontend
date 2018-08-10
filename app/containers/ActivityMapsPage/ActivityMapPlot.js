/**
 *
 * ActivityMapPlot
 *
 */

import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import _ from 'lodash';

import axios from 'axios';
import { apiRoot, newGraphQLRoot } from 'utils/constants';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { MdChevronLeft, MdChevronRight } from 'react-icons/lib/md';

import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';


import * as actions from './actions';
import plotlyData from './plot_data/index';

import { styles } from './styles';

const initialState = {
  plotlyData: {
    data: [{}], //  stub
  },
  scatterData: {},
  heatmapData: {},
  initialLoading: false,
  loading: false,
  xlabel: '',
  ylabel: '',
  zlabel: '',
  reference: '',
  plotPage: 0,

};

export const reactions = ['OER', 'NRR', 'CO_Hydrogenation_111', 'ORR', 'CO2RR'];

class ActivityMapPlot extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    this.getSystems = this.getSystems.bind(this);
    this.clickDot = this.clickDot.bind(this);
    this.getStructures = this.getStructures.bind(this);
    this.handlePageFlip = this.handlePageFlip.bind(this);
  }

  async componentDidMount() {
    setTimeout(() => {
      this.getSystems();
      this.setState({
        plotlyData: plotlyData[this.props.reaction],
      });
    }, 1500);
  }

  async componentWillReceiveProps(nextProps) {
    let { reaction } = nextProps.routeParams;
    if (_.isEmpty(reaction)) {
      reaction = nextProps.reaction;
    }
    if (!_.isEmpty(reaction)) {
      if (reaction !== this.props.reaction) {
        setTimeout(() => {
          this.setState({
            plotlyData: plotlyData[reaction],
          });
          this.getSystems();
        }, 1500);
      }
    }
  }

  getSystems() {
    this.setState({
      initialLoading: true,
    });
    const backendRoot = `${apiRoot}/apps/activityMaps`;
    const url = `${backendRoot}/systems/`;
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
        scatterData,
        heatmapData: this.state.plotlyData.data[this.state.plotPage],
        plotlyData: {
          ...this.state.plotlyData,
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
              pubId
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

  handlePageFlip(delta) {
    const n = this.state.plotlyData.data.length;
    const plotPage = (((this.state.plotPage + delta) % n) + n) % n;
    this.setState({
      plotPage,
      heatmapData: this.state.plotlyData.data[plotPage],
      // javascript version of modulo that works for positive and negative
      // input.
    });
  }

  clickDot(event) {
    if (!_.isEmpty(event.points[0].data.customdata)) {
      this.props.clickDot(event);
    }
  }


  render() {
    return (
      <div>
        {this.state.initialLoading ? <LinearProgress className={this.props.classes.progress} /> : null }
        <Paper className={this.props.classes.paper}>
          <div ref={(el) => { this.instance = el; }}>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <h2>Activity Map {this.props.reaction.replace(/_/g, ' ')}</h2>
              </Grid>
              <Grid item>
                <FormControl>
                  <Select
                    value={this.props.reaction}
                    onChange={(event) => {
                      this.props.saveReaction(event.target.value);
                    }}
                  >
                    {
                    reactions.map((reaction, i) => (
                      <MenuItem key={`item_${i}`} value={reaction}>{reaction}</MenuItem>
                      ))
                  }

                  </Select>
                  <FormHelperText>Select reaction</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            {_.isEmpty(this.state.plotlyData) ? null :
            <Grid container direction="row" justify="center">
              <Grid item >
                <Grid container direction="row" justify="center" >
                  <Grid item>
                    <Grid container direction="row" justify="center">
                      <Grid item >
                      </Grid>
                    </Grid>

                    <Grid container direction="column" justify="center">
                      {this.state.plotlyData.data.length === 1 ? null :
                      <Grid container direction="row" justify="center">
                        <Grid item >
                          <Tooltip title="Previous">
                            <Button
                              fab
                              mini
                              onClick={() => this.handlePageFlip(-1)}
                            >
                              <MdChevronLeft size={30} />
                            </Button>
                          </Tooltip>
                          {'\u00A0\u00A0'}
                          <Tooltip title="Next">
                            <Button
                              fab
                              mini
                              onClick={() => this.handlePageFlip(+1)}
                            >
                              <MdChevronRight size={30} />
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                          }
                      <Grid item>
                        <Plot
                          {...this.state.plotlyData}
                          data={[
                            this.state.heatmapData,
                            this.state.scatterData,
                          ]}
                          layout={{
                            hovermode: 'closest',
                            height: Math.max(Math.min(window.innerHeight * 0.6, Number.POSITIVE_INFINITY), 120),
                            width: Math.max(Math.min(window.innerWidth * 0.8, 1150), 320),
                            margin: { l: 50, r: 10, b: 40, t: 10 },
                            xaxis: {
                              title: this.state.xlabel,
                              range: [
                                Math.min(...(this.state.heatmapData.x || [])),
                                Math.max(...(this.state.heatmapData.x || [])),
                              ],
                            },
                            yaxis: {
                              title: this.state.ylabel,
                              range: [
                                Math.min(...(this.state.heatmapData.y || [])),
                                Math.max(...(this.state.heatmapData.y || [])),
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
                      </Grid>
                    </Grid>

                    {this.state.plotlyData.data.length === 1 ? null :
                    <Grid container direction="row" justify="center">
                      <Grid item >
                        <Tooltip title="Previous">
                          <Button
                            fab
                            mini
                            onClick={() => this.handlePageFlip(-1)}
                          >
                            <MdChevronLeft size={30} />
                          </Button>
                        </Tooltip>
                        {'\u00A0\u00A0'}
                        <Tooltip title="Next">
                          <Button
                            fab
                            mini
                            onClick={() => this.handlePageFlip(+1)}
                          >
                            <MdChevronRight size={30} />
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                          }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            }
          </div>
          {_.isEmpty(this.state.reference) ? null :
          <div>{`${this.state.reference}`}</div>
          }
        </Paper>
        {this.state.loading ? <LinearProgress className={this.props.classes.progress} /> : null }
      </div>
    );
  }
}


ActivityMapPlot.propTypes = {
  clickDot: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  saveStructure: PropTypes.func.isRequired,
  saveSystems: PropTypes.func.isRequired,
  clearStructures: PropTypes.func.isRequired,
  saveStructureQuery: PropTypes.func.isRequired,
  saveReaction: PropTypes.func,
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
)(ActivityMapPlot);
