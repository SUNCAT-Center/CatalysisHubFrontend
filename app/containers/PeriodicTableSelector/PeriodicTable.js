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
import Grid from 'material-ui/Grid';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MdClear, MdFilterList, MdArrowDropDown, MdArrowDropUp } from 'react-icons/lib/md';

const styles = (xtheme) => ({
  root: {
    flexGrow: 1,
  },
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
    width: 100%;
    max-width: 100%;
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
          <Grid container direction="row" justify="flex-start" className={this.props.classes.root}>
            <Grid item>
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
            </Grid>
            <Grid item>
              <MButton
                raised
                onClick={() => {
                  this.props.clearSelection();
                }}
              >
                <MdClear /> Clear
              </MButton>
            </Grid>
            <Grid item>
              <MButton raised color="primary">
                <MdFilterList /> Filter
              </MButton>
            </Grid>
            <Grid item>
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
            </Grid>
          </Grid>
          {this.state.show_table === false ? null :
          <div>
            <Container>
              <PanelOne>
                <Element {...this.props} label="H" backgroundColor="gas" />
                <Element {...this.props} label="Li" />
                <Element {...this.props} label="Na" />
                <Element {...this.props} label="K" />
                <Element {...this.props} label="Rb" />
                <Element {...this.props} label="Cs" />
                <Element {...this.props} label="Fr" />
              </PanelOne>
              <PanelTwo>
                <Element {...this.props} label="Be" />
                <Element {...this.props} label="Mg" />
                <Element {...this.props} label="Ca" />
                <Element {...this.props} label="Sr" />
                <Element {...this.props} label="Ba" />
                <Element label="Ra" />
              </PanelTwo>
              <BlockThree className={this.props.classes.blockThree} >
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Sc" />
                  <Element {...this.props} label="Y" />
                  <Element {...this.props} label="&nbsp;" />
                  <Element {...this.props} label="&nbsp;" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Ti" />
                  <Element {...this.props} label="Zr" />
                  <Element {...this.props} label="Hf" />
                  <Element {...this.props} label="Rf" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="V" />
                  <Element {...this.props} label="Nb" />
                  <Element {...this.props} label="Ta" />
                  <Element {...this.props} label="Db" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Cr" />
                  <Element {...this.props} label="Mo" />
                  <Element {...this.props} label="W" />
                  <Element {...this.props} label="Sg" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Mn" />
                  <Element {...this.props} label="Tc" backgroundColor="artificial" />
                  <Element {...this.props} label="Re" />
                  <Element {...this.props} label="Bh" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Fe" />
                  <Element {...this.props} label="Ru" />
                  <Element {...this.props} label="Os" />
                  <Element {...this.props} label="Hs" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Co" />
                  <Element {...this.props} label="Rh" />
                  <Element {...this.props} label="Ir" />
                  <Element {...this.props} label="Mt" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Ni" />
                  <Element {...this.props} label="Pd" />
                  <Element {...this.props} label="Pt" />
                  <Element {...this.props} label="Ds" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Cu" />
                  <Element {...this.props} label="Ag" />
                  <Element {...this.props} label="Au" />
                  <Element {...this.props} label="Rg" backgroundColor="artificial" />
                </PanelThree>
                <PanelThree className={this.props.classes.panelThree} >
                  <Element {...this.props} label="Zn" />
                  <Element {...this.props} label="Cd" />
                  <Element {...this.props} label="Hg" backgroundColor="liquid" />
                  <Element {...this.props} label="Cn" backgroundColor="artificial" />
                </PanelThree>
              </BlockThree>
              <BlockFour className={this.props.classes.blockFour} >
                <PanelFour className={this.props.classes.panelFour} >
                  <Element {...this.props} label="B" />
                  <Element {...this.props} label="Al" />
                  <Element {...this.props} label="Ga" />
                  <Element {...this.props} label="In" />
                  <Element {...this.props} label="Tl" />
                  <Element {...this.props} label="Nh" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element {...this.props} label="C" />
                  <Element {...this.props} label="Si" />
                  <Element {...this.props} label="Ge" />
                  <Element {...this.props} label="Sn" />
                  <Element {...this.props} label="Pb" />
                  <Element {...this.props} label="Fl" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element {...this.props} label="N" backgroundColor="gas" />
                  <Element {...this.props} label="P" />
                  <Element {...this.props} label="As" />
                  <Element {...this.props} label="Sb" />
                  <Element {...this.props} label="Bi" />
                  <Element {...this.props} label="Mc" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element {...this.props} label="O" backgroundColor="gas" />
                  <Element {...this.props} label="S" />
                  <Element {...this.props} label="Se" />
                  <Element {...this.props} label="Te" />
                  <Element {...this.props} label="Po" />
                  <Element {...this.props} label="Lv" backgroundColor="artificial" />
                </PanelFour>
                <PanelFour className={this.props.classes.panelFour} >
                  <Element {...this.props} label="F" backgroundColor="gas" />
                  <Element {...this.props} label="Cl" backgroundColor="gas" />
                  <Element {...this.props} label="Br" backgroundColor="liquid" />
                  <Element {...this.props} label="I" />
                  <Element {...this.props} label="At" />
                  <Element {...this.props} label="Ts" backgroundColor="artificial" />
                </PanelFour>
              </BlockFour>
              <PanelFive className={this.props.classes.panelFive} >
                <Element {...this.props} label="He" backgroundColor="gas" />
                <Element {...this.props} label="Ne" backgroundColor="gas" />
                <Element {...this.props} label="Ar" backgroundColor="gas" />
                <Element {...this.props} label="Kr" backgroundColor="gas" />
                <Element {...this.props} label="Xe" backgroundColor="gas" />
                <Element {...this.props} label="Rn" backgroundColor="gas" />
                <Element {...this.props} label="Og" backgroundColor="artificial" />
              </PanelFive>
            </Container>

            <LowerContainer className={this.props.classes.lowerContainer} >
              <Bottom>
                <Element {...this.props} label="La" />
                <Element {...this.props} label="Ac" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Ce" />
                <Element {...this.props} label="Th" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Pr" />
                <Element {...this.props} label="Pa" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Nd" />
                <Element {...this.props} label="U" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Pm" backgroundColor="artificial" />
                <Element {...this.props} label="Np" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Sm" />
                <Element {...this.props} label="Pu" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Eu" />
                <Element {...this.props} label="Am" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Gd" />
                <Element {...this.props} label="Cm" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Tb" />
                <Element {...this.props} label="Bk" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Dy" />
                <Element {...this.props} label="Cf" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Ho" />
                <Element {...this.props} label="Es" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Er" />
                <Element {...this.props} label="Fm" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Tm" />
                <Element {...this.props} label="Md" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Yb" />
                <Element {...this.props} label="No" backgroundColor="artificial" />
              </Bottom>
              <Bottom>
                <Element {...this.props} label="Lu" />
                <Element {...this.props} label="Lr" backgroundColor="artificial" />
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
