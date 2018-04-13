
import React from 'react';
import PropTypes from 'prop-types';

import Script from 'react-load-script';
import ReactGA from 'react-ga';

import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import { styles } from './styles';

class CatKitDemoHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />

        <Grid container direction="row" justify="space-between">
          <Grid item>
            <h1>CatKit Slab Generator</h1>
          </Grid>
          <Grid>
            <div
              className={this.props.classes.infoText}
            >Powered by <ReactGA.OutboundLink
              eventLabel="https://github.com/jboes/CatKit"
              to="https://github.com/jboes/CatKit"
              target="_blank"
            >
                github.com/jboes/CatKit
              </ReactGA.OutboundLink>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CatKitDemoHeader.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(CatKitDemoHeader);
