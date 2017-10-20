/**
 *
 * GeneralSearch
 *
 */

import React from 'react';
import styled from 'styled-components';

import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';

import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import { MdClear, MdSearch } from 'react-icons/lib/md';

import gql from 'graphql-tag';
/* import { graphql, createNetworkInterface, ApolloClient } from 'react-apollo'; */
/* import axios from 'axios'; */


/* import { graphQLRoot } from 'utils/constants'; */


import ResultTable from 'components/ResultTable';


/* const networkInterface = createNetworkInterface({ */
/* uri: graphQLRoot */
/* }); */

/* const client = new ApolloClient({ */
/* networkInterface, */
/* }); */


const MButton = styled(Button)`
  margin: 12px;
`;


class GeneralSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      free_text: '',
      year: '',
      authors: '',
      article_title: '',
      journal_title: '',
      facet: '',
      site: '',
      composition: '',
      results: [],
    };
    // Workaround, instead of calling .bind in every render
    this.submitQuery = this.submitQuery.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }
  submitQuery() {
    const query = gql`
    query {textKeys(key: "publication_title", value:"~${this.state.article_title}") {
  edges {
    node {
      systems {
        id
        Formula
        Density
        Volume
        Facet

      }
    }
  }
}}
    `;
    console.log(query);
    /* client.query(query).then((response) =>{ */
    /* console.log(response) */
    /* }) */
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }
  clearForm() {
    this.setState({
      free_text: '',
      composition: '',
      year: '',
      authors: '',
      article_title: '',
      journal_title: '',
      facet: '',
      site: '',
    });
  }
  render() {
    return (
      <div>
        <h2>General Search</h2>
        <TextField label="Free Text Search" value={this.state.free_text} onChange={this.handleChange('free_text')} />
        {'\t '}
        <TextField label="Composition" value={this.state.composition} onChange={this.handleChange('composition')} />
        {'\t '}
        <TextField label="Year" value={this.state.year} onChange={this.handleChange('year')} />
        <br />
        <br />
        <TextField label="Authors" value={this.state.authors} onChange={this.handleChange('authors')} />
        {'\t '}
        <TextField label="Title of Article" value={this.state.article_title} onChange={this.handleChange('article_title')} />
        {'\t '}
        <TextField label="Title of Journal" value={this.state.journal_title} onChange={this.handleChange('journal_title')} />
        <br />

        <FormControl
          style={{ minWidth: 120, margin: 12 }}
        >
          <InputLabel>Facet</InputLabel>
          <Select
            onChange={this.handleChange('facet')}
            value={this.state.facet}
          >
            <MenuItem value="any">any</MenuItem>
            <MenuItem value="111">111</MenuItem>
            <MenuItem value="100">100</MenuItem>
            <MenuItem value="110">110</MenuItem>
            <MenuItem value="211">211</MenuItem>
            <MenuItem value="311">311</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </FormControl>
        {'   '}
        <FormControl
          style={{ minWidth: 120 }}
        >
          <InputLabel>Site</InputLabel>
          <Select
            onChange={this.handleChange('site')}
            value={this.state.site}
          >
            <MenuItem value="any">any</MenuItem>
            <MenuItem value="fcc">fcc</MenuItem>
            <MenuItem value="hcp">hcp</MenuItem>
            <MenuItem value="bridge">bridge</MenuItem>
            <MenuItem value="hollow">hollow</MenuItem>
            <MenuItem value="top">top</MenuItem>
            <MenuItem value="other">other</MenuItem>
          </Select>
        </FormControl>
        <MButton raised onClick={this.clearForm}><MdClear /> Clear</MButton>
        <MButton raised onClick={this.submitQuery}><MdSearch /> Search</MButton>

        <ResultTable results={this.state.results} />
      </div>
    );
  }
}

GeneralSearch.propTypes = {

};

export default GeneralSearch;
