/**
 *
 * Publications
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { LinearProgress } from 'material-ui/Progress';
import {
  MdChevronRight,
  MdChevronLeft,
  MdViewList } from 'react-icons/lib/md';
import {
  IoDocument,
} from 'react-icons/lib/io';
import _ from 'lodash';
import ReactGA from 'react-ga';
import Script from 'react-load-script';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';
import { FaExternalLink } from 'react-icons/lib/fa';

import { withStyles } from 'material-ui/styles';

import axios from 'axios';
import { newGraphQLRoot } from 'utils/constants';
import { prettyPrintReference } from 'utils/functions';

import PublicationView from 'components/PublicationView';
import PublicationSystems from './publicationSystems';
// import PublicationReactions from './publicationReactions';

const styles = (theme) => ({
  publicationAction: {
    margin: theme.spacing.unit,
    height: 6,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
  },
  outboundLink: {
    textDecoration: 'none',
  },
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
  paper: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  smallPaper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    paddingBottom: 0,
  },
  publicationActions: {
    marginTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
});

class Publications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      references: {},
      dois: {},
      titles: {},
      pubIds: {},
      loading: false,
      openedPublication: null,
      systems: [],
      reactionEnergies: [],
      publicationQuery: '',
      pubId: _.get(props, 'routeParams.pubId', ''),
    };
    this.clickPublication = this.clickPublication.bind(this);
    this.backToList = this.backToList.bind(this);
  }
  componentDidMount() {
    const yearQuery = '{publications { edges { node { year } } }}';
    axios.post(newGraphQLRoot, {
      query: yearQuery,
    })
      .then((response) => {
        let years = response.data.data.publications.edges.map((n) => n.node.year);
        years = [...new Set(years)].sort().reverse().filter((x) => x !== null);
        this.setState({
          years,
        });
        years.map((year) => {
          const query = `{publications (year: ${year}) { edges { node {  doi title year authors journal pages pubId  } } }}`;
          return axios.post(newGraphQLRoot, {
            query,
          })
            .then((yearResponse) => {
              let references = yearResponse.data.data.publications.edges
                .map((n) => (n.node));
              references = [...new Set(references)];
              const dois = yearResponse.data.data.publications.edges.map((n) => (n.node.doi));

              const titles = yearResponse.data.data.publications.edges.map((n) => (n.node.title));
              const pubIds = yearResponse.data.data.publications.edges.map((n) => (n.node.pubId));


              const allReferences = this.state.references;
              const allDois = this.state.dois;
              const allTitles = this.state.titles;
              const allPubIds = this.state.pubIds;

              allReferences[year] = references;
              allDois[year] = dois;
              allTitles[year] = titles;
              allPubIds[year] = pubIds;

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
  backToList() {
    this.setState({
      pubId: '',
      systems: [],
      reactionEnergies: [],
    });
    this.props.router.push('/publications');
  }
  clickPublication(event, target, key, pubId) {
    this.setState({
      systems: [],
      reactionEnergies: [],
      pubId,
    });
    this.props.router.push(`/publications/${pubId}`);
  }

  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
        {!_.isEmpty(this.state.pubId) ? <div>
          <div>
            <Button
              onClick={() => {
                this.backToList();
              }}
            >
              <MdChevronLeft />
              Back to Publication List</Button>
          </div>
          <PublicationView pubId={this.state.pubId} />
        </div>
            : <div>

              <h1>Publications/Datasets</h1>

              {this.state.references === {} ? <LinearProgress color="primary" /> : null }
              {this.state.years.map((year, i) => (
                <Slide
                  key={`slide_${i}`}
                  in
                  mountOnEnter
                  unmountOnExit
                  timeout={200 * i}
                  direction="left"
                >
                  <div>
                    <Paper key={`div_year_${i}`} className={this.props.classes.paper}>
                      {(this.state.references[year] || []).length === 0 ? null :
                      <h2 key={`pyear_${year}`} className={this.props.classes.publicationYear}>{year}</h2>
                  }
                      {(this.state.references[year] || [])
                    .map((reference, j) => {
                      if (this.state.titles[year][j] !== null) {
                        return (

                          <div key={`pli_${i}_${j}`} className={this.props.classes.publicationEntry}>
                            <Paper className={this.props.classes.smallPaper}>
                              <span className={this.props.classes.publicationEntry}>
                                <IoDocument size={24} /> {prettyPrintReference(reference)}

                              </span>
                              <Grid container direction="row" justify="flex-end" className={this.props.classes.publicationActions}>

                                <Grid item>

                                  <Button onClick={(target, event) => this.clickPublication(event, target, `elem_${year}_${j}`, this.state.pubIds[year][j])} className={this.props.classes.publicationAction}>
                                    <MdViewList /> {'\u00A0\u00A0'}Checkout Reactions {'\u00A0\u00A0'} <MdChevronRight />
                                  </Button>
                                  {(this.state.dois[year][j] === null
                            || typeof this.state.dois[year][j] === 'undefined'
                            || this.state.dois[year][j] === ''
                          ) ? null :
                          <ReactGA.OutboundLink
                            eventLabel={`http://dx.doi.org/${this.state.dois[year][j]}`}
                            to={`http://dx.doi.org/${this.state.dois[year][j]}`}
                            target="_blank"
                            className={this.props.classes.outboundLink}
                          >
                            <Button className={this.props.classes.publicationAction}>
                              <FaExternalLink />{'\u00A0\u00A0'} DOI: {this.state.dois[year][j]}.
                                </Button>
                          </ReactGA.OutboundLink>
                          }
                                </Grid>
                              </Grid>

                              <div>
                                { this.state.openedPublication !== `elem_${year}_${j}` ? null :
                                <span>
                                  {this.state.loading === true ? <LinearProgress color="primary" /> : null}

                                  {/*
                        true || this.state.reactionEnergies.length === 0 ? null :
                        <PublicationReactions {...this.state} />
                        */}
                                  {this.state.systems.length === 0 ? null :
                                  <PublicationSystems {...this.state} />
                        }
                                </span>
                            }
                              </div>
                              <br />
                            </Paper>
                          </div>
                        );
                      }
                      return null;
                    })}
                    </Paper>
                  </div>
                </Slide>
          ))
        }
            </div>
        }
      </div>
    );
  }
}

Publications.propTypes = {
  classes: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(Publications);
