
/*
 *
 * EnergiesPageInput
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ReactGA from 'react-ga';

import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
/* import Checkbox from 'material-ui/Checkbox';*/
import Switch from 'material-ui/Switch';
import Tooltip from 'material-ui/Tooltip';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

import * as Scroll from 'react-scroll';

import { MdSearch } from 'react-icons/lib/md';
import FaCube from 'react-icons/lib/fa/cube';

import cachios from 'cachios';
import { graphQLRoot } from 'utils/constants';

import * as actions from './actions';
import TermAutosuggest from './TermAutosuggest';


const MButton = styled(Button)`
  margin: 25px;
  marginLeft: 0;
`;

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


const initialState = {
  reactant_options: [],
  product_options: [],
  facet: '',
  surfaceComposition: '',
  reactants: { label: 'any', value: '' },
  products: { label: 'any', value: '' },
  loading: false,
};

class EnergiesPageInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    // Workaround, instead of calling .bind in every render
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.setSubstate = this.setSubstate.bind(this);
  }
  componentDidMount() {
    this.updateOptions();
  }

  setSubstate(key, value) {
    const newSubstate = {};
    newSubstate[key] = value;
    this.setState(newSubstate);
  }

  updateOptions(blocked = '') {
    let query = '';
    // Fetch Available Reactants
    if (blocked !== 'reactants' && this.state.reactants.label === 'any') {
      query = `{catapp(products: "~${this.state.products.value || ''}", reactants: "~", distinct: true) { edges { node { reactants } } }}`;
      cachios.post(graphQLRoot, {
        query,
        ttl: 300,
      }).then((response) => {
        let reactants = [];
        const reactant = (response.data.data.catapp.edges.map((elem) => JSON.parse(elem.node.reactants)));
        reactants = reactant.map((r) => ({ key: Object.keys(r).join(' + '), value: Object.keys(r).join(' + ') }));
        reactants.push({ label: 'any', value: '' });
        this.setState({
          reactant_options: [...new Set(reactants)],
        });
      });
    }

    // Fetch Available Products
    if (blocked !== 'products' && this.state.products.label === 'any') {
      query = `{catapp(reactants: "~${this.state.reactants.value || ''}", products: "~", distinct: true) { edges { node { products } } }}`;
      cachios.post(graphQLRoot, {
        query,
        ttl: 300,
      }).then((response) => {
        let products = [];
        const product = (response.data.data.catapp.edges.map((elem) => JSON.parse(elem.node.products)));
        products = products.concat([].concat(...product));
        products = product.map((r) => ({ key: Object.keys(r).join(' + '), value: Object.keys(r).join(' + ') }));
        /* products = products.map((r) => ({ value: r, label: r.replace('star', '*') }));*/
        products.push({ label: 'any', value: '' });
        this.setState({
          product_options: [...new Set(products)],
        });
      });
    }
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
      this.updateOptions(name);
    };
  }
  resetForm() {
    this.setState(initialState);
    this.updateOptions('');
    this.props.receiveReactions([]);
    this.props.clearSystems();
  }
  submitForm() {
    this.props.clearSystems();
    this.setState({ loading: true });
    const filters = [];
    if (typeof this.state.surfaceComposition.label !== 'undefined' && this.state.surfaceComposition.label) {
      filters.push(`surfaceComposition: "${this.state.surfaceComposition.label}"`);
    }
    if (typeof this.state.facet.label !== 'undefined' && this.state.facet.label) {
      filters.push(`facet: "~${this.state.facet.label}"`);
    }
    if (typeof this.state.reactants.label !== 'undefined' && this.state.reactants.label) {
      filters.push(`reactants: "${this.state.reactants.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '') || '~'}"`);
    }
    if (typeof this.state.products.label !== 'undefined' && this.state.products.label) {
      filters.push(`products: "${this.state.products.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '') || '~'}"`);
    }

    if (this.props.withGeometry) {
      filters.push('aseIds: "~star"');
    }


    const filterString = filters.join(', ');
    this.props.saveSearch(filterString);
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: filterString,
    });
    const query = {
      query: `query{catapp ( first: 500, ${filterString} ) { totalCount edges { node { id dftCode dftFunctional reactants products aseIds facet chemicalComposition reactionEnergy activationEnergy surfaceComposition } } }}`,
      ttl: 300,
    };
    cachios.post(graphQLRoot, query).then((response) => {
      Scroll.animateScroll.scrollMore(500);
      this.setState({
        loading: false,
      });
      this.props.submitSearch({
        reactants: this.state.reactants.label,
        products: this.state.products.label,
        surfaceComposition: this.state.surfaceComposition.label,
        facet: this.state.facet.label,
      });
      this.props.receiveReactions(response.data.data.catapp.edges);
      this.props.saveResultSize(response.data.data.catapp.totalCount);
    }).catch(() => {
      this.setState({
        loading: false,
      });
    });
  }

  render() {
    return (
      <Paper className={this.props.classes.paper}>
        <h2>Reaction Energetics</h2>

        <FormGroup row>
          <TermAutosuggest field="reactants" setSubstate={this.setSubstate} submitForm={this.submitForm} label="Reactants" placeholder="CO, CO*, COgas, ..." autofocus initialValue={this.props.filter.reactants} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {'⇄'} </span>
          <TermAutosuggest field="products" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Products" placeholder="" initialValue={this.props.filter.products} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="surfaceComposition" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Surface" placeholder="Pt, CoO3, ..." initialValue={this.props.filter.surfaceComposition} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="facet" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Facet" placeholder="100, 111-(4x4) 10-14, ..." initialValue={this.props.filter.facet} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <Tooltip title="Show only results with slab geometry.">
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.withGeometry}
                  onChange={this.props.toggleGeometry}
                />
            }
              label={
                <span>Geometry <FaCube /></span>
            }
            />
          </Tooltip>

          <br />
          <br />
          <Grid container justify="flex-end" direction="row">
            <Grid item>
              <MButton raised onClick={this.submitForm} color="primary" className={this.props.classes.button}><MdSearch /> Search </MButton>
            </Grid>
          </Grid>
        </FormGroup>
        {this.state.loading ? <LinearProgress color="primary" /> : null }
      </Paper>
    );
  }
}

EnergiesPageInput.propTypes = {
  receiveReactions: PropTypes.func.isRequired,
  clearSystems: PropTypes.func.isRequired,
  submitSearch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  saveSearch: PropTypes.func,
  saveResultSize: PropTypes.func,
  withGeometry: PropTypes.bool,
  toggleGeometry: PropTypes.func,
  filter: PropTypes.object,
};

EnergiesPageInput.defaultProps = {
};

const mapStateToProps = (state) => ({
  filter: state.get('energiesPageReducer').filter,
  search: state.get('energiesPageReducer').search,
});

const mapDispatchToProps = (dispatch) => ({
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  saveSearch: (search) => {
    dispatch(actions.saveSearch(search));
  },
  saveResultSize: (resultSize) => {
    dispatch(actions.saveResultSize(resultSize));
  },
});


export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(EnergiesPageInput)

);
