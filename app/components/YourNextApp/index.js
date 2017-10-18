/**
*
* YourNextApp
*
*/

import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import styled from 'styled-components';

const supportAtoms = [
  'Ag', 'Al', 'As', 'Au', 'B', 'Ba', 'Be', 'Bi', 'Ca', 'Cd',
  'Co', 'Cr', 'Cs', 'Cu', 'Fe', 'Ga', 'Ge', 'Hf', 'Hg', 'In', 'Ir', 'K', 'La',
  'Li', 'Mg', 'Mn', 'Mo', 'Na', 'Nb', 'Ni', 'O', 'Os', 'Pb', 'Pd', 'Pt', 'Rb',
  'Re', 'Rh', 'Ru', 'Sb', 'Sc', 'Si', 'Sn', 'Sr', 'Ta', 'Te', 'Ti', 'Tl', 'V',
  'W', 'Y', 'Zn', 'Zr',
];

const supportLength = supportAtoms.length;

// const styles = {
//  customWidth: {
//    width: 150,
//  },
// };

const items = [];
for (let i = 0; i < supportLength; i += 1) {
  items.push(<MenuItem value={supportAtoms[i]} primaryText={supportAtoms[i]} />);
}


class YourNextApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  // state = {
  //   value: 1,
  // };

  handleChange = (event, index, value) => this.setState({ value });

  render() {
    return (
      <div>
        <h2>AtoML</h2>
        <div>
          {'Mockup of an AtoML app.'}
        </div>

        <div>
          <SelectField
            floatingLabelText="First Support"
            // value={this.state.value}
            // onChange={this.handleChange}
            maxHeight={200}
          >
            {items}
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Second Support"
            // value={this.state.value}
            // onChange={this.handleChange}
            // disabled={false}
            maxHeight={200}
          >
            {items}
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Facet"
            // value={this.state.value}
            // onChange={this.handleChange}
            // style={styles.customWidth}
          >
            <MenuItem value={'0001'} primaryText="0001" />
            <MenuItem value={'0001step'} primaryText="0001step" />
            <MenuItem value={'100'} primaryText="100" />
            <MenuItem value={'110'} primaryText="110" />
            <MenuItem value={'111'} primaryText="111" />
            <MenuItem value={'211'} primaryText="211" />
            <MenuItem value={'311'} primaryText="311" />
            <MenuItem value={'532'} primaryText="532" />
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Adsorbate"
            // value={this.state.value}
            // onChange={this.handleChange}
            // autoWidth={true}
          >
            <MenuItem value={'graphene'} primaryText="graphene" />
            <MenuItem value={'CH2CH2'} primaryText="CH2CH2" />
            <MenuItem value={'CH3CH2CH3'} primaryText="CH3CH2CH3" />
            <MenuItem value={'CH3CH3'} primaryText="CH3CH3" />
            <MenuItem value={'CO'} primaryText="CO" />
            <MenuItem value={'CO2'} primaryText="CO2" />
            <MenuItem value={'H2O'} primaryText="H2O" />
            <MenuItem value={'HCN'} primaryText="HCN" />
            <MenuItem value={'NH3'} primaryText="NH3" />
            <MenuItem value={'NO'} primaryText="NO" />
            <MenuItem value={'O2'} primaryText="O2" />
            <MenuItem value={'O'} primaryText="O" />
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Concentration"
            // value={this.state.value}
            // onChange={this.handleChange}
            // autoWidth={true}
          >
            <MenuItem value={'0.25'} primaryText="0.25" />
            <MenuItem value={'0.50'} primaryText="0.50" />
            <MenuItem value={'0.75'} primaryText="0.75" />
          </SelectField>
          <br />
          <SelectField
            floatingLabelText="Site"
            // value={this.state.value}
            // onChange={this.handleChange}
            // autoWidth={true}
          >
            <MenuItem value={'AA'} primaryText="AA" />
            <MenuItem value={'AB'} primaryText="AB" />
            <MenuItem value={'BB'} primaryText="BB" />
          </SelectField>
        </div>

        <div>
          {'Below will give output from the GP model.'}
        </div>

      </div>
    );
  }
}

YourNextApp.propTypes = {

};

export default YourNextApp;
