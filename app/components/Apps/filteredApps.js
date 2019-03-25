
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import { Link } from 'react-router';
import {
  MdChevronRight,
} from 'react-icons/lib/md';

import { getAppIcon } from 'utils/functions';

import { styles } from './styles';

class FilteredApps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Paper
        className={[this.props.classes.appsPaper,
          _.get(this.props.classes, this.props.title.toLowerCase())].join(' ')}
      >
        {this.props.title === '' ? null : <h2>{this.props.title}</h2>}
        <Grid container justify="flex-start">
          {this.props.filter.map((appTitle, i) => {
            const app = this.props.apps.filter((_app) => _app.title === appTitle)[0];
            return (
              <Grid item key={`griditem_${i}`}>
                <Link
                  to={app.route}
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                  }}
                >
                  <Paper
                    className={[
                      this.props.classes.appPaper,
                      _.get(this.props.classes, `${this.props.title.toLowerCase()}Paper`),
                    ].join(' ')}
                    elevation={0}
                  >
                    <Tooltip title={app.tooltip} placement="top">
                      {(app.title === 'Activity Maps' || app.title === 'Scaling Relations' || app.title === 'Pourbaix Diagrams') ?
                        <h3>
                          {getAppIcon(app.title)}
                          {'\u00A0'}{app.title}{' (Beta) '}
                        </h3>
                        :
                        <h3>
                          {getAppIcon(app.title)}
                          {'\u00A0'}{app.title}
                        </h3>
                      }
                    </Tooltip>
                    <div className={this.props.classes.appHint}>{app.tooltip} <MdChevronRight /></div>
                  </Paper>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  }
}


FilteredApps.propTypes = {
  apps: PropTypes.array,
  filter: PropTypes.array,
  classes: PropTypes.object,
  title: PropTypes.string,
};

FilteredApps.defaultProps = {
  apps: [],
  filter: [],
  title: '',
};
export default withStyles(styles, { withTheme: true })(FilteredApps);
