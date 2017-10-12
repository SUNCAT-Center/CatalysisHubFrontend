/**
 *
 * ActivityMaps
 *
 */

import React from 'react';
// import styled from 'styled-components';
import Flexbox from 'flexbox-react';

import ActivityMapOER from 'components/ActivityMapOer';
import StructureView from 'components/StructureView';

import PeriodicTableSelector from 'containers/PeriodicTableSelector';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ActivityMaps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Flexbox flexDirection="column" minHeight="100vh">
        <Flexbox
          height="75px" style={{
            paddingLeft: '45px',
          }}
        >
          <SelectField floatingLabelText="Chemical Reaction" >
            <MenuItem value="HER" primaryText="HER (2 structures)" />
            <MenuItem value="OER" primaryText="OER (2 descriptors)" />
            <MenuItem value="ORR" primaryText="ORR (2 descriptors)" />
            <MenuItem value="CO2RR" primaryText="CO reduction (2 descriptors)" />
            <MenuItem value="Ammonia" primaryText="Ammonia Synthesis" />
            <MenuItem value="COx" primaryText="CO oxidation (2 descriptors)" />
            <MenuItem value="deNOx" primaryText="NO reduction (2 descriptors)" />
          </SelectField>

        </Flexbox>
        <Flexbox height="500px">
          <PeriodicTableSelector />
        </Flexbox>
        <div>
          <Flexbox height="950px" width="100%">
            <ActivityMapOER />
          </Flexbox>
          <Flexbox height="1000px">
            <StructureView />
          </Flexbox>

        </div>
      </Flexbox>
    );
  }
}

ActivityMaps.propTypes = {

};

export default ActivityMaps;
