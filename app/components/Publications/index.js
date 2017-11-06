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

import PublicationSystems from './publicationSystems';

const prettyPrintReference = (reference) => {
  if (reference.indexOf('{') > -1) {
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
  }
  return null;
};


class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      references: {},
      dois: {},
      loading: false,
      openedPublication: null,
      systems: [],
    };
    this.clickPublication = this.clickPublication.bind(this);
  }
  componentDidMount() {
    const yearQuery = '{numberKeys(key:"publication_year") { edges { node { value } } }}';
    axios.post(graphQLRoot, {
      query: yearQuery,
    })
      .then((response) => {
        let years = response.data.data.numberKeys.edges.map((n) => (n.node.value));
        years = [...new Set(years)];
        this.setState({
          years,
        });
        years.map((year) => {
          const query = `{catapp(year: ${year}, reference: "~") { edges { node { reference doi } } }}`;
          return axios.post(graphQLRoot, {
            query,
          })
            .then((yearResponse) => {
              let references = yearResponse.data.data.catapp.edges.map((n) => (n.node.reference));
              references = [...new Set(references)];
              let dois = yearResponse.data.data.catapp.edges.map((n) => (n.node.doi));
              dois = [...new Set(dois)];


              const allReferences = this.state.references;
              const allDois = this.state.dois;

              allReferences[year] = references;
              allDois[year] = dois;

              this.setState({
                references: allReferences,
                dois: allDois,
              });
            })
            .catch((error) => {
              console.log(error);
              console.log(query);
            })
          ;
        });
      });
  }
  clickPublication(event, target, key) {
    const splitKey = key.split('_');
    const year = parseInt(splitKey[1], 10);
    const count = parseInt(splitKey[2], 10);
    const doi = this.state.dois[year][count];
    /* reference = reference.split('"').join('\\"'); */
    if (this.state.openedPublication === key) {
      this.setState({
        openedPublication: null,
      });
    } else {
      this.setState({
        openedPublication: key,
      });
    }
    const query = `query{systems(keyValuePairs: "~doi\\": \\"${doi}") { edges { node { natoms Formula Facet uniqueId energy DftCode PublicationTitle PublicationAuthors PublicationYear } } }}`;
    axios.post(graphQLRoot, { query })
      .then((response) => {
        this.setState({
          systems: response.data.data.systems.edges,
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(query);
      });
  }

  render() {
    return (
      <div>
        {this.state.references === {} ? <LinearProgress color="primary" /> : null }
        {this.state.years.map((year, i) => (
          <div key={`div_year_${i}`}>
            <h2 key={`pyear_${year}`}>{year}</h2>
            {(this.state.references[year] || [])
                .filter((references, j) => (
                  this.state.dois[year][j] !== ''
                ))
                .map((reference, j) => (
                  <div key={`pli_${i}_${j}`}>
                    <button role="button" onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`)}>
                      <IconButton key={`pdiv_${i}_${j}`}> <MdAddCircleOutline /> </IconButton>
                      &nbsp;{prettyPrintReference(reference)} <a href={`http://dx.doi.org/${this.state.dois[year][j]}`} target="_blank">DOI: {this.state.dois[year][j]}</a>
                    </button>
                    <div>
                      { this.state.openedPublication !== `elem_${year}_${j}` ? null :
                      <PublicationSystems {...this.state} />
                      }
                    </div>
                    <br />
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
