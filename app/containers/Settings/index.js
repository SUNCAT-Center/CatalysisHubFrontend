/*
 *
 * Settings
 *
 */

import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { withCookies, Cookies } from 'react-cookie';

import Switch from 'material-ui/Switch';
import Tooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import { isMobile } from 'react-device-detect';
import Slide from 'material-ui/transitions/Slide';


import { createStructuredSelector } from 'reselect';
import makeSelectSettings from './selectors';

import { styles } from './styles';

export class Settings extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      perspective: ((this.props.cookies.get('perspective') || 'true') === 'true'),
      tiltToRotate: ((this.props.cookies.get('tiltToRotate') || 'true') === 'true'),
    };
    this.handleChange = this.handleChange.bind(this);
    //
    // Important when loading the first time
    /* this.handleChange('perspective')(true);*/
    /* this.handleChange('tiltToRotate')(true);*/
  }
  handleChange = (key) => (value) => {
    this.props.cookies.set(key, value);
    const subState = {};
    subState[key] = value;
    this.setState({ ...subState });
  }
  render() {
    return (
      <Slide
        onMountEnter
        onUnmountExit
        in
        direction="left"
      >
        <div>
          <h2>Settings</h2>
          <Paper className={this.props.classes.paper}>
            <h3>View </h3>
            <FormGroup >

              <Tooltip title="Show interactive structures with parallel or stereographic projection">
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.perspective}
                      onChange={() => { this.handleChange('perspective')(!this.state.perspective); }}
                    />
            }
                  label={
                    <span>Stereographic Projection </span>
            }
                />
              </Tooltip>
              {!isMobile ? null :
              <Tooltip title="Tilt the phone to turn an atoms object. May consume more battery">
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.tiltToRotate}
                      onChange={() => { this.handleChange('tiltToRotate')(!this.state.tiltToRotate); }}
                    />
            }
                  label={
                    <span>Tilt to rotate atoms </span>
            }
                />
              </Tooltip>
            }
            </FormGroup>
          </Paper>
        </div>
      </Slide>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object,
  cookies: instanceOf(Cookies).isRequired,
};

const mapStateToProps = createStructuredSelector({
  Settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withCookies(
    withStyles(styles, { withTheme: true })(
      Settings)
  )
);
