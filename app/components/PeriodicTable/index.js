/**
 *
 * PeriodicTable
 *
 */

import React from 'react';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';


const Box = styled.div`
    border: 3px solid black; 
    max-width: 50px;
    max-height: 50px; 
    padding: 10px;
    line-height: 50px; 
    text-align: center; 
    font-size: 1.23em;
`;

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

class PeriodicTable extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
            {/*/ Periodic Table of Elements */}
            <Section>
            <span> Selection </span>
            <input type="text" name="element_selection"/>
            <Container>
            <PanelOne>
            <Box label="H"> H </Box>
            <Box label="Li"> Li </Box>
            <Box label="Na"> Na </Box>
            <Box label="K"> K </Box>
            <Box label="Rb"> Rb </Box>
            <Box label="Cs"> Cs </Box>
            <Box label="Fr"> Fr </Box>
            </PanelOne>
            <PanelTwo>
            <Box label="Be"> Be </Box>
            <Box label="Mg"> Mg </Box>
            <Box label="Ca"> Ca </Box>
            <Box label="Sr"> Sr </Box>
            <Box label="Ba"> Ba </Box>
            <Box label="Ra"> Ra </Box>
            </PanelTwo>
            <PanelThree>
            <Box label="Sc"> Sc </Box>
            <Box label="Y"> Y </Box>
            <Box label="X"> X </Box>
            <Box label="X"> X </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Ti"> Ti </Box>
            <Box label="Zr"> Zr </Box>
            <Box label="Hf"> Hf </Box>
            <Box label="Rf"> Rf </Box>
            </PanelThree>
            <PanelThree>
            <Box label="V"> V </Box>
            <Box label="Nb"> Nb </Box>
            <Box label="Ta"> Ta </Box>
            <Box label="Db"> Db </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Cr"> Cr </Box>
            <Box label="Mo"> Mo </Box>
            <Box label="W"> W </Box>
            <Box label="Sg"> Sg </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Mn"> Mn </Box>
            <Box label="Tc"> Tc </Box>
            <Box label="Re"> Re </Box>
            <Box label="Bh"> Bh </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Fe"> Fe </Box>
            <Box label="Ru"> Ru </Box>
            <Box label="Os"> Os </Box>
            <Box label="Hs"> Hs </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Co"> Co </Box>
            <Box label="Rh"> Rh</Box>
            <Box label="Ir"> Ir </Box>
            <Box label="Mt"> Mt </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Ni"> Ni </Box>
            <Box label="Pd"> Pd </Box>
            <Box label="Pt"> Pt </Box>
            <Box label="Ds"> Ds </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Cu"> Cu </Box>
            <Box label="Ag"> Ag </Box>
            <Box label="Au"> Au </Box>
            <Box label="Rg"> Rg </Box>
            </PanelThree>
            <PanelThree>
            <Box label="Zn"> Zn </Box>
            <Box label="Cd"> Cd </Box>
            <Box label="Hg"> Hg </Box>
            <Box label="Cn"> Cn </Box>
            </PanelThree>
            <PanelFour>
            <Box label="B"> B </Box>
            <Box label="Al"> Al </Box>
            <Box label="Ga"> Ga </Box>
            <Box label="In"> In </Box>
            <Box label="Ti"> Ti </Box>
            <Box label="Uut"> Uut </Box>
            </PanelFour>
            <PanelFour>
            <Box label="C"> C </Box>
            <Box label="Si"> Si </Box>
            <Box label="Ge"> Ge </Box>
            <Box label="Sn"> Sn </Box>
            <Box label="Rb"> Rb </Box>
            <Box label="Fl"> Fl </Box>
            </PanelFour>
            <PanelFour>
            <Box label="N"> N </Box>
            <Box label="P"> P </Box>
            <Box label="As"> As </Box>
            <Box label="Sb"> Sb </Box>
            <Box label="Bi"> Bi </Box>
            <Box label="Uup"> Uup </Box>
            </PanelFour>
            <PanelFour>
            <Box label="O"> O </Box>
            <Box label="S"> S </Box>
            <Box label="Se"> Se </Box>
            <Box label="Te"> Te </Box>
            <Box label="Po"> Po </Box>
            <Box label="Lv"> Lv </Box>
            </PanelFour>
            <PanelFour>
            <Box label="F"> F </Box>
            <Box label="Cl"> Cl </Box>
            <Box label="Br"> Br </Box>
            <Box label="I"> I </Box>
            <Box label="At"> At </Box>
            <Box label="Uus"> Uus </Box>
            </PanelFour>
            <PanelFive>
            <Box label="He"> He </Box>
            <Box label="Ne"> Ne </Box>
            <Box label="Ar"> Ar </Box>
            <Box label="Kr"> Kr </Box>
            <Box label="Xe"> Xe </Box>
            <Box label="Rn"> Rn </Box>
            <Box label="Uuo"> Uuo </Box>
            </PanelFive>
            </Container>



            <LowerContainer>
            <Bottom>
            <Box label="La"> La </Box>
            <Box label="Ac"> Ac </Box>
            </Bottom>
            <Bottom>
            <Box label="Ce"> Ce </Box>
            <Box label="Th"> Th </Box>
            </Bottom>
            <Bottom>
            <Box label="Pr"> Pr </Box>
            <Box label="Pa"> Pa </Box>
            </Bottom>
            <Bottom>
            <Box label="Nd"> Nd </Box>
            <Box label="U"> U </Box>
            </Bottom>
            <Bottom>
            <Box label="Pm"> Pm </Box>
            <Box label="Np"> Np </Box>
            </Bottom>
            <Bottom>
            <Box label="Sm"> Sm </Box>
            <Box label="Pu"> Pu </Box>
            </Bottom>
            <Bottom>
            <Box label="Eu"> Eu </Box>
            <Box label="Am"> Am </Box>
            </Bottom>
            <Bottom>
            <Box label="Gd"> Gd </Box>
            <Box label="Cm"> Cm </Box>
            </Bottom>
            <Bottom>
            <Box label="Tb"> Tb </Box>
            <Box label="Bk"> Bk </Box>
            </Bottom>
            <Bottom>
            <Box label="Dy"> Dy </Box>
            <Box label="Cf"> Cf </Box>
            </Bottom>
            <Bottom>
            <Box label="Ho"> Ho </Box>
            <Box label="Es"> Es </Box>
            </Bottom>
            <Bottom>
            <Box label="Er"> Er </Box>
            <Box label="Fm"> Fm </Box>
            </Bottom>
            <Bottom>
            <Box label="Tm"> Tm </Box>
            <Box label="Md"> Md </Box>
            </Bottom>
            <Bottom>
            <Box label="Yb"> Yb </Box>
            <Box label="No"> No </Box>
            </Bottom>
            <Bottom>
            <Box label="Lu"> Lu </Box>
            <Box label="Lr"> Lr </Box>
            </Bottom>

            </LowerContainer>
            </Section>
            </div>
        );
    }
}

PeriodicTable.propTypes = {

};

export default PeriodicTable;
