/**
 *
 * ElementBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';

import { Element } from '@chemistry/elements';

const styles = (theme) => ({
  blockThree: {},
  blockFour: {},
  panelFive: {},
  panelFour: {},
  lowerContainer: {},
  box: {
    border: '1px solid black',
    maxWidth: 50,
    maxHeight: 50,
    padding: 10,
    paddingTop: 0,
    lineHeight: 4,
    textAlign: 'center',
    fontSize: '1.23em',
  },
  gas: {
    backgroundColor: _.get(theme, 'palette.cardinalred.500'),
  },
  liquid: {
    backgroundColor: _.get(theme, 'palette.teal[500]'),
  },
  solid: {
    backgroundColor: _.get(theme, 'palette.sandstone[500]'),
  },
  artificial: {
    backgroundColor: _.get(theme, 'palette.sandhill[500]'),
  },
  number: {
    marginTop: -10,
    marginLeft: -24,
    fontSize: 8,
  },
  symbol: {
    marginLeft: -24,
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
        style={{
          borderWidth: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? '3px' : '1px',
        }}
      >
        <button
          onClick={() => {
            this.props.clickElement(this.props.label);
          }}
        >
          <div
            className={this.props.classes.number}
            style={{
              fontWeight: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? 'bolder' : 'lighter',
            }}
          >
            {(Element.getElementByName(this.props.label) ||
              { Nh: { number: 113 }, Fl: { number: 114 }, Mc: { number: 115 }, Lv: { number: 116 }, Ts: { number: 117 }, Og: { number: 118 } }[this.props.label]
              || { number: '\u00A0\u00A0' }).number}
          </div>
          <div
            className={`${this.props.classes.symbol}`}
            style={{
              fontWeight: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? 'bolder' : 'lighter',
            }}
          >
            {`\u00A0\u00A0\u00A0\u00A0${this.props.label}\u00A0\u00A0\u00A0`}
          </div>
          <div
            className={this.props.classes.name}
            style={{
              fontWeight: this.props.selection.split(' & ').indexOf(this.props.label) > -1 ? 'bolder' : 'lighter',
            }}
          >
            {(Element.getElementByName(this.props.label) ||
              { Nh: { name: 'Nihonium' }, Fl: { name: 'Flerovium' }, Mc: { name: 'Moscovium' }, Lv: { name: 'Livermorium' }, Ts: { name: 'Tennessine' }, Og: { name: 'Oganesson' } }[this.props.label]
              ||
              { name: '\u00A0' }).name}
          </div>
          <div className={this.props.classes.chemData}>
            {/* `
              ${(Element.getElementByName(this.props.label) ||
              {Nh: {mass: 286}, Fl: {mass: 289}, Mc: {mass: 290}, Lv: {mass: 293}, Ts: {mass: 294}, Og: {mass: 294}}[this.props.label]
              || { mass: 0.0 }).mass.toFixed(0)}
              `*/}
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
