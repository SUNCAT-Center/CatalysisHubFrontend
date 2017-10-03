/**
 *
 * PeriodicTable
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Element from 'containers/ElementContainer';


import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const Section = styled.section`
    width: 900px;
    max-width: 90%;
    margin: 0px auto;
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

const Button = styled(RaisedButton)`
  margin: 12px;
`;

class PeriodicTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {/* Periodic Table of Elements */}
        <Section>
          <TextField
            type="text"
            name="element_selection"
            size={150}
            hintText="Selected Elements (click on Table)"
            value={this.props.selection}
          />
          <Button label="Clear" />
          <Button label="Search" />
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
            <PanelThree>
              <Element label="Sc" />
              <Element label="Y" />
              <Element label="&nbsp;" />
              <Element label="&nbsp;" />
            </PanelThree>
            <PanelThree>
              <Element label="Ti" />
              <Element label="Zr" />
              <Element label="Hf" />
              <Element label="Rf" />
            </PanelThree>
            <PanelThree>
              <Element label="V" />
              <Element label="Nb" />
              <Element label="Ta" />
              <Element label="Db" />
            </PanelThree>
            <PanelThree>
              <Element label="Cr" />
              <Element label="Mo" />
              <Element label="W" />
              <Element label="Sg" />
            </PanelThree>
            <PanelThree>
              <Element label="Mn" />
              <Element label="Tc" />
              <Element label="Re" />
              <Element label="Bh" />
            </PanelThree>
            <PanelThree>
              <Element label="Fe" />
              <Element label="Ru" />
              <Element label="Os" />
              <Element label="Hs" />
            </PanelThree>
            <PanelThree>
              <Element label="Co" />
              <Element label="Rh" />
              <Element label="Ir" />
              <Element label="Mt" />
            </PanelThree>
            <PanelThree>
              <Element label="Ni" />
              <Element label="Pd" />
              <Element label="Pt" />
              <Element label="Ds" />
            </PanelThree>
            <PanelThree>
              <Element label="Cu" />
              <Element label="Ag" />
              <Element label="Au" />
              <Element label="Rg" />
            </PanelThree>
            <PanelThree>
              <Element label="Zn" />
              <Element label="Cd" />
              <Element label="Hg" />
              <Element label="Cn" />
            </PanelThree>
            <PanelFour>
              <Element label="B" />
              <Element label="Al" />
              <Element label="Ga" />
              <Element label="In" />
              <Element label="Ti" />
              <Element label="Nh" />
            </PanelFour>
            <PanelFour>
              <Element label="C" />
              <Element label="Si" />
              <Element label="Ge" />
              <Element label="Sn" />
              <Element label="Rb" />
              <Element label="Fl" />
            </PanelFour>
            <PanelFour>
              <Element label="N" />
              <Element label="P" />
              <Element label="As" />
              <Element label="Sb" />
              <Element label="Bi" />
              <Element label="Mc" />
            </PanelFour>
            <PanelFour>
              <Element label="O" />
              <Element label="S" />
              <Element label="Se" />
              <Element label="Te" />
              <Element label="Po" />
              <Element label="Lv" />
            </PanelFour>
            <PanelFour>
              <Element label="F" />
              <Element label="Cl" />
              <Element label="Br" />
              <Element label="I" />
              <Element label="At" />
              <Element label="Ts" />
            </PanelFour>
            <PanelFive>
              <Element label="He" />
              <Element label="Ne" />
              <Element label="Ar" />
              <Element label="Kr" />
              <Element label="Xe" />
              <Element label="Rn" />
              <Element label="Og" />
            </PanelFive>
          </Container>

          <LowerContainer>
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
        </Section>
      </div>
    );
  }
}

PeriodicTable.propTypes = {
  selection: PropTypes.string.isRequired,

};

export default PeriodicTable;
