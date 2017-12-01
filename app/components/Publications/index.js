/**
 *
 * Publications
 *
 */

import React, { PropTypes } from 'react';
// import styled from 'styled-components';
import { LinearProgress } from 'material-ui/Progress';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/lib/md';
import ReactGA from 'react-ga';

import { withStyles } from 'material-ui/styles';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

import PublicationSystems from './publicationSystems';

const styles = (theme) => ({
  publicationEntry: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  publicationYear: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
});

const prettyPrintReference = (reference) => {
  if (reference.indexOf('{') > -1) {
    const ref = JSON.parse(reference);
    // TODO Integrate with crossref.org api
    // if (false && typeof ref.doi === 'undefined' || ref.doi === '') {
    return (<span>
      {ref.title !== '' ? <emph>{`"${ref.title}"`}. </emph> : null }
      {typeof ref.authors !== 'undefined' ? <span>{ref.authors.join('; ').replace('\\o', 'ø')}. </span> : null }
      {ref.journal !== '' ? <i>{ref.journal}, </i> : null }
      {ref.volume !== '' ? <span>{ref.volume} </span> : null}
      {ref.year !== '' ? <span>({ref.year}): </span> : null}
      {ref.pages !== '' ? <span>{ref.pages}. </span> : null}
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
          const query = `{catapp(year: ${year}) { edges { node { year publication doi dftCode dftFunctional } } }}`;
          return axios.post(graphQLRoot, {
            query,
          })
            .then((yearResponse) => {
              let references = yearResponse.data.data.catapp.edges.map((n) => (n.node.publication));
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
            .catch(() => {
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
    const query = `query{systems(keyValuePairs: "~doi\\": \\"${doi}") { edges { node { natoms Formula Facet uniqueId energy DftCode DftFunctional PublicationTitle PublicationAuthors PublicationYear PublicationDoi } } }}`;
    axios.post(graphQLRoot, { query })
      .then((response) => {
        this.setState({
          systems: response.data.data.systems.edges,
        });
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <div>
        {this.state.references === {} ? <LinearProgress color="primary" /> : null }
        {this.state.years.map((year, i) => (
          <div key={`div_year_${i}`}>
            <h2 key={`pyear_${year}`} className={this.props.classes.publicationYear}>{year}</h2>
            {(this.state.references[year] || [])
                .filter((references, j) => (
                  this.state.dois[year][j] !== ''
                ))
                .map((reference, j) => (
                  <div key={`pli_${i}_${j}`} className={this.props.classes.publicationEntry}>
                    <button role="button" onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`)} className={this.props.classes.publicationEntry}>
                      { this.state.openedPublication !== `elem_${year}_${j}` ?
                        <MdAddCircleOutline className={this.props.classes.publicationEntry} />
                      :
                        <MdRemoveCircleOutline className={this.props.classes.publicationEntry} />
                      }
                      <span> </span>
                      <span className={this.props.classes.publicationEntry}>
                        {prettyPrintReference(reference)}
                        <ReactGA.OutboundLink
                          eventLabel={`http://dx.doi.org/${this.state.dois[year][j]}`}
                          to={`http://dx.doi.org/${this.state.dois[year][j]}`}
                          target="_blank"
                        >
                          DOI: {this.state.dois[year][j]}.
                        </ReactGA.OutboundLink>
                      </span>
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
  classes: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(Publications);
