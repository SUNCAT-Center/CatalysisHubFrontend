/**
*
* GraphQlbutton
*
*/

import React, { PropTypes } from 'react';
import ReactGA from 'react-ga';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { FaDatabase } from 'react-icons/lib/fa';
import { graphQLRoot } from 'utils/constants';


const styles = (theme) => ({
  button: {
    textDecoration: 'none',
    backgroundColor: theme.palette.sandhill[50],
    '&:hover': {
      backgroundColor: theme.palette.sandhill[300],
    },
  },
});


class GraphQlbutton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <ReactGA.OutboundLink
          eventLabel={`GraphQL ${graphQLRoot}?query=${encodeURIComponent(this.props.query)}`}
          to={`${graphQLRoot}?query=${encodeURIComponent(this.props.query)}`}
          target="_blank"
          className={this.props.classes.button}
        >
          <Button className={this.props.classes.button}>
            <FaDatabase />{'\u00A0\u00A0'} GraphQL Query
        </Button>
        </ReactGA.OutboundLink>
      </div>
    );
  }
}

GraphQlbutton.propTypes = {
  query: PropTypes.string,
  classes: PropTypes.object,
};


export default withStyles(styles, { withTheme: true })(GraphQlbutton);
