/**
 *
 * PeriodicTable
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Element from 'containers/ElementContainer';


import { withStyles } from 'material-ui/styles';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MdClear, MdFilterList, MdArrowDropDown, MdArrowDropUp } from 'react-icons/lib/md';

const styles = (xtheme) => ({
  lowerContainer: {
    [xtheme.breakpoints.down('md')]: {
      visibility: 'hidden',
    },
  },
  panelThree: {
    [xtheme.breakpoints.down('md')]: {
      /* visibility: 'hidden',*/
      top: '400px',
    },
  },
  blockThree: {
    [xtheme.breakpoints.down('md')]: {
      /* visibility: 'hidden',*/
      left: '-100px',
      top: '-40px',
      position: 'relative',
    },
  },
  blockFour: {
    [xtheme.breakpoints.down('md')]: {
      /* visibility: 'hidden',*/
      left: '-500px',
      top: '550px',
      position: 'relative',
    },
  },
  panelFour: {
    [xtheme.breakpoints.down('md')]: {
      position: 'relative',
      left: '5px',
      top: '-500px',
    },
  },
  panelFive: {
    [xtheme.breakpoints.down('md')]: {
      position: 'relative',
      left: '-500px',
    },
  },

});

const Section = styled.section`
    width: 900px;
    max-width: 90%;
    margin: 0px 10px;
`;

const Container = styled.div`
    width: 1400px;
`;

const PanelOne = styled.div`
    float: left;
`;

const PanelTwo = styled.div`
    float: left;
    position: relative;
    top: 50px;
`;

const PanelThree = styled.div`
    float: left;
    position: relative;
    top: 150px;
`;

const PanelFour = styled.div`
    float: left;
    position: relative;
    top: 50px;
`;

const BlockThree = styled.div`
`;

const BlockFour = styled.div`
`;

const PanelFive = styled.div`
    float: left;
`;

const LowerContainer = styled.div`
    float: left;
    margin-top: 20px;
    margin-left: 50px;
`;

const Bottom = styled.div`
    float: left;
`;

const MButton = styled(Button)`
  margin: 12px;
`;

class PeriodicTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      show_table: true,
    };
    this.toggletable = this.toggletable.bind(this);
  }

  toggletable = () => {
    this.setState({
      show_table: !this.state.show_table,
    });
  }
  render() {
    return (
      <div>
        {/* Periodic Table of Elements */}
        <Section>
          <TextField
            type="text"
            name="element_selection"
            size={250}
            label="Selected Elements (click on Table)"
            value={this.props.selection}
            style={{
              minWidth: 250,
            }}
          />
          <MButton
            raised
            onClick={() => {
              this.props.clearSelection();
            }}
          >
            <MdClear /> Clear
          </MButton>
          <MButton raised color="primary">
            <MdFilterList /> Filter
          </MButton>
          <MButton
            raised
            onClick={this.toggletable}
          >
            {this.state.show_table === true ?
              <span>
                <MdArrowDropUp /> Hide Table
                </span>
              :
                <span>
                  <MdArrowDropDown /> Show Table
                </span>
            }
          </MButton>
          {this.state.show_table === false ? null :
          <div>
            <Container>
              <PanelOne>
                <Element label="H" />
                <Element label="Li" />
                <Element label="Na" />
                <Element label="K" />
                <Element label="Rb" />
                <Element label="Cs" />
                <Element label="Fr" />
              </PanelOne>
              <PanelTwo>
                <Element label="Be" />
                <Element label="Mg" />
                <Element label="Ca" />
                <Element label="Sr" />
                <Element label="Ba" />
                <Element label="Ra" />
              </PanelTwo>
              <BlockThree className={this.props.classes.blockThree} >
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Sc" />
                  <Element label="Y" />
                  <Element label="&nbsp;" />
                  <Element label="&nbsp;" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Ti" />
                  <Element label="Zr" />
                  <Element label="Hf" />
                  <Element label="Rf" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="V" />
                  <Element label="Nb" />
                  <Element label="Ta" />
                  <Element label="Db" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Cr" />
                  <Element label="Mo" />
                  <Element label="W" />
                  <Element label="Sg" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Mn" />
                  <Element label="Tc" />
                  <Element label="Re" />
                  <Element label="Bh" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Fe" />
                  <Element label="Ru" />
                  <Element label="Os" />
                  <Element label="Hs" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Co" />
                  <Element label="Rh" />
                  <Element label="Ir" />
                  <Element label="Mt" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Ni" />
                  <Element label="Pd" />
                  <Element label="Pt" />
                  <Element label="Ds" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Cu" />
                  <Element label="Ag" />
                  <Element label="Au" />
                  <Element label="Rg" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Zn" />
                  <Element label="Cd" />
                  <Element label="Hg" />
                  <Element label="Cn" />
                </PanelThree>
              </BlockThree>
              <BlockFour className={this.props.classes.blockFour} >
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="B" />
                  <Element label="Al" />
                  <Element label="Ga" />
                  <Element label="In" />
                  <Element label="Ti" />
                  <Element label="Nh" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="C" />
                  <Element label="Si" />
                  <Element label="Ge" />
                  <Element label="Sn" />
                  <Element label="Rb" />
                  <Element label="Fl" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="N" />
                  <Element label="P" />
                  <Element label="As" />
                  <Element label="Sb" />
                  <Element label="Bi" />
                  <Element label="Mc" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="O" />
                  <Element label="S" />
                  <Element label="Se" />
                  <Element label="Te" />
                  <Element label="Po" />
                  <Element label="Lv" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="F" />
                  <Element label="Cl" />
                  <Element label="Br" />
                  <Element label="I" />
                  <Element label="At" />
                  <Element label="Ts" />
                </PanelFour>
              </BlockFour>
              <PanelFive className={this.props.classes.panelFive} >
                <Element label="He" />
                <Element label="Ne" />
                <Element label="Ar" />
                <Element label="Kr" />
                <Element label="Xe" />
                <Element label="Rn" />
                <Element label="Og" />
              </PanelFive>
            </Container>

            <LowerContainer className={this.props.classes.lowerContainer} >
              <Bottom>
                <Element label="La" />
                <Element label="Ac" />
              </Bottom>
              <Bottom>
                <Element label="Ce" />
                <Element label="Th" />
              </Bottom>
              <Bottom>
                <Element label="Pr" />
                <Element label="Pa" />
              </Bottom>
              <Bottom>
                <Element label="Nd" />
                <Element label="U" />
              </Bottom>
              <Bottom>
                <Element label="Pm" />
                <Element label="Np" />
              </Bottom>
              <Bottom>
                <Element label="Sm" />
                <Element label="Pu" />
              </Bottom>
              <Bottom>
                <Element label="Eu" />
                <Element label="Am" />
              </Bottom>
              <Bottom>
                <Element label="Gd" />
                <Element label="Cm" />
              </Bottom>
              <Bottom>
                <Element label="Tb" />
                <Element label="Bk" />
              </Bottom>
              <Bottom>
                <Element label="Dy" />
                <Element label="Cf" />
              </Bottom>
              <Bottom>
                <Element label="Ho" />
                <Element label="Es" />
              </Bottom>
              <Bottom>
                <Element label="Er" />
                <Element label="Fm" />
              </Bottom>
              <Bottom>
                <Element label="Tm" />
                <Element label="Md" />
              </Bottom>
              <Bottom>
                <Element label="Yb" />
                <Element label="No" />
              </Bottom>
              <Bottom>
                <Element label="Lu" />
                <Element label="Lr" />
              </Bottom>
            </LowerContainer>
          </div>
          }
        </Section>
      </div>
    );
  }
}

PeriodicTable.propTypes = {
  selection: PropTypes.string.isRequired,
  clearSelection: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


export default (withStyles(styles, { withTheme: true }))(PeriodicTable);
