/**
 *
 * StructureView2
 *
 */

import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import GeometryCanvas from 'components/GeometryCanvas';

import { backendRoot } from 'utils/constants';

class StructureView2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const cifurl1 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOempty/final_geo_for_db_Ce_6f_doping_addOempty.traj`;
    const cifurl2 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddOH/final_geo_for_db_Ce_6f_doping_addOaddOH.traj`;
    const cifurl3 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddO/final_geo_for_db_Ce_6f_doping_addOaddO.traj`;
    const cifurl4 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddOOH/final_geo_for_db_Ce_6f_doping_addOaddOOH.traj`;

    return (
      <div>
        <h2>Detailed Structure View</h2>
        <Tabs
          tabItemContainerStyle={{ width: '900px' }}
        >
          <Tab label="Structure One">
            <h2>Structure 1</h2>
            <GeometryCanvas id="structure1" cifurl={cifurl1} />
          </Tab>
          <Tab label="Structure Two">
            <h2>Structure 2</h2>
            <GeometryCanvas id="structure2" cifurl={cifurl2} />
          </Tab>
          <Tab label="Structure Three">
            <h2>Structure 3</h2>
            <GeometryCanvas id="structure3" cifurl={cifurl3} />
          </Tab>
          <Tab label="Structure Four">
            <h2>Structure 4</h2>
            <GeometryCanvas id="structure4" cifurl={cifurl4} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

StructureView2.propTypes = {

};

export default StructureView2;
