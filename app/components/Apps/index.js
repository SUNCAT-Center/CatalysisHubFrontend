/**
 *
 * Apps
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { apps } from 'utils/constants';
import { Link } from 'react-router';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Slide from 'material-ui/transitions/Slide';
import Tooltip from 'material-ui/Tooltip';

import {
  FaMapO,
  FaTerminal,
  FaNewspaperO,
  FaDatabase,
} from 'react-icons/lib/fa';

import {
  IoCube,
  IoSocialBuffer,
} from 'react-icons/lib/io';
import {
  MdSearch,
  MdBubbleChart,
  MdFormatShapes,
} from 'react-icons/lib/md';


const styles = () => ({
  AppWrapper: {
    maxWidth: 'calc(1200px + 16px * 2)',
    margin: '20 auto',
    marginTop: '40px',
    display: 'flex',
    minHeight: '100%',
    padding: '0 0px',
    flexDirection: 'column',
    textDecoration: 'none',
    position: 'block',
  },
  appHint: {
    fontSize: 12,
    textAlign: 'left',
  },
  appPaper: {
    padding: 25,
    minWidth: 240,
    maxWidth: 300,
    textAlign: 'center',
    backgroundColor: '#eeeeee',
    cornerRadius: 40,
  },
});

const getAppIcon = (title) => {
  if (title === 'Activity Maps') {
    return <FaMapO />;
  } else if (title === 'Prototype Search') {
    return <IoCube />;
  } else if (title === 'CatKit Slab Generator') {
    return <IoSocialBuffer />;
  } else if (title === 'Surface Reactions') {
    return <MdSearch />;
  } else if (title === 'Publications') {
    return <FaNewspaperO />;
  } else if (title === 'Your Next App ...') {
    return <FaTerminal />;
  } else if (title === 'GraphQL API') {
    return <FaDatabase />;
  } else if (title === 'Wyckoff Bulk Generator') {
    return <MdFormatShapes />;
  } else if (title === 'Scaling Relations') {
    return <MdBubbleChart />;
  }
  return null;
};

class Apps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.AppWrapper} >

        <Slide
          in
          mountOnEnter
          unmountOnExit
          direction="left"
        >
          <div>
            <Grid container justify="center">
              {apps.map((app, i) => (
                <Grid item key={`griditem_${i}`}>
                  <Link
                    to={app.route}
                    style={{
                      textDecoration: 'none',
                      color: 'black',
                    }}
                  >
                    <Paper
                      className={this.props.classes.appPaper}
                      elevation={0}
                    >
                      <Tooltip title={app.tooltip} placement="top">
                        <h3>
                          {getAppIcon(app.title)}
                          {'\u00A0'}{app.title}</h3>
                      </Tooltip>
                      <div className={this.props.classes.appHint}>{app.tooltip}</div>
                    </Paper>
                  </Link>
                </Grid>
              )) }
            </Grid>
          </div>
        </Slide>
      </div>
    );
  }
}

Apps.propTypes = {
  classes: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(Apps);
