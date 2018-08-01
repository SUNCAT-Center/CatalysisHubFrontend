import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
  publicationEntry: {
  },
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
      {_.isEmpty(this.props.selectedReaction) ? null :
      <Paper className={this.props.classes.paper}>
        <Grid container direction="column" width="100%">
          <h2>{this.props.selectedReaction.Equation} - Reaction Geometries</h2>
          <Hidden mdUp>
            <BarrierChart {...this.props} thumbnailSize={50} />
          </Hidden>
          <Hidden smDown>
            <BarrierChart {...this.props} />
          </Hidden>
          {this.props.reactionSystems.length !== 0 ? null :
          <ul className={this.props.classes.publicationEntry}>
            {Object.keys(this.props.publication).map((key, i) => {
              if (this.props.publication[key] !== null) {
                if (key === 'authors') {
                  return (
                    <li key={`publine_${i}`}>
                      {key}: {JSON.parse(this.props.publication[key]).join('; ')}
                    </li>
                  );
                }
                return (
                  <li key={`publine_${i}`}>
                    {key}: {this.props.publication[key]}
                  </li>
                );
              }
              return null;
            })
                  }
          </ul>

            }
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
            {tabValue === 5 && typeof this.props.reactionSystems[5] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[5]} selectedUUID={this.props.reactionSystems[4].uniqueId} /> }
            {tabValue === 6 && typeof this.props.reactionSystems[6] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[6]} selectedUUID={this.props.reactionSystems[6].uniqueId} /> }
            {tabValue === 7 && typeof this.props.reactionSystems[7] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[7]} selectedUUID={this.props.reactionSystems[7].uniqueId} /> }
            {tabValue === 8 && typeof this.props.reactionSystems[8] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[8]} selectedUUID={this.props.reactionSystems[8].uniqueId} /> }
            {tabValue === 9 && typeof this.props.reactionSystems[9] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[9]} selectedUUID={this.props.reactionSystems[9].uniqueId} /> }
            {tabValue === 10 && typeof this.props.reactionSystems[10] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[10]} selectedUUID={this.props.reactionSystems[10].uniqueId} /> }
            {tabValue === 11 && typeof this.props.reactionSystems[11] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[11]} selectedUUID={this.props.reactionSystems[11].uniqueId} /> }
            {tabValue === 12 && typeof this.props.reactionSystems[12] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[12]} selectedUUID={this.props.reactionSystems[12].uniqueId} /> }
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
  publication: PropTypes.object,
};

const mapStateToProps = (state) => ({
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
  publication: state.get('energiesPageReducer').publication,
});

const mapDispatchToProps = () => ({
});


exports.ReactionStructures = withStyles(styles, { withTheme: true })(
connect(mapStateToProps, mapDispatchToProps)(ReactionStructures)

);
