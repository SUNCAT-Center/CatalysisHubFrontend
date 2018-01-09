/**
 *
 * GeneralSearch
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'material-ui/Button';
import { MdClear, MdSearch, MdWarning } from 'react-icons/lib/md';
import { LinearProgress } from 'material-ui/Progress';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';
import TermAutosuggest from './TermAutosuggest';

const MButton = styled(Button)`
  margin: 12px;
`;

const initialState = {
  free_text: '',
  year: '',
  authors: '',
  article_title: '',
  journal_title: '',
  facet: '',
  site: '',
  composition: '',
  loading: false,
};


class GeneralSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    // Workaround, instead of calling .bind in every render
    this.submitQuery = this.submitQuery.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.setSubstate = this.setSubstate.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  setSubstate(key, value) {
    const newSubstate = {};
    newSubstate[key] = value;
    this.setState(newSubstate);
  }
  submitForm() {
    /* this.props.clearSystems();*/
    this.setState({ loading: true });
    const filters = [];
    if (typeof this.state.surface.label !== 'undefined') {
      filters.push(`surfaceComposition: "~${this.state.surface.label}"`);
    }
    if (typeof this.state.facet.label !== 'undefined') {
      filters.push(`facet: "~${this.state.facet.label}"`);
    }
    if (typeof this.state.reactants.label !== 'undefined') {
      filters.push(`reactants: "~${this.state.reactants.label.replace('*', '').replace('any', '')}"`);
    }
    if (typeof this.state.products.label !== 'undefined') {
      filters.push(`products: "~${this.state.products.label.replace('*', '').replace('any', '')}"`);
    }

    const filterString = filters.join(', ');

    const query = {
      query: `query{catapp ( last: 500, ${filterString} ) {
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
      surfaceComposition
    }
  }
}}`,
    };
    axios.post(graphQLRoot, query).then((response) => {
      this.setState({
        loading: false,
      });
      this.props.submitSearch();
      this.props.receiveReactions(response.data.data.catapp.edges);
    }).catch((error) => {
      console.log(query.query);
      console.log(error);
      this.setState({
        loading: false,
      });
    });
  }


  submitQuery() {
    this.setState({
      loading: true,
    });
    const query = `query{systems {
  edges {
    node {
        uniqueId
        Formula
        volume
        Facet
    }
  }
  }}`;
    axios.post(graphQLRoot, {
      query,
    }).then((response) => {
      this.setState({
        loading: false,
      });
      this.props.receiveResults(response.data.data.systems.edges);
    });
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }
  clearForm() {
    this.setState(initialState);
  }
  render() {
    return (
      <div>
        <div><MdWarning />Under construction.</div>
        <h2>Structure Search</h2>
        <TermAutosuggest field="formula" setSubstate={this.setSubstate} submitForm={this.submitForm} autofocus />
        <TermAutosuggest field="year" setSubstate={this.setSubstate} submitForm={this.submitForm} autofocus />

        <br />
        <br />
        <MButton raised onClick={this.clearForm}><MdClear /> Clear</MButton>
        <MButton raised onClick={this.submitQuery} color="primary"><MdSearch /> Search</MButton>
        {this.state.loading ? <LinearProgress color="primary" /> : null }
      </div>
    );
  }
}

GeneralSearch.propTypes = {
  receiveResults: PropTypes.func,
  submitSearch: PropTypes.func,
  receiveReactions: PropTypes.func,

};

export default GeneralSearch;
