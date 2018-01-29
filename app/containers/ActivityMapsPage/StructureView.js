/**
 *
 * StructureView2
 *
 */

import React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

import GeometryCanvas from 'components/GeometryCanvas';

import PropTypes from 'prop-types';

function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    textTransform: 'none',
  },
});


const initialState = {
  value: 0,
};

class StructureView2 extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <h2>Detailed Structure View {`"${this.props.selectedDot.text}"`}</h2>
        <Tabs
          fullWidth
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab className={this.props.classes.tab} label="Structure One">
            <h2>Structure 1</h2>
            <GeometryCanvas id="structure1" />
          </Tab>
          <Tab className={this.props.classes.tab} label="Structure Two">
            <h2>Structure 2</h2>
            <GeometryCanvas id="structure2" />
          </Tab>
          <Tab className={this.props.classes.tab} label="Structure Three">
            <h2>Structure 3</h2>
            <GeometryCanvas id="structure3" />
          </Tab>
          <Tab className={this.props.classes.tab} label="Structure Four">
            <h2>Structure 4</h2>
            <GeometryCanvas id="structure4" />
          </Tab>
        </Tabs>
        <TabContainer>


          {value === 0 && <GeometryCanvas cifurl={this.props.cifUrls[0]} />}
          {value === 1 && <GeometryCanvas cifurl={this.props.cifUrls[1]} />}
          {value === 2 && <GeometryCanvas cifurl={this.props.cifUrls[2]} />}
          {value === 3 && <GeometryCanvas cifurl={this.props.cifUrls[3]} />}
        </TabContainer>
      </div>
    );
  }
}

StructureView2.propTypes = {
  classes: PropTypes.object.isRequired,
  cifUrls: PropTypes.array.isRequired,
  selectedDot: PropTypes.object.isRequired,

};

/* export default StructureView2; */
export default withStyles(styles)(StructureView2);
