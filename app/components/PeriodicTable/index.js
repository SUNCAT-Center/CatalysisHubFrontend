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
      show_table: false,
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
                <Element label="H" backgroundColor="gas" />
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
                  <Element label="Rf" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="V" />
                  <Element label="Nb" />
                  <Element label="Ta" />
                  <Element label="Db" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Cr" />
                  <Element label="Mo" />
                  <Element label="W" />
                  <Element label="Sg" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Mn" />
                  <Element label="Tc" backgroundColor="artificial" />
                  <Element label="Re" />
                  <Element label="Bh" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Fe" />
                  <Element label="Ru" />
                  <Element label="Os" />
                  <Element label="Hs" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Co" />
                  <Element label="Rh" />
                  <Element label="Ir" />
                  <Element label="Mt" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Ni" />
                  <Element label="Pd" />
                  <Element label="Pt" />
                  <Element label="Ds" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Cu" />
                  <Element label="Ag" />
                  <Element label="Au" />
                  <Element label="Rg" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element label="Zn" />
                  <Element label="Cd" />
                  <Element label="Hg" backgroundColor="liquid" />
                  <Element label="Cn" backgroundColor="artificial" />
                </PanelThree>
              </BlockThree>
              <BlockFour className={this.props.classes.blockFour} >
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="B" />
                  <Element label="Al" />
                  <Element label="Ga" />
                  <Element label="In" />
                  <Element label="Tl" />
                  <Element label="Nh" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="C" />
                  <Element label="Si" />
                  <Element label="Ge" />
                  <Element label="Sn" />
                  <Element label="Rb" />
                  <Element label="Fl" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="N" backgroundColor="gas" />
                  <Element label="P" />
                  <Element label="As" />
                  <Element label="Sb" />
                  <Element label="Bi" />
                  <Element label="Mc" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="O" backgroundColor="gas" />
                  <Element label="S" />
                  <Element label="Se" />
                  <Element label="Te" />
                  <Element label="Po" />
                  <Element label="Lv" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element label="F" backgroundColor="gas" />
                  <Element label="Cl" backgroundColor="gas" />
                  <Element label="Br" backgroundColor="liquid" />
                  <Element label="I" />
                  <Element label="At" />
                  <Element label="Ts" backgroundColor="artificial" />
                </PanelFour>
              </BlockFour>
              <PanelFive className={this.props.classes.panelFive} >
                <Element label="He" backgroundColor="gas" />
                <Element label="Ne" backgroundColor="gas" />
                <Element label="Ar" backgroundColor="gas" />
                <Element label="Kr" backgroundColor="gas" />
                <Element label="Xe" backgroundColor="gas" />
                <Element label="Rn" backgroundColor="gas" />
                <Element label="Og" backgroundColor="artificial" />
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
                <Element label="Pm" backgroundColor="artificial" />
                <Element label="Np" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Sm" />
                <Element label="Pu" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Eu" />
                <Element label="Am" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Gd" />
                <Element label="Cm" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Tb" />
                <Element label="Bk" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Dy" />
                <Element label="Cf" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Ho" />
                <Element label="Es" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Er" />
                <Element label="Fm" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Tm" />
                <Element label="Md" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Yb" />
                <Element label="No" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element label="Lu" />
                <Element label="Lr" backgroundColor="artificial" />
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
