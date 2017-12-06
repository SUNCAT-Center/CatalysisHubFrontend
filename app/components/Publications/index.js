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
import PublicationReactions from './publicationReactions';

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
      titles: {},
      loading: false,
      openedPublication: null,
      systems: [],
      reactionEnergies: [],
    };
    this.clickPublication = this.clickPublication.bind(this);
  }
  componentDidMount() {
    const yearQuery = '{catapp(publication_Year: "~", distinct: true) { edges { node { PublicationYear } } }}';
    axios.post(graphQLRoot, {
      query: yearQuery,
    })
      .then((response) => {
        let years = response.data.data.catapp.edges.map((n) => (n.node.PublicationYear));
        years = [...new Set(years)].sort().reverse().filter((x) => x !== null);
        this.setState({
          years,
        });
        years.map((year) => {
          const query = `{catapp(year: ${year}, publication_Title:"~", distinct: true) { edges { node { year publication doi dftCode dftFunctional PublicationTitle } } }}`;
          return axios.post(graphQLRoot, {
            query,
          })
            .then((yearResponse) => {
              let references = yearResponse.data.data.catapp.edges.map((n) => (n.node.publication));
              references = [...new Set(references)];
              let dois = yearResponse.data.data.catapp.edges.map((n) => (n.node.doi));
              dois = [...new Set(dois)];

              let titles = yearResponse.data.data.catapp.edges.map((n) => (n.node.PublicationTitle));
              titles = [...new Set(titles)];


              const allReferences = this.state.references;
              const allDois = this.state.dois;
              const allTitles = this.state.titles;

              allReferences[year] = references;
              allDois[year] = dois;
              allTitles[year] = titles;

              this.setState({
                references: allReferences,
                dois: allDois,
                titles: allTitles,
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
    let query = `query{systems(keyValuePairs: "~doi\\": \\"${doi}") { edges { node { natoms Formula Facet uniqueId energy DftCode DftFunctional PublicationTitle PublicationAuthors PublicationYear PublicationDoi } } }}`;
    axios.post(graphQLRoot, { query })
      .then((response) => {
        if (response.data.data.systems.edges.length > 0) {
          this.setState({
            systems: response.data.data.systems.edges,
          });
        }
        const title = this.state.titles[year][count];
        query = `{catapp ( publication_Title: "${title}") { edges { node { id dftCode dftFunctional reactants products aseIds facet chemicalComposition reactionEnergy activationEnergy surfaceComposition } } }}`;
        axios.post(graphQLRoot, { query })
            .then((response1) => {
              this.setState({
                reactionEnergies: response1.data.data.catapp.edges,
              });
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
                      <div>

                        {this.state.reactionEnergies.length === 0 ? null :
                        <PublicationReactions {...this.state} />
                            }
                        {this.state.systems.length === 0 ? null :
                        <PublicationSystems {...this.state} />
                            }
                      </div>
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
