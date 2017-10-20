/**
 *
 * StructureView2
 *
 */

import React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import GeometryCanvas from 'components/GeometryCanvas';

import { backendRoot } from 'utils/constants';
import PropTypes from 'prop-types';

function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class StructureView2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const cifurl1 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOempty/final_geo_for_db_Ce_6f_doping_addOempty.traj`;
    const cifurl2 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddOH/final_geo_for_db_Ce_6f_doping_addOaddOH.traj`;
    const cifurl3 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddO/final_geo_for_db_Ce_6f_doping_addOaddO.traj`;
    const cifurl4 = `${backendRoot}get_cif/?path=6f_doping/Ce_6f_doping/addOaddOOH/final_geo_for_db_Ce_6f_doping_addOaddOOH.traj`;

    const cifUrls = [
      cifurl1,
      cifurl2,
      cifurl3,
      cifurl4,
    ];

    const { value } = this.state;

    return (
      <div>
        <h2>Detailed Structure View</h2>
        <Tabs
          fullWidth
          value={value}
          onChange={this.handleChange}
        >
          <Tab label="Structure One">
            <h2>Structure 1</h2>
            <GeometryCanvas id="structure1" />
          </Tab>
          <Tab label="Structure Two">
            <h2>Structure 2</h2>
            <GeometryCanvas id="structure2" />
          </Tab>
          <Tab label="Structure Three">
            <h2>Structure 3</h2>
            <GeometryCanvas id="structure3" />
          </Tab>
          <Tab label="Structure Four">
            <h2>Structure 4</h2>
            <GeometryCanvas id="structure4" />
          </Tab>
        </Tabs>
        <TabContainer>
          <GeometryCanvas cifurl={cifUrls[value]} />
        </TabContainer>
      </div>
    );
  }
}

StructureView2.propTypes = {

};

export default StructureView2;
