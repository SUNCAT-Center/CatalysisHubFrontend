/**
 *
 * Publications
 *
 */

import React from 'react';
// import styled from 'styled-components';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import { MdAddCircleOutline } from 'react-icons/lib/md';

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
    {ref.year !== '' ? <span>{ref.year}. </span> : null}
  </span>);
};


class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      references: {},
      loading: false,
    };
    this.clickPublication = this.clickPublication.bind(this);
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
  clickPublication(event, target, key) {
    const splitKey = key.split('_');
    const year = parseInt(splitKey[1], 10);
    const count = parseInt(splitKey[2], 10);
    let reference = this.state.references[year][count];
    reference = reference.split('"').join('\\"');
    console.log(reference);
    const query = `query{catapp(reference: "${reference}") { edges { node { aseIds } } }}`;
    axios.post(graphQLRoot, { query })
      .then((response) => {
        console.log(response.data.data.catapp);
      });
  }

  render() {
    return (
      <div>
        {this.state.references === {} ? <LinearProgress color="primary" /> : null }
        {this.state.years.map((year, i) => (
          <div key={`div_year_${i}`}>
            <h2 key={`pyear_${year}`}>{year}</h2>
            {(this.state.references[year] || []).map((reference, j) => (
              <div key={`pli_${i}_${j}`}>
                <IconButton key={`pdiv_${i}_${j}`} onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`)}> <MdAddCircleOutline /> </IconButton>
                &nbsp;{prettyPrintReference(reference)}
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
