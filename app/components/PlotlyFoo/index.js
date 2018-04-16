/**
 *
 * PlotlyFoo
 *
 */

import React from 'react';
import { withStyles } from 'material-ui/styles';
import Plot from 'react-plotly.js';
import _ from 'lodash';


const styles = () => ({
});

const seabornColors = ['rgb(31, 119, 180)',
  'rgb(255, 127, 14)',
  'rgb(44, 160, 44)',
  'rgb(214, 39, 40)',
  'rgb(148, 103, 189)',
  'rgb(140, 86, 75)',
  'rgb(227, 119, 194)',
  'rgb(127, 127, 127)',
  'rgb(188, 189, 34)',
  'rgb(23, 190, 207)'];


class PlotlyFoo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      activePhase: '',
    };
  }
  render() {
    return (
      <div>
        <Plot
          data={[
            {
              type: 'mesh3d',
              x: [0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
              y: [0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
              z: [0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.3, 0.3, 0.3, 0.3],
              i: [0, 0, 0, 3, 8, 8, 3, 3],
              j: [1, 2, 3, 4, 9, 10, 2, 6],
              k: [2, 3, 4, 5, 10, 11, 4, 4],
              facecolor: [
                seabornColors[0],
                seabornColors[0],
                seabornColors[1],
                seabornColors[1],
                seabornColors[2],
                seabornColors[2],
                seabornColors[3],
                seabornColors[3],
              ],
              flatshading: true,
              lighting: {
                fresnel: 0.01,
                specular: 0.00,
                ambient: 1.0,
                diffuse: 1.0,

              },
              hoverinfo: 'none',
              hoveron: false,
              hoverlabel: {
                bgcolor: 'white',
                font: {
                  family: 'Times New Roman',
                  color: 'black',
                },
              } },
            {
              type: 'scatter3d',
              mode: 'markers+text',
              visible: true,
              x: [0.3, 0.8, 0.4],
              y: [0.7, 0.6, 0.2],
              z: [1.0, 1.0, 1.0],
              hoverinfo: 'text',
              text: [
                'Phase Three',
                'Phase Two',
                'Phase One',

              ],
              customdata: [
                'Phase Three',
                'Phase Two',
                'Phase One',

              ],
              marker: {
                color: 'rgb(0, 0, 0)',
                size: 10.0,
              },
            },
            {
              type: 'scatter3d',
              mode: 'markers',
              hoverinfo: 'name',
              visible: false,
              name: 'One phase',
              x: _.range(10000).map((x) => 0.01 * parseInt(x / 100, 10)),
              y: _.range(10000).map((x) => 0.01 * (x % 100)),
              z: _.range(10000).map((x) => {
                /* const tx = 0.01 * parseInt(x / 100);*/
                const ty = 1 - (0.01 * (x % 100));
                return 0.5 * ty;
              }),
              customdata: _.range(1000).map(() => 'One phase'),
              marker: {
                color: 'rgb(255, 0, 0)',
                size: 1.5,
              },
            },
            {
              type: 'scatter3d',
              mode: 'markers',
              hoverinfo: 'name',
              visible: false,
              name: 'Two phase',
              x: _.range(10000).map((x) => 0.01 * parseInt(x / 100, 10)),
              y: _.range(10000).map((x) => 0.01 * (x % 100)),
              z: _.range(10000).map((x) => {
                const tx = 0.01 * parseInt(x / 100, 10);
                /* const ty = 0.01 * (x % 100);*/
                return 0.5 * tx;
              }),
              customdata: _.range(1000).map(() => 'Two phase'),
              marker: {
                color: 'rgb(0, 255, 0)',
                size: 0.1,
              },
            },
            {
              type: 'scatter3d',
              mode: 'markers',
              hoverinfo: 'name',
              visible: false,
              name: 'Three phase',
              x: _.range(10000).map((x) => 0.01 * parseInt(x / 100, 10)),
              y: _.range(10000).map((x) => 0.01 * (x % 100)),
              z: _.range(10000).map(() => 0.3),
              customdata: _.range(1000).map(() => 'Three phase'),
              marker: {
                color: 'rgb(0, 0, 255)',
                size: 3,
              },
            },
          ]}
          config={{
            displayModeBar: true,
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosest3d'],
            legendPosition: true,
            displaylogo: false,
          }}
          onClick={(event) => {
            if (!_.isEmpty(event.points[0].customdata)) {
              this.setState({
                activePhase: event.points[0].customdata,
              });
            }
          }}
          layout={{
            hovermode: 'closest',
            height: Math.max(Math.min(window.innerHeight * 0.7, Number.POSITIVE_INFINITY), 120),
            width: Math.max(Math.min(window.innerWidth * 0.7, 1150), 320),
            scene: {
              xaxis: {
                title: 'pH',
                titlefont: {
                  family: 'Open Sans',
                  size: 18,
                },
                tickfont: {
                  family: 'Open Sans',
                  size: 12,
                },
              },
              yaxis: {
                title: 'V',
                titleangle: 90,
                titlefont: {
                  family: 'Open Sans',
                  size: 18,
                },
                tickfont: {
                  family: 'Open Sans',
                  size: 12,
                },
              },
              zaxis: {
                title: '',
                visible: false,
              },
              aspectratio: {
                x: 1,
                y: 1,
                z: 0.01,
              },
              camera: {
                up: {
                  x: 1,
                  y: 0,
                  z: 0,
                },
                center: {
                  x: 0,
                  y: 0,
                  z: 0,
                },

                eye: {
                  x: 0,
                  y: 0,
                  z: 1.5,
                },
              },
            },
            yaxis: {
              title: 'Potential [V]',
              range: [0, 2],
            },
            zaxis: {
              range: [0, 1],
            },

          }}
        />
        {_.isEmpty(this.state.activePhase) ? null :
        <div>
          <h2>{this.state.activePhase}</h2>
          <div>
              Here be dragons about {this.state.activePhase}
          </div>
        </div>
        }
      </div>
    );
  }
}

PlotlyFoo.propTypes = {

};


export default withStyles(styles, { withTheme: true })(PlotlyFoo);
