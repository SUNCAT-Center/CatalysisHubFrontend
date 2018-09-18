
import React from 'react';
import PropTypes from 'prop-types';

import Script from 'react-load-script';
import ReactGA from 'react-ga';
import { Link } from 'react-router';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
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
          <Grid item>

            <Link
              to={'/prototypeSearch'}
              className={this.props.classes.outboundLink}
            >
              <Button
                raised
                className={this.props.classes.publicationAction}
              >
                        Prototype Search
                    </Button>
            </Link>
          </Grid>
          <Grid>
            <div
              className={this.props.classes.infoText}
            >Powered by <ReactGA.OutboundLink
              eventLabel="https://github.com/SUNCAT-Center/CatKit"
              to="https://github.com/SUNCAT-Center/CatKit"
              target="_blank"
            >
                github.com/SUNCAT-Center/CatKit
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
