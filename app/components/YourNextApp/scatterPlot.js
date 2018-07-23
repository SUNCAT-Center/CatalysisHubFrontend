import React from 'react';
import _ from 'lodash';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Plot from 'react-plotly.js';

export default class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xs: [],
      ys: [],
      x: 0,
      y: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePlot = this.handlePlot.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  handleClear() {
    this.setState({
      xs: [],
      ys: [],
      x: 0,
      y: 0,
    });
  }

  handlePlot() {
    const xs = _.concat(this.state.xs, [this.state.x]);
    const ys = _.concat(this.state.ys, [this.state.y]);
    this.setState({
      xs, ys,
    });
  }

  render() {
    return (
      <Grid direction="column" justify="flex-start">
        <Grid item>
          <h2>An Interactive Example</h2>
        </Grid>
        <Grid item>
          <Plot
            data={[{
              x: this.state.xs,
              y: this.state.ys,
              type: 'scatter',
            }]}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row" justify="space-bwetween">
            <Grid item>
              <TextField
                value={this.state.x}
                onChange={this.handleChange('x')}
              />
            </Grid>
            <Grid item>
              <TextField
                value={this.state.y}
                onChange={this.handleChange('y')}
              />
            </Grid>
            <Grid item>
              <Button
                raised
                onClick={this.handleClear}
              > Clear </Button>
              <Button
                raised
                color="primary"
                onClick={(event) => { this.handlePlot(event); }}
              >Plot</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
