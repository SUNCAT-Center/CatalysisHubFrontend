import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import axios from 'axios';
import { newGraphQLRoot } from 'utils/constants';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { LinearProgress } from 'material-ui/Progress';

import * as actions from './actions';
import { styles } from './styles';

const initialState = {
  loading: false,
};

class TopSystems extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.getStructures = this.getStructures.bind(this);
    this.state = initialState;
  }

  getStructures(event) {
    if (_.isEmpty(event.points[0].data.customdata)) {
      return {};
    }

    this.setState({
      loading: true,
    });


    const pointEvent = event.points[0];
    const query = `{reactionSystems(aseId: "${pointEvent.data.customdata.uid}") {
  edges {
    node{
        reactions {
          dftFunctional
          dftCode
          reactionSystems{
          name
          systems {
            Formula
            energy
            InputFile(format: "cif")
            publication {
              authors
              title
              journal
              doi
              pages
              year
              pubId
            }
          }
          }
        } 
  }
}}} `;
    this.props.clearStructures();
    this.props.saveStructureQuery(query);
    return axios.post(newGraphQLRoot, { query }).then((response) => response.data.data.reactionSystems.edges.map((edge) => edge.node.reactions.reactionSystems.map(({ systems, name }) => {
      const system = {
        ...systems,
        name,
        dftFunctional: edge.node.reactions.dftFunctional,
        dftCode: edge.node.reactions.dftCode,
      };
      this.props.saveStructure(system);
      return this.setState({
        loading: false,
      });
    })));
  }

  clickDot(event) {
    if (!_.isEmpty(event.points[0].data.customdata)) {
      this.props.clickDot(event);
    }
  }

  render() {
    return (
      <div>
        {_.isEmpty(this.props.systems) ? null :
        <Paper className={this.props.classes.paper}>
          <h2>Top Systems</h2>
          <Grid container direction="row" justify="center">
            <List>
              <ListItem >
                <ListItemText className={this.props.classes.itemText} primary="#" />
                <ListItemText className={this.props.classes.itemText} primary="composition" />
                <ListItemText className={this.props.classes.itemText} primary="overpotential [eV]" />
              </ListItem>
              {this.props.systems.filter((system) => system.z !== 0).slice(0, 10).map((system, i) => (
                <ListItem
                  key={`item_${i}`}
                  button
                  onClick={() => {
                          // Hack: create custom mock event
                    const event = {
                      points: [{
                        data: {
                          customdata: {
                            uid: system.uid,
                          },
                        },
                      }],
                    };
                    this.getStructures(event);
                    this.clickDot(event);
                  }}
                >
                  <ListItemText className={this.props.classes.itemText} primary={`${i + 1}`} />
                  <ListItemText className={this.props.classes.itemText} primary={`${system.formula.padEnd(15)}`} />
                  <ListItemText className={this.props.classes.itemText} primary={`${system.z.toFixed(2)}`} />
                </ListItem>
                    ))}
            </List>

          </Grid>


        </Paper>
        }
        {this.state.loading ? <LinearProgress /> : null }
      </div>
    );
  }

}


TopSystems.propTypes = {
  classes: PropTypes.object.isRequired,
  systems: PropTypes.array.isRequired,
  clickDot: PropTypes.func.isRequired,
  saveStructure: PropTypes.func.isRequired,
  saveStructureQuery: PropTypes.func.isRequired,
  clearStructures: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  systems: state.get('activityMapsPageReducer').systems,
});

const mapDispatchToProps = (dispatch) => ({
  clickDot: (dot) => {
    dispatch(actions.clickDot(dot));
  },
  clearStructures: () => {
    dispatch(actions.clearStructures());
  },
  saveStructure: (structure) => {
    dispatch(actions.saveStructure(structure));
  },
  saveStructureQuery: (query) => {
    dispatch(actions.saveStructureQuery(query));
  },
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(TopSystems);
