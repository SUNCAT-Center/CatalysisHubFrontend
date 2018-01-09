/**
 *
 * ActivityMaps
 *
 */

import React from 'react';
// import styled from 'styled-components';
import Flexbox from 'flexbox-react';


import PeriodicTableSelector from 'containers/PeriodicTableSelector';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { MdWarning } from 'react-icons/lib/md';

import ActivityMapPlot from './ActivityMapPlot';
import StructureView from './StructureView';

class ActivityMaps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      chemicalReaction: 'OER-1',
    };
  }
  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }
  render() {
    return (
      <Flexbox flexDirection="column" minHeight="100vh">
        <div><MdWarning />Under construction.</div>
        <Flexbox
          height="75px" style={{
            paddingLeft: '45px',
          }}
        >
          <FormControl
            style={{ minWidth: 220, margin: 12 }}
          >
            <InputLabel>Chemical Reaction</InputLabel>
            <Select
              onChange={this.handleChange('chemicalReaction')}
              value={this.state.chemicalReaction}
            >
              <MenuItem value="OER-2">OER (2 descriptors)</MenuItem>
              {/*
              <MenuItem value="HER">HER (1 descriptor)</MenuItem>
              <MenuItem value="OER-1">OER (1 descriptor)</MenuItem>
              <MenuItem value="ORR-1">ORR (1 descriptors)</MenuItem>
              <MenuItem value="ORR-2">ORR (2 desescriptor)</MenuItem>
              <MenuItem value="CO2RR">CO reduction (2 descriptors)</MenuItem>
              <MenuItem value="Ammonia">Ammonia Synthesis</MenuItem>
              <MenuItem value="COx">CO oxidation (2 descriptors)</MenuItem>
              <MenuItem value="deNOx">NO reduction (2 descriptors)</MenuItem>
              */}
            </Select>
          </FormControl>

        </Flexbox>
        <Flexbox minHeight="100px">
          <PeriodicTableSelector />
        </Flexbox>
        <div>
          <Flexbox width="100%">
            <ActivityMapPlot {...this.props} />
          </Flexbox>
          <Flexbox height="1000px">
            <StructureView {...this.props} />
          </Flexbox>

        </div>
      </Flexbox>
    );
  }
}

ActivityMaps.propTypes = {

};

export default ActivityMaps;
