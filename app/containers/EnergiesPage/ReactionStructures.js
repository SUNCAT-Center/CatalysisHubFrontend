import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Hidden from 'material-ui/Hidden';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import SingleStructureView from 'components/SingleStructureView';

import BarrierChart from 'components/BarrierChart';

const styles = (theme) => ({
  tab: {
    backgroundColor: theme.palette.primary[50],
    textTransform: 'none',
  },
  paper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: 2 * theme.spacing.unit,
  },
});


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
      <Paper className={this.props.classes.paper}>
        <Grid container direction="column" width="100%">
          <h2>{this.props.selectedReaction.Equation} - Reaction Geometries</h2>
          <Hidden smUp>
            <BarrierChart {...this.props} thumbnailSize={50} />
          </Hidden>
          <Hidden smDown>
            <BarrierChart {...this.props} />
          </Hidden>
          <Tabs
            value={tabValue}
            onChange={this.handleChange}
            centered
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            scrollButtons="auto"
          >
            {this.props.reactionSystems.map((system, i) =>
              <Tab
                label={system.Formula} key={`reaction_tab_${i}`}
                className={this.props.classes.tab}
              />
              )}
          </Tabs>
          <TabContainer>
            {tabValue === 0 && typeof this.props.reactionSystems[0] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[0]} selectedUUID={this.props.reactionSystems[0].uniqueId} /> }
            {tabValue === 1 && typeof this.props.reactionSystems[1] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[1]} selectedUUID={this.props.reactionSystems[1].uniqueId} /> }
            {tabValue === 2 && typeof this.props.reactionSystems[2] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[2]} selectedUUID={this.props.reactionSystems[2].uniqueId} /> }
            {tabValue === 3 && typeof this.props.reactionSystems[3] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[3]} selectedUUID={this.props.reactionSystems[3].uniqueId} /> }
            {tabValue === 4 && typeof this.props.reactionSystems[4] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[4]} selectedUUID={this.props.reactionSystems[4].uniqueId} /> }
          </TabContainer>
        </Grid>
      </Paper>
      }
    </div>
    );
  }
}

ReactionStructures.propTypes = {
  reactionSystems: PropTypes.array.isRequired,
  selectedReaction: PropTypes.object,
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
});

const mapDispatchToProps = () => ({
});


exports.ReactionStructures = withStyles(styles, { withTheme: true })(
connect(mapStateToProps, mapDispatchToProps)(ReactionStructures)

);
