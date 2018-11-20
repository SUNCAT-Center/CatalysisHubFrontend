import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import _ from 'lodash';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import SingleStructureView from 'components/SingleStructureView';

import BarrierChart from 'components/BarrierChart';

import {
  FaExternalLink,
} from 'react-icons/lib/fa';
import {
  prettyPrintReference,
} from 'utils/functions';

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
    padding: theme.spacing.unit * 2,
  },
  warning: {
    display: 'inline-block',
    backgroundColor: theme.palette.sun[100],
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
        {(this.props.selectedReaction.facet !== 'undefined' && this.props.selectedReaction.facet !== '') ?
          <h2>
            {this.props.selectedReaction.Equation.replace('->', '→')} &nbsp; @  &nbsp; {this.props.selectedReaction.surfaceComposition} [{this.props.selectedReaction.facet}]
          </h2>
            :
          <h2>
            {this.props.selectedReaction.Equation.replace('->', '→')} &nbsp;
            on &nbsp; {this.props.selectedReaction.surfaceComposition}
          </h2>
        }
        <Grid container direction="column">
          <BarrierChart {...this.props} />
          {this.props.loading ? null :
          <div>
            <h2 style={{ marginBlockEnd: '8px', marginLeft: '16px' }}> Reaction Geometries </h2>
            {this.props.reactionSystems.length > 1 ?
              <div>
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
                    />)}
                </Tabs>
                <TabContainer>
                  {tabValue === 0 && typeof this.props.reactionSystems[0] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[0]} selectedUUID={this.props.reactionSystems[0].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 1 && typeof this.props.reactionSystems[1] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[1]} selectedUUID={this.props.reactionSystems[1].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 2 && typeof this.props.reactionSystems[2] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[2]} selectedUUID={this.props.reactionSystems[2].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 3 && typeof this.props.reactionSystems[3] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[3]} selectedUUID={this.props.reactionSystems[3].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 4 && typeof this.props.reactionSystems[4] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[4]} selectedUUID={this.props.reactionSystems[4].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 5 && typeof this.props.reactionSystems[5] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[5]} selectedUUID={this.props.reactionSystems[4].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 6 && typeof this.props.reactionSystems[6] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[6]} selectedUUID={this.props.reactionSystems[6].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 7 && typeof this.props.reactionSystems[7] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[7]} selectedUUID={this.props.reactionSystems[7].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 8 && typeof this.props.reactionSystems[8] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[8]} selectedUUID={this.props.reactionSystems[8].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 9 && typeof this.props.reactionSystems[9] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[9]} selectedUUID={this.props.reactionSystems[9].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 10 && typeof this.props.reactionSystems[10] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[10]} selectedUUID={this.props.reactionSystems[10].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 11 && typeof this.props.reactionSystems[11] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[11]} selectedUUID={this.props.reactionSystems[11].uniqueId} selectedPublication={this.props.publication} /> }
                  {tabValue === 12 && typeof this.props.reactionSystems[12] !== 'undefined' && <SingleStructureView selectedSystem={this.props.reactionSystems[12]} selectedUUID={this.props.reactionSystems[12].uniqueId} selectedPublication={this.props.publication} /> }
                </TabContainer>
              </div>
             :
              <div>
                <div className={this.props.classes.warning}>
                  Warning: Atomic geometries are not available for this reaction. Please consult the publication or authors for details.
                </div>
                <ul style={{ width: '50%' }}>
                  <li>DFT Code: {this.props.selectedReaction.dftCode}</li>
                  <li>DFT Functional: {this.props.selectedReaction.dftFunctional}</li>
                  <li>{prettyPrintReference(this.props.publication)}</li>
                  {_.isEmpty(this.props.publication.doi) ? null :
                  <div>
                    <li>
                            Source&nbsp;
                            <ReactGA.OutboundLink
                              eventLabel={`http://dx.doi.org/${this.props.publication.doi}`}
                              to={`http://dx.doi.org/${this.props.publication.doi}`}
                              target="_blank"
                            >
                              DOI: {this.props.publication.doi} <FaExternalLink />
                            </ReactGA.OutboundLink>
                    </li>
                  </div>
                  }
                  <li> <a href={`/publications/${this.props.publication.pubId}`}>
                  View all reactions in dataset
                  </a>
                  </li>
                </ul>
              </div>
            }
          </div>
          }
        </Grid>
      </Paper>
      }
    </div>
    );
  }
}

ReactionStructures.propTypes = {
  loading: PropTypes.bool,
  reactionSystems: PropTypes.array.isRequired,
  selectedReaction: PropTypes.object,
  classes: PropTypes.object,
  publication: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loading: state.get('energiesPageReducer').loading,
  reactionSystems: state.get('energiesPageReducer').reactionSystems,
  publication: state.get('energiesPageReducer').publication,
});

const mapDispatchToProps = () => ({
});


exports.ReactionStructures = withStyles(styles, { withTheme: true })(
connect(mapStateToProps, mapDispatchToProps)(ReactionStructures)

);
