/**
 *
 * Apps
 *
 */

import React, { PropTypes } from 'react';

import { apps } from 'utils/constants';
import { Link } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';


const styles = () => ({
  AppWrapper: {
    maxWidth: 'calc(1200px + 16px * 2)',
    margin: '20 auto',
    marginTop: '40px',
    display: 'flex',
    minHeight: '100%',
    padding: '0 0px',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
  },
});

class Apps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.AppWrapper} >
        <Grid container justify="center">
          {apps.map((app, i) => (
            <Grid item key={`griditem_${i}`}>
              <Link
                to={app.route}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    maxWidth: 300,
                    textAlign: 'center',
                  }}
                >
                  <h3>{app.title}</h3>
                </Paper>
              </Link>
            </Grid>
              )) }
        </Grid>
      </div>
    );
  }
}

Apps.propTypes = {
  classes: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(Apps);
