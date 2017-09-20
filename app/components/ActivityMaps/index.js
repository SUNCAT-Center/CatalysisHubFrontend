/**
 *
 * ActivityMaps
 *
 */

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import PeriodicTable from '../PeriodicTable';

class ActivityMaps extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
            <span>Choose Reaction</span>
            <select>
            <option>HER (2 structures)</option>
            <option>OER (4 structures)</option>
            <option>ORR</option>
            <option>CO oxidation (2 structures)</option>
            <option>CO2RR (6+ structures)</option>
            <option>Ammonia</option>
            </select>
            <PeriodicTable />
            </div>
        );
    }
}

ActivityMaps.propTypes = {

};

export default ActivityMaps;
