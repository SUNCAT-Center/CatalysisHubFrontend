/**
 *
 * Publications
 *
 */

import React from 'react';
// import styled from 'styled-components';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

const prettyPrintReference = (reference) => {
  const ref = JSON.parse(reference);
  // TODO Integrate with crossref.org api
  // if (false && typeof ref.doi === 'undefined' || ref.doi === '') {
  return (<span>
    {ref.title !== '' ? <emph>{ref.title}. </emph> : null }
    {typeof ref.authors !== 'undefined' ? <span>{ref.authors.join('; ')}. </span> : null }
    {ref.journal !== '' ? <i>{ref.journal}, </i> : null }
    {ref.volume !== '' ? <span>{ref.volume}, </span> : null}
    {ref.pages !== '' ? <span>{ref.pages}, </span> : null}
    {ref.year !== '' ? <span>{ref.year}.</span> : null}
  </span>);
};


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
        {this.state.years.map((year, i) => (
          <div key={`div_year_${i}`}>
            <h2 key={`pyear_${year}`}>{year}</h2>
            {(this.state.references[year] || []).map((reference, j) => (
              <div key={`pdiv_${i}_${j}`}>
                <li key={`pli_${i}_${j}`}>{prettyPrintReference(reference)}</li>
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
