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

class ActivityMaps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Flexbox flexDirection="column" minHeight="100vh">
        <Flexbox height="25px">
          <span>Choose Reaction</span>
          <select>
            <option>HER (2 structures)</option>
            <option>OER (4 structures)</option>
            <option>ORR</option>
            <option>CO oxidation (2 structures)</option>
            <option>CO2RR (6+ structures)</option>
            <option>Ammonia</option>
          </select>
        </Flexbox>
        <Flexbox height="500px">
          <PeriodicTableSelector />
        </Flexbox>
        <div>
          <Flexbox height="900px" width="100%">
            <ActivityMapOER />
          </Flexbox>
          <Flexbox height="600px">
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
