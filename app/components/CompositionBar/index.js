/**
*
* CompositionBar
*
*/

import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

import { styles } from './styles';

const atomicNumbers = { X: 0, H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35, Kr: 36, Rb: 37, Sr: 38, Y: 39, Zr: 40, Nb: 41, Mo: 42, Tc: 43, Ru: 44, Rh: 45, Pd: 46, Ag: 47, Cd: 48, In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, Xe: 54, Cs: 55, Ba: 56, La: 57, Ce: 58, Pr: 59, Nd: 60, Pm: 61, Sm: 62, Eu: 63, Gd: 64, Tb: 65, Dy: 66, Ho: 67, Er: 68, Tm: 69, Yb: 70, Lu: 71, Hf: 72, Ta: 73, W: 74, Re: 75, Os: 76, Ir: 77, Pt: 78, Au: 79, Hg: 80, Tl: 81, Pb: 82, Bi: 83, Po: 84, At: 85, Rn: 86, Fr: 87, Ra: 88, Ac: 89, Th: 90, Pa: 91, U: 92, Np: 93, Pu: 94, Am: 95, Cm: 96, Bk: 97, Cf: 98, Es: 99, Fm: 100, Md: 101, No: 102, Lr: 103, Rf: 104, Db: 105, Sg: 106, Bh: 107, Hs: 108, Mt: 109, Ds: 110, Rg: 111, Cn: 112, Nh: 113, Fl: 114, Mc: 115, Lv: 116, Ts: 117, Og: 118 };
const jmolColors = { 1: '#ff0000', 2: '#ffffff', 3: '#d9ffff', 4: '#cc80ff', 5: '#c2ff00', 6: '#ffb5b5', 7: '#909090', 8: '#2f50f8', 9: '#ff0d0d', 10: '#90df50', 11: '#b3e2f5', 12: '#ab5cf1', 13: '#89ff00', 14: '#bea6a6', 15: '#efc79f', 16: '#ff8000', 17: '#ffff2f', 18: '#1fef1f', 19: '#80d1e2', 20: '#8f40d3', 21: '#3cff00', 22: '#e6e6e6', 23: '#bec2c6', 24: '#a6a6ab', 25: '#8999c6', 26: '#9c79c6', 27: '#df6633', 28: '#ef909f', 29: '#50d050', 30: '#c78033', 31: '#7c80af', 32: '#c28f8f', 33: '#668f8f', 34: '#bc80e2', 35: '#ffa000', 36: '#a62929', 37: '#5cb8d1', 38: '#6f2daf', 39: '#00ff00', 40: '#93ffff', 41: '#93dfdf', 42: '#73c2c8', 43: '#53b5b5', 44: '#3a9e9e', 45: '#238f8f', 46: '#097c8b', 47: '#006985', 48: '#c0c0c0', 49: '#ffd98f', 50: '#a67573', 51: '#668080', 52: '#9e62b5', 53: '#d37900', 54: '#930093', 55: '#429eaf', 56: '#56168f', 57: '#00c800', 58: '#6fd3ff', 59: '#ffffc6', 60: '#d9ffc6', 61: '#c6ffc6', 62: '#a2ffc6', 63: '#8fffc6', 64: '#60ffc6', 65: '#45ffc6', 66: '#2fffc6', 67: '#1fffc6', 68: '#00ff9c', 69: '#00e675', 70: '#00d352', 71: '#00be38', 72: '#00ab23', 73: '#4dc2ff', 74: '#4da6ff', 75: '#2093d5', 76: '#257cab', 77: '#256695', 78: '#165386', 79: '#d0d0df', 80: '#ffd122', 81: '#b8b8d0', 82: '#a6534d', 83: '#565860', 84: '#9e4fb5', 85: '#ab5c00', 86: '#754f45', 87: '#428295', 88: '#420066', 89: '#007c00', 90: '#6fabf9', 91: '#00b9ff', 92: '#00a0ff', 93: '#008fff', 94: '#0080ff', 95: '#006bff', 96: '#535cf1', 97: '#785ce2', 98: '#894fe2', 99: '#a036d3', 100: '#b31fd3', 101: '#b31fb9', 102: '#b30da6', 103: '#bc0d86', 104: '#c60066', 105: '#cc0058', 106: '#d1004f', 107: '#d90045', 108: '#df0038', 109: '#e6002d', 110: '#eb0025' };



class CompositionBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const elems = this.props.composition.match(/[A-Z][a-z]*[0-9]*/g).map((block) => block.match(/[A-Z][a-z]*/)[0].repeat(parseInt((block.match(/[0-9]+/g) || ['1'])[0], 10))).join('').match(/[A-Z][a-z]*/g);
    const n = elems.length;
    const d = parseInt(this.props.width / n, 10);
    return (
      <div>
        <svg width={this.props.width} height={this.props.height}>
          {elems.map((elem, i) => (
            <rect
              key={`slot_${i}`}
              title={elem}
              height={this.props.height}
              x={i * d}
              width={d}
              fill={jmolColors[1 + atomicNumbers[elem]]}
            ></rect>
            ))}
        </svg>
      </div>
    );
  }
}

CompositionBar.propTypes = {
  composition: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};


CompositionBar.defaultProps = {
  height: 20,
  width: isMobile ? 150 : 250,
};

export default withStyles(styles, { withTheme: true })(CompositionBar);
