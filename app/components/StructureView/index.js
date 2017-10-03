/**
*
* StructureView
*
*/

import React from 'react';

/* import { FormattedMessage } from 'react-intl'; */
/* import messages from './messages'; */

import { Tabs, Tab } from 'material-ui/Tabs';


function StructureView() {
  return (
    <div>
      <h2>Detailed Structure View</h2>
      <Tabs
        tabItemContainerStyle={{ width: '900px' }}
      >
        <Tab label="Structure One">
          <h2>... More to follow on Structure 1</h2>
        </Tab>
        <Tab label="Structure Two">
          <h2>... More to follow on Structure 2</h2>
        </Tab>
        <Tab label="Structure Three">
          <h2>... More to follow on Structure 3</h2>
        </Tab>
        <Tab label="Structure Four">
          <h2>... More to follow on Structure 4</h2>
        </Tab>
      </Tabs>
    </div>
  );
}

StructureView.propTypes = {

};

export default StructureView;
