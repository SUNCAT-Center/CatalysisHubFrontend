/**
*
* GraphQlbutton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import { FaDatabase } from 'react-icons/lib/fa';
import { graphQLRoot, newGraphQLRoot } from 'utils/constants';


import { styles } from './styles';


class GraphQlbutton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ReactGA.OutboundLink
        eventLabel={`GraphQL ${this.props.newSchema ? newGraphQLRoot : graphQLRoot}?query=${encodeURIComponent(this.props.query)}`}
        to={`${this.props.newSchema ? newGraphQLRoot : graphQLRoot}?query=${encodeURIComponent(this.props.query)}`}
        target="_blank"
        className={this.props.classes.button}
      >
        <Tooltip title="Open GraphQL query interface in new tab.">
          <Button className={this.props.classes.button}>
            <FaDatabase />{'\u00A0\u00A0'} GraphQL Query
        </Button>
        </Tooltip>
      </ReactGA.OutboundLink>
    );
  }
}

GraphQlbutton.propTypes = {
  query: PropTypes.string,
  classes: PropTypes.object,
  newSchema: PropTypes.bool,
};

GraphQlbutton.defaultProps = {
  newSchema: true,
  query: '{systems(first: 10) { edges { node { id energy InputFile(format: "cif") positions cell Formula } } }}',
};


export default withStyles(styles, { withTheme: true })(GraphQlbutton);
