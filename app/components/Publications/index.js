/**
 *
 * Publications
 *
 */

import React from 'react';
// import styled from 'styled-components';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';


class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      references: {},
    };
  }
  componentDidMount() {
    axios.post(graphQLRoot, {
      query: '{numberKeys(key:"publication_year", distinct: true) { edges { node { value } } }}',
    })
      .then((response) => {
        const years = response.data.data.numberKeys.edges.map((n) => (n.node.value));
        this.setState({
          years,
        });
        years.map((year) => (
          axios.post(graphQLRoot, {
            query: `{catapp(year: ${year}, reference: "~", distinct: true) { edges { node { reference } } }}`,
          })
          .then((yearResponse) => {
            const references = yearResponse.data.data.catapp.edges.map((n) => (n.node.reference));
            const allReferences = this.state.references;
            allReferences[year] = references;
            this.setState({
              references: allReferences,
            });
          })
        ));
      });
  }
  render() {
    return (
      <div>
        {this.state.years.map((year) => (
          <div>
            <h2 key={`year_${year}`}>{year}</h2>
            {(this.state.references[year] || []).map((reference) => (
              <div>
                <li>{reference}</li>
              </div>
            ))}
          </div>
        ))
        }
      </div>
    );
  }
}

Publications.propTypes = {

};

export default Publications;
