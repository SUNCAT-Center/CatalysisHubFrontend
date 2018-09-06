/**
 *
 * StructureView2
 *
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactGA from 'react-ga';
import { compose } from 'recompose';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { MdChevronLeft, MdChevronRight } from 'react-icons/lib/md';

import GraphQlbutton from 'components/GraphQlbutton';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import {
  prettyPrintReference,
} from 'utils/functions';

import { styles } from './styles';


function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


const initialState = {
  value: 0,
  activeStructure: 0,
};

class StructureView2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleStructureFlip(delta) {
    const n = this.props.geoms.length;
    this.setState({
      activeStructure: (((this.state.activeStructure + delta) % n) + n) % n,
    });
  }

  render() {
    let structure;
    let publication;
    if (!_.isEmpty(this.props.geoms)) {
      structure = this.props.geoms[this.state.activeStructure];
      if (!_.isEmpty(structure)) {
        publication = structure.publication[0];
      } else {
        publication = {};
      }
    } else {
      structure = {};
      publication = {};
    }
    const { activeStructure } = this.state;

    return (
      <div>
        {_.isEmpty(this.props.geoms) ? null :
        <Paper className={this.props.classes.paper}>
          <Grid container direction="column" >
            <Grid item>
              <h2>Structure {structure.Formula.replace('star', '*').replace('gas', ' (g)')}</h2>
            </Grid>
            <Grid item >
              <Grid container direction="row" justify="center">
                <Grid item >
                  <Grid container direction="column" justify="center" className={this.props.classes.flipButton}>
                    <Grid item>
                      <Tooltip title="Flip to previous structure">
                        <Button
                          fab
                          mini
                          onClick={() => this.handleStructureFlip(-1)}
                        >
                          <MdChevronLeft size={30} />
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <GeometryCanvasWithOptions
                    cifdata={structure.InputFile}
                    uniqueId={`slab_pv_${activeStructure}`}
                    id={`slab_pv_${activeStructure}`}
                    x={2} y={2} z={1}
                  />
                </Grid>
                <Grid item >
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    className={this.props.classes.flipButton}
                  >
                    <Grid item >
                      <Tooltip title="Flip to next structure">
                        <Button
                          fab
                          mini
                          onClick={() => this.handleStructureFlip(+1)}
                        >
                          <MdChevronRight />
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>

              <Paper className={this.props.classes.paper}>
                <ul>
                  <li>Name: {structure.Formula.replace('star', '*').replace('gas$', ' (g)')}</li>
                  <li>Formula: {structure.Formula}</li>
                  <li>Total Energy: {structure.energy.toFixed(2)} eV</li>
                  <li>DFT Code: {structure.dftCode}</li>
                  <li>DFT Functional: {structure.dftFunctional}</li>
                  <li>{prettyPrintReference(publication)}</li>
                  {_.isEmpty(publication.doi) ? null :
                  <div>
                    <li>
                                Source&nbsp;
                                <ReactGA.OutboundLink
                                  eventLabel={`http://dx.doi.org/${publication.doi}`}
                                  to={`http://dx.doi.org/${publication.doi}`}
                                  target="_blank"
                                >
                                  DOI: {publication.doi}
                                </ReactGA.OutboundLink>
                    </li>
                  </div>
                        }
                  <li>Reactions <a href={`/publications/${publication.pubId}`}> Dataset </a> </li>
                </ul>
              </Paper>
            </Grid>
          </Grid>
          <GraphQlbutton newSchema query={this.props.structureQuery} />
        </Paper>
        }
      </div>
    );
  }
}

StructureView2.propTypes = {
  classes: PropTypes.object.isRequired,
  geoms: PropTypes.array,
  structureQuery: PropTypes.string,
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(StructureView2);

