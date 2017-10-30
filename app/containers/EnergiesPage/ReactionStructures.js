import React, { PropTypes } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';

import SingleStructureView from 'components/SingleStructureView';

function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export class ReactionStructures extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
    };
  }
  handleChange = (event, value) => {
    this.setState({
      tabValue: value,
    });
  }
  render() {
    let { tabValue } = this.state;
    tabValue = Math.min(tabValue, this.props.reactionSystems.length);

    return (<div> {/* div necessary before wrapping ternary expression */}
      {this.props.reactionSystems.length === 0 ? null :
      <div>
        <h2>Reaction Geometries</h2>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          {this.props.reactionSystems.map((system, i) =>
            <Tab label={system.Formula} key={`reaction_tab_${i}`} />
          )}
        </Tabs>
        <div>
          <TabContainer>
            {typeof this.props.reactionSystems === 'undefined' || this.props.reactionSystems.length <= tabValue ? null : <SingleStructureView selectedSystem={this.props.reactionSystems[tabValue]} selectedUUID={this.props.reactionSystems[tabValue].uniqueId} /> }
          </TabContainer>
        </div>
      </div>
      }
    </div>
    );
  }
}

ReactionStructures.propTypes = {
  reactionSystems: PropTypes.array.isRequired,
};
