/**
*
* GeneralSearch
*
*/

import React from 'react';
import styled from 'styled-components';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { MdClear, MdSearch } from 'react-icons/lib/md';

const Button = styled(RaisedButton)`
  margin: 12px;
`;

class GeneralSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>General Search</h2>
        <TextField hintText="Free Text Search" />
        {'\t '}
        <TextField hintText="Composition" />
        {'\t '}
        <TextField hintText="Year" />
        <br />
        <br />
        <TextField hintText="Authors" />
        {'\t '}
        <TextField hintText="Title of Article" />
        {'\t '}
        <TextField hintText="Title of Journal" />
        <br />

        <SelectField
          floatingLabelText="Facet"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
          <MenuItem value="any" primaryText="any" />
          <MenuItem value="111" primaryText="(111)" />
          <MenuItem value="100" primaryText="(100)" />
          <MenuItem value="110" primaryText="(110)" />
          <MenuItem value="210" primaryText="(210)" />
          <MenuItem value="310" primaryText="(310)" />
          <MenuItem value="other" primaryText="other" />
        </SelectField>
        <SelectField
          floatingLabelText="Site"
          floatingLabelStyle={{
            fontFamily: 'Arial',
          }}
        >
          <MenuItem value="any" primaryText="any" />
          <MenuItem value="fcc" primaryText="fcc" />
          <MenuItem value="hcp" primaryText="hcp" />
          <MenuItem value="bridge" primaryText="bridge" />
          <MenuItem value="hollow" primaryText="hollow" />
          <MenuItem value="top" primaryText="top" />
          <MenuItem value="other" primaryText="other" />
        </SelectField>
        <br />
        <Button label="Clear" icon={<MdClear />} />
        <Button label="Search" icon={<MdSearch />} />
      </div>
    );
  }
}

GeneralSearch.propTypes = {

};

export default GeneralSearch;
