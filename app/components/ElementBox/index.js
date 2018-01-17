/**
 *
 * ElementBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { Element } from '@chemistry/elements';

const styles = (theme) => ({
  blockThree: {},
  blockFour: {},
  panelFive: {},
  panelFour: {},
  lowerContainer: {},
  box: {
    border: '3px solid black',
    maxWidth: 50,
    maxHeight: 50,
    padding: '10px',
    /* lineHeight: 50, */
    textAlign: 'center',
    fontSize: '1.23em',
  },
  gas: {
    backgroundColor: theme.palette.cardinalred[500],
  },
  liquid: {
    backgroundColor: theme.palette.teal[500],
  },
  solid: {
    backgroundColor: theme.palette.sandstone[500],
  },
  artificial: {
    backgroundColor: theme.palette.sandhill[500],
  },
  number: {
    marginTop: -10,
    marginLeft: -24,
    fontSize: 8,
  },
  symbol: {
    marginLeft: -10,
    marginTop: -2,
    fontSize: 14,
  },
  name: {
    fontSize: 6,
    marginLeft: -16,
  },
  chemData: {
    fontSize: 6,
    marginLeft: -18,
  },
});


class ElementBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div
        key={this.props.label}
        className={`${this.props.classes.box} ${this.props.classes[this.props.backgroundColor]}`}
      >
        <button
          onClick={() => {
            this.props.clickElement(this.props.label);
          }}
        >
          <div className={this.props.classes.number}>
            {(Element.getElementByName(this.props.label) || {}).number}
          </div>
          <div
            className={this.props.classes.symbol}
            style={{
              fontWeight: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? 'bolder' : 'lighter',
            }}
          >
            { this.props.label }
          </div>
          <div
            className={this.props.classes.name}
            style={{
              fontWeight: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? 'bolder' : 'lighter',
            }}
          >
            {(Element.getElementByName(this.props.label) || {}).name}
          </div>
          <div className={this.props.classes.chemData}>
            {`
              ${(Element.getElementByName(this.props.label) || { mass: 0.0 }).mass.toFixed(0)}
              `}
          </div>
        </button>
      </div>
    );
  }
}

ElementBox.propTypes = {
  label: PropTypes.string.isRequired,
  clickElement: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string,
  classes: PropTypes.object,
  selection: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(ElementBox);
