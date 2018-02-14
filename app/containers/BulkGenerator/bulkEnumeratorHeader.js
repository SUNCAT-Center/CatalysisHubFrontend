
import React from 'react';
import PropTypes from 'prop-types';

import Script from 'react-load-script';
import ReactGA from 'react-ga';

import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { styles } from './styles';

class BulkEnumeratorDemoHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.header}>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="https://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js" />

        <Grid container direction="row" justify="space-between">
          <Grid item>
            <h1>Bulk Generator</h1>
          </Grid>
          <Grid>
            <div
              className={this.props.classes.infoText}
            >Based on <ReactGA.OutboundLink
              eventLabel="https://gitlab.com/ankitjainmeiitk/Enumerator"
              to="https://gitlab.com/ankitjainmeiitk/Enumerator"
            >
              gitlab/ankitjainmeiitk/Enumerator
              </ReactGA.OutboundLink>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

BulkEnumeratorDemoHeader.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(BulkEnumeratorDemoHeader);

