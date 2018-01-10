import React, { PropTypes } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';

import SingleStructureView from 'components/SingleStructureView';

import BarrierChart from 'components/BarrierChart';

const styles = () => ({
});

const prettyPrintReaction = (reactants, products) => (`${Object.keys(JSON.parse(reactants)).join(' + ')}  ⇄  ${Object.keys(JSON.parse(products)).join(' + ')}`
).replace(/star/g, '*').replace(/gas/g, '(ℊ)');


function TabContainer(props) {
  return (<Typography component="div" style={{ padding: 8 * 3 }}>
    {props.children}
  </Typography>);
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const initialState = {
  tabValue: 0,
};

class ReactionStructures extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
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
        <h2>{prettyPrintReaction(this.props.selectedReaction.reactants, this.props.selectedReaction.products)} - Reaction Geometries</h2>
        <Hidden smUp>
          <BarrierChart {...this.props} thumbnailSize={50} />
        </Hidden>
        <Hidden smDown>
          <BarrierChart {...this.props} />
        </Hidden>
        <Tabs
          value={tabValue}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          {this.props.reactionSystems.map((system, i) =>
            <Tab label={system.key} key={`reaction_tab_${i}`} />
              )}
        </Tabs>
        <TabContainer>
          {tabValue === 0 && typeof this.props.reactionSystems[0] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[0]} selectedUUID={this.props.reactionSystems[0].uniqueId} /> }
          {tabValue === 1 && typeof this.props.reactionSystems[1] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[1]} selectedUUID={this.props.reactionSystems[1].uniqueId} /> }
          {tabValue === 2 && typeof this.props.reactionSystems[2] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[2]} selectedUUID={this.props.reactionSystems[2].uniqueId} /> }
          {tabValue === 3 && typeof this.props.reactionSystems[3] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[3]} selectedUUID={this.props.reactionSystems[3].uniqueId} /> }
          {tabValue === 4 && typeof this.props.reactionSystems[4] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[4]} selectedUUID={this.props.reactionSystems[4].uniqueId} /> }
        </TabContainer>
      </div>
      }
    </div>
    );
  }
}

ReactionStructures.propTypes = {
  reactionSystems: PropTypes.array.isRequired,
  selectedReaction: PropTypes.object,
};

exports.ReactionStructures = withStyles(styles, { withTheme: true })(ReactionStructures);
