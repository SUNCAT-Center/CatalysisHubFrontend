
/*
 *
 * EnergiesPageInput
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ReactGA from 'react-ga';

import Button from 'material-ui/Button';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormGroup } from 'material-ui/Form';

import * as Scroll from 'react-scroll';

import { MdSearch, MdWarning } from 'react-icons/lib/md';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';
import { withCommas } from 'utils/functions';

import * as actions from './actions';
import TermAutosuggest from './TermAutosuggest';


const MButton = styled(Button)`
  margin: 25px;
  marginLeft: 0;
`;

const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
    textTransform: 'none',
  },
  progress: {
    margin: theme.spacing.unit,
  },
  hint: {
    color: '#aaa',
    marginBottom: theme.spacing.unit,
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
  suggestionsReady: false,
  resultCount: '...',
};

class EnergiesPageInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    // Workaround, instead of calling .bind in every render
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.setSubstate = this.setSubstate.bind(this);
    this.getFilterString = this.getFilterString.bind(this);
    this.getResultCount = this.getResultCount.bind(this);
    this.getResultCount();
  }
  componentDidMount() {
    this.updateOptions();
    this.getResultCount();
  }

  setSubstate(key, value) {
    const newSubstate = {};
    newSubstate[key] = value;
    this.setState(newSubstate);
  }

  getResultCount() {
    this.setState({
      resultCount: <CircularProgress size={25} />,
    });
    const filterString = this.getFilterString();
    const query = {
      ttl: 300,
      query: `query{reactions ( first: 0, ${filterString} ) {
  totalCount
  edges {
    node {
      id
    }
  }
}}
` };
    cachios.post(newGraphQLRoot, query).then((response) => {
      const totalCount = response.data.data.reactions.totalCount;
      let message;

      if (totalCount === 0) {
        message = <div>No entries <MdWarning /></div>;
      } else if (totalCount === 1) {
        message = '1 entry';
      } else {
        message = `${withCommas(response.data.data.reactions.totalCount)} entries`;
      }
      this.setState({
        resultCount: message,
      });
    });
  }

  getFilterString() {
    const filters = [];
    if (typeof this.state.surfaceComposition.label !== 'undefined' && this.state.surfaceComposition.label) {
      filters.push(`surfaceComposition: "${this.state.surfaceComposition.label.trim()}"`);
    }
    if (typeof this.state.facet.label !== 'undefined' && this.state.facet.label) {
      filters.push(`facet: "~${this.state.facet.label.replace(/^\(([^)]*)\)$/, '$1').trim()}"`);
    }
    if (typeof this.state.reactants.label !== 'undefined' && this.state.reactants.label) {
      filters.push(`reactants: "${this.state.reactants.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '').trim() || '~'}"`);
    }
    if (typeof this.state.products.label !== 'undefined' && this.state.products.label) {
      filters.push(`products: "${this.state.products.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '').trim() || '~'}"`);
    }

    const filterString = filters.join(', ');
    return filterString;
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
    const filterString = this.getFilterString();
    this.props.saveSearch(filterString);
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: filterString,
    });
    const query = {
      ttl: 300,
      query: `query{reactions ( first: 200, ${filterString} ) {
    totalCount
    edges {
      node {
        Equation
        sites
        id
        pubId
        dftCode
        dftFunctional
        reactants
        products
        facet
        chemicalComposition
        facet
        reactionEnergy
        activationEnergy
        surfaceComposition
        chemicalComposition
        reactionSystems {
          name
          energyCorrection
          aseId
        }
      }
    }
  }}`,
    };
    cachios.post(newGraphQLRoot, query).then((response) => {
      Scroll.animateScroll.scrollMore(500);
      this.setState({
        loading: false,
      });
      this.props.saveSearchQuery(query.query);
      this.props.submitSearch({
        reactants: this.state.reactants.label,
        products: this.state.products.label,
        surfaceComposition: this.state.surfaceComposition.label,
        facet: this.state.facet.label,
      });
      this.props.receiveReactions(response.data.data.reactions.edges);
      this.props.saveResultSize(response.data.data.reactions.totalCount);
    }).catch(() => {
      this.setState({
        loading: false,
      });
    });
  }

  updateOptions(blocked = '') {
    let query = '';
    // Fetch Available Reactants
    if (blocked !== 'reactants' && this.state.reactants.label === 'any') {
      query = `{reactions(products: "~${this.state.products.value || ''}", reactants: "~", distinct: true) { edges { node { reactants } } }}`;
      cachios.post(newGraphQLRoot, {
        query,
        ttl: 300,
      }).then((response) => {
        let reactants = [];
        const reactant = (response.data.data.reactions.edges.map((elem) => JSON.parse(elem.node.reactants)));
        reactants = reactant.map((r) => ({ key: Object.keys(r).join(' + '), value: Object.keys(r).join(' + ') }));
        reactants.push({ label: 'any', value: '' });
        this.setState({
          reactant_options: [...new Set(reactants)],
          suggestionsReady: true,
        });
      }).catch((error) => {
        this.props.setDbError(error);
      });
    }

    // Fetch Available Products
    if (blocked !== 'products' && this.state.products.label === 'any') {
      query = `{reactions(reactants: "~${this.state.reactants.value || ''}", products: "~", distinct: true) { edges { node { products } } }}`;
      cachios.post(newGraphQLRoot, {
        query,
        ttl: 300,
      }).then((response) => {
        let products = [];
        const product = (response.data.data.reactions.edges.map((elem) => JSON.parse(elem.node.products)));
        products = products.concat([].concat(...product));
        products = product.map((r) => ({ key: Object.keys(r).join(' + '), value: Object.keys(r).join(' + ') }));
        /* products = products.map((r) => ({ value: r, label: r.replace('star', '*') }));*/
        products.push({ label: 'any', value: '' });
        this.setState({
          product_options: [...new Set(products)],
          suggestionsReady: true,
        }).catch(() => {
          this.props.setDbError();
        });
      });
    }
  }

  render() {
    return (
      <Paper className={this.props.classes.paper}>
        {this.props.dbError ? <div><MdWarning />Failed to contact database. </div> : null }
        <h2>Surface Reactions</h2>
        <h3>Search for chemical reactions across all publications and datasets!</h3>
        <div style={{ width: '55%', textAlign: 'justify' }}>
          <div> A quick guide: </div>
          <ul>
            <li> Leave fields blank if you {"don't"} want to impose any restrictions. </li>
            <li> For the <b>Reactants</b> and <b>Products</b> fields, choose the chemical species taking part in the left- and/or right hand side of the chemical reaction respectively. The phase of the molecules and elements can also be specified, such that {"'CO2gas'"} refers to CO<sub>2</sub> in the gas phase, whereas {"'CO2*'"} refers to CO<sub>2</sub> adsorbed on the surface. </li>
            <li> In the <b>Surface</b> field, enter the (reduced) chemical composition of the surface, or a sum of elements that must be present, such as {"'Ag+'"} or {"'Ag+Sr'"}. </li>
          </ul>
        </div>
        <div className={this.props.classes.hint}>{this.state.resultCount}</div>

        <FormGroup row>
          <TermAutosuggest field="reactants" setSubstate={this.setSubstate} submitForm={this.submitForm} label="Reactants" placeholder="CO, CO*, COgas, ..." autofocus initialValue={this.props.filter.reactants} keyUp={this.getResultCount} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {'→'} </span>
          <TermAutosuggest field="products" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Products" placeholder="" initialValue={this.props.filter.products} keyUp={this.getResultCount} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="surfaceComposition" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Surface" placeholder="Pt, CoO3, ..." initialValue={this.props.filter.surfaceComposition} keyUp={this.getResultCount} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="facet" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Facet" placeholder="100, 111-(4x4) 10-14, ..." initialValue={this.props.filter.facet} keyUp={this.getResultCount} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>

          <br />
          <br />
          <Grid container justify="flex-end" direction="row">
            <Grid item>
              <MButton raised onClick={this.submitForm} color="primary" className={this.props.classes.button}><MdSearch /> Search </MButton>
            </Grid>
          </Grid>
        </FormGroup>
        {this.state.loading ? <LinearProgress color="primary" className={this.props.classes.progress} /> :
            null
        }
      </Paper>
    );
  }
}

EnergiesPageInput.propTypes = {
  classes: PropTypes.object,
  clearSystems: PropTypes.func.isRequired,
  dbError: PropTypes.bool,
  filter: PropTypes.object,
  receiveReactions: PropTypes.func.isRequired,
  saveResultSize: PropTypes.func,
  saveSearch: PropTypes.func,
  submitSearch: PropTypes.func.isRequired,
  setDbError: PropTypes.func,
  saveSearchQuery: PropTypes.func,
};

EnergiesPageInput.defaultProps = {
};

const mapStateToProps = (state) => ({
  filter: state.get('energiesPageReducer').filter,
  search: state.get('energiesPageReducer').search,
  simpleSearch: state.get('energiesPageReducer').simpleSearch,
  dbError: state.get('energiesPageReducer').dbError,
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
  toggleSimpleSearch: () => {
    dispatch(actions.toggleSimpleSearch());
  },
  setDbError: () => {
    dispatch(actions.setDbError());
  },
  saveSearchQuery: (searchQuery) => {
    dispatch(actions.saveSearchQuery(searchQuery));
  },
});


export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(EnergiesPageInput)

);
