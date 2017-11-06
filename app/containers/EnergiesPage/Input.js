
/*
 *
 * EnergiesPageInput
 *
 */

import React, { PropTypes } from 'react';
import styled from 'styled-components';

import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';


import { MdClear, MdSearch } from 'react-icons/lib/md';
import { FaArrowsH } from 'react-icons/lib/fa';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

const MButton = styled(Button)`
  margin: 12px;
`;


const initialState = {
  reactant_options: [],
  product_options: [],
  facet: '',
  surface: '',
  reactants: { label: 'any', value: '' },
  products: { label: 'any', value: '' },
  loading: false,
};

export class EnergiesPageInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    // Workaround, instead of calling .bind in every render
    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount() {
    this.updateOptions();
  }

  updateOptions(blocked = '') {
    let query = '';
    // Fetch Available Reactants
    if (blocked !== 'reactants' && this.state.reactants.label === 'any') {
      query = `{catapp(products: "~${this.state.products.value || ''}", reactants: "~", distinct: true) { edges { node { reactants } } }}`;
      axios.post(graphQLRoot, {
        query,
      }).then((response) => {
        let reactants = [];
        const reactant = (response.data.data.catapp.edges.map((elem) => JSON.parse(elem.node.reactants)));
        reactants = reactants.concat([].concat(...reactant));
        reactants = reactants.map((r) => ({ value: r, label: r.replace('star', '*') }));
        reactants.push({ label: 'any', value: '' });
        this.setState({
          reactant_options: reactants,
        });
      });
    }

    // Fetch Available Products
    if (blocked !== 'products' && this.state.products.label === 'any') {
      query = `{catapp(reactants: "~${this.state.reactants.value || ''}", products: "~", distinct: true) { edges { node { products } } }}`;
      axios.post(graphQLRoot, {
        query,
      }).then((response) => {
        let products = [];
        const product = (response.data.data.catapp.edges.map((elem) => JSON.parse(elem.node.products)));
        products = products.concat([].concat(...product));
        products = product.map((p) => p.join(' + '));
        products = products.map((r) => ({ value: r, label: r.replace('star', '*') }));
        products.push({ label: 'any', value: '' });
        this.setState({
          product_options: products,
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
    this.setState({ loading: true });

    const query = {
      query: `query{catapp {
  edges {
    node {
      id
      DFTCode
      DFTFunctional
      reactants
      products
      #Equation
      aseIds
      #reactantIds
      #productIds
      facet
      chemicalComposition
      reactionEnergy
      activationEnergy
    }
  }
}}`,
    };
    console.log(query);
    axios.post(graphQLRoot, query).then((response) => {
      this.setState({
        loading: false,
      });
      this.props.receiveReactions(response.data.data.catapp.edges);
    }).catch((error) => {
      console.log(`Error loading reactions: ${error}`);
      console.log(graphQLRoot);
      console.log(query.query);

      this.setState({
        loading: false,
      });
    });
  }

  render() {
    return (
      <div>
        <h2>Reactions</h2>

        <FormControl
          style={{ minWidth: 220, margin: 12 }}
        >
          <InputLabel>Reactant</InputLabel>
          <Select
            onChange={this.handleChange('reactants')}
            value={this.state.reactants}
            renderValue={(value) => value.label}
          >
            {this.state.reactant_options.map((reactant, i) =>
              <MenuItem
                value={reactant}
                key={`reactant_option_${i}`}
              >{reactant.label}</MenuItem>
            )}
          </Select>
        </FormControl>
        {' '}
        <FaArrowsH
          size={30}
          style={{
            margin: 15,
            marginTop: -25,
          }}
        />
        {' '}
        <FormControl
          style={{ minWidth: 220, margin: 12 }}
        >
          <InputLabel>Products</InputLabel>
          <Select
            onChange={this.handleChange('products')}
            value={this.state.products}
            renderValue={(value) => value.label}
          >
            {this.state.product_options.map((product, i) =>
              <MenuItem
                value={product}
                key={`product_option_${i}`}
              >{product.label}</MenuItem>
            )}
          </Select>
        </FormControl>
        <br />
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Surface</InputLabel>
          <Select
            onChange={this.handleChange('surface')}
            value={this.state.surface}
          >
            <MenuItem value="Pd">Pd</MenuItem>
            <MenuItem value="Pt">Pt</MenuItem>
            <MenuItem value="Ag">Ag</MenuItem>
            <MenuItem value="Cu">Cu</MenuItem>
            <MenuItem value="Rh">Rh</MenuItem>
            <MenuItem value="Ir">Ir</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Facet</InputLabel>
          <Select
            onChange={this.handleChange('facet')}
            value={this.state.facet}
          >
            <MenuItem value="100">(100)</MenuItem>
            <MenuItem value="111">(111)</MenuItem>
            <MenuItem value="211">(211)</MenuItem>
            <MenuItem value="311">(311)</MenuItem>
            <MenuItem value="110">(110)</MenuItem>
          </Select>
        </FormControl>
        <MButton raised onClick={this.resetForm}><MdClear /> Reset </MButton>
        <MButton raised onClick={this.submitForm} color="primary"><MdSearch /> Search </MButton>
        {this.state.loading ? <LinearProgress color="primary" /> : null }
      </div>
    );
  }
}

EnergiesPageInput.propTypes = {
  receiveReactions: PropTypes.func.isRequired,
  clearSystems: PropTypes.func.isRequired,
};

EnergiesPageInput.defaultProps = {
};
