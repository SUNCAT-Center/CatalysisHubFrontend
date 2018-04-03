import React from 'react';

import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import PropTypes from 'prop-types';
import _ from 'lodash';


import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import { styles } from './styles';

export class BulkView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Paper className={this.props.classes.paper}>
        { this.props.bulkCif === '' ? null :
        <div>
          <h2>Bulk Preview</h2>
          <Grid container direction="row" justify="center">
            <Grid item>
              <GeometryCanvasWithOptions
                cifdata={this.props.bulkCif}
                uniqueId="bulk_preview"
                id="bulk_preview"
                x={2} y={2} z={2} ref={(gmCanvas) => { this.gmCanvas = gmCanvas; }}
              />
            </Grid>
          </Grid>
          { _.isEmpty(this.props.bulkParams) || _.isEmpty(this.props.bulkParams.wyckoff) ? null :
          <div>
            <h2>Wyckoff Parameters</h2>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <h4>Spacegroup</h4>
                <div>
                  {this.props.bulkParams.wyckoff.spacegroup}
                </div>
              </Grid>
              <Grid item>
                <h4>Prototypes(s)</h4>
                <ul>
                  {this.props.bulkParams.wyckoff.synonyms.map((synonym, i) => (
                    <li key={`li_${i}`}>{synonym}</li>
                          ))}
                </ul>
              </Grid>
              <Grid item>
                <h4>Points</h4>
                <ul>
                  {_.zip(this.props.bulkParams.wyckoff.species,
                            this.props.bulkParams.wyckoff.wyckoff).map((elem, i) => (
                              <li key={`point_${i}`}>{elem[1]} ({elem[0]})</li>
                          ))}
                </ul>
              </Grid>
            </Grid>

          </div>
            }
        </div>
        }
      </Paper>
    );
  }
}


BulkView.propTypes = {
  bulkCif: PropTypes.string.isRequired,
  classes: PropTypes.object,
  bulkParams: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(BulkView);
