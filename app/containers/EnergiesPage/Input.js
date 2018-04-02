
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
import { FormGroup } from 'material-ui/Form';
import Tooltip from 'material-ui/Tooltip';

import * as Scroll from 'react-scroll';

import { MdSearch, MdChevronLeft, MdWarning } from 'react-icons/lib/md';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';

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
    margin: theme.spacing.unit,
    textTransform: 'none',
  },
  progress: {
    margin: theme.spacing.unit,
  },
  hint: {
    color: '#aaa',
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
      filters.push(`facet: "~${this.state.facet.label.replace(/^\(([^)]*)\)$/, '$1')}"`);
    }
    if (typeof this.state.reactants.label !== 'undefined' && this.state.reactants.label) {
      filters.push(`reactants: "${this.state.reactants.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '') || '~'}"`);
    }
    if (typeof this.state.products.label !== 'undefined' && this.state.products.label) {
      filters.push(`products: "${this.state.products.label.replace(/\*/g, 'star').replace(/[ ]/g, '').replace('any', '') || '~'}"`);
    }


    const filterString = filters.join(', ');
    this.props.saveSearch(filterString);
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: filterString,
    });
    const query = {
      ttl: 300,
      query: `query{reactions ( first: 20, ${filterString} ) {
    totalCount
    edges {
      node {
        Equation
        id
        dftCode
        dftFunctional
        reactants
        products
        facet
        chemicalComposition
        facet
        reactionEnergy
        surfaceComposition
        chemicalComposition
        reactionSystems {
          name
          aseId
          systems {
            id
            calculatorParameters
          }
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

  render() {
    return (
      <Paper className={this.props.classes.paper}>
        <Grid container justify="flex-end" direction="row">
          <Grid item>
            <Tooltip title="Try free text search.">
              <Button
                onClick={this.props.toggleSimpleSearch}
                className={this.props.classes.button}
              >
                <MdChevronLeft /> Simple Search
            </Button>
            </Tooltip>
          </Grid>
        </Grid>
        {this.props.dbError ? <div><MdWarning />Failed to contact database. </div> : null }
        <h2>Reaction Energetics</h2>

        <FormGroup row>
          <TermAutosuggest field="reactants" setSubstate={this.setSubstate} submitForm={this.submitForm} label="Reactants" placeholder="CO, CO*, COgas, ..." autofocus initialValue={this.props.filter.reactants} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {'→'} </span>
          <TermAutosuggest field="products" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Products" placeholder="" initialValue={this.props.filter.products} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="surfaceComposition" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Surface" placeholder="Pt, CoO3, ..." initialValue={this.props.filter.surfaceComposition} />
          <span style={{ flexGrow: 1, position: 'relative', float: 'left', display: 'inline-block', whiteSpace: 'nowrap', margin: 10 }} > {' '} </span>
          <TermAutosuggest field="facet" submitForm={this.submitForm} setSubstate={this.setSubstate} label="Facet" placeholder="100, 111-(4x4) 10-14, ..." initialValue={this.props.filter.facet} />
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
        <div className={this.props.classes.hint}>Partial input sufficient.</div>
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
  toggleSimpleSearch: PropTypes.func,
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
