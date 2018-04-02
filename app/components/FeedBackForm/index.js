/**
*
* FeedBackForm
*
*/

import React from 'react';
import { withStyles } from 'material-ui/styles';
import IFrame from 'react-iframe';

import PropTypes from 'prop-types';


const styles = (theme) => ({
  mainDiv: {
    paddingTop: 3 * theme.spacing.unit,
  },

});


class FeedBackForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.mainDiv}>
        <IFrame
          url={'https://goo.gl/forms/rqEzlabQgysUTvLv2'}
          width="100%"
          height="80vh"
          position="relative"
          display="initial"
          allowFullScreen
        />
      </div>
    );
  }
}

FeedBackForm.propTypes = {
  classes: PropTypes.object,

};


export default withStyles(styles, { withTheme: true })(FeedBackForm);
