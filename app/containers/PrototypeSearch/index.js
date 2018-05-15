/*
 *
 * PrototypeSearch
 *
 */

import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
/* import cachios from 'cachios';*/
import ReactGA from 'react-ga';
import Script from 'react-load-script';
import axios from 'axios';
import cachios from 'cachios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Hidden from 'material-ui/Hidden';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router';

import {
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MdChevronLeft, MdChevronRight, MdSearch, MdExpandMore, MdExpandLess } from 'react-icons/lib/md';

import * as catKitActions from 'containers/CatKitDemo/actions';
import * as wyckoffActions from 'containers/BulkGenerator/actions';
import { apiRoot } from 'utils/constants';
import Header from './header';
import SearchInfo from './Info';
import { styles } from './styles';
import * as actions from './actions';

const url = `${apiRoot}/apps/prototypeSearch/facet_search/`;
const ptypeUrl = `${apiRoot}/apps/prototypeSearch/prototype/`;
const structureUrl = `${apiRoot}/apps/prototypeSearch/get_structure/`;
const shortLength = 5;
const longLength = 20;

const hmSymbols = ['P 1', 'P -1', 'P 1 2 1', 'P 1 21 1', 'C 1 2 1', 'P 1 m 1', 'P 1 c 1', 'C 1 m 1', 'C 1 c 1', 'P 1 2/m 1', 'P 1 21/m 1', 'C 1 2/m 1', 'P 1 2/c 1', 'P 1 21/c 1', 'C 1 2/c 1', 'P 2 2 2', 'P 2 2 21', 'P 21 21 2', 'P 21 21 21', 'C 2 2 21', 'C 2 2 2', 'F 2 2 2', 'I 2 2 2', 'I 21 21 21', 'P m m 2', 'P m c 21', 'P c c 2', 'P m a 2', 'P c a 21', 'P n c 2', 'P m n 21', 'P b a 2', 'P n a 21', 'P n n 2', 'C m m 2', 'C m c 21', 'C c c 2', 'A m m 2', 'A b m 2', 'A m a 2', 'A b a 2', 'F m m 2', 'F d d 2', 'I m m 2', 'I b a 2', 'I m a 2', 'P m m m', 'P n n n', 'P c c m', 'P b a n', 'P m m a', 'P n n a', 'P m n a', 'P c c a', 'P b a m', 'P c c n', 'P b c m', 'P n n m', 'P m m n', 'P b c n', 'P b c a', 'P n m a', 'C m c m', 'C m c a', 'C m m m', 'C c c m', 'C m m a', 'C c c a', 'F m m m', 'F d d d', 'I m m m', 'I b a m', 'I b c a', 'I m m a', 'P 4', 'P 41', 'P 42', 'P 43', 'I 4', 'I 41', 'P -4', 'I -4', 'P 4/m', 'P 42/m', 'P 4/n', 'P 42/n', 'I 4/m', 'I 41/a', 'P 4 2 2', 'P 4 21 2', 'P 41 2 2', 'P 41 21 2', 'P 42 2 2', 'P 42 21 2', 'P 43 2 2', 'P 43 21 2', 'I 4 2 2', 'I 41 2 2', 'P 4 m m', 'P 4 b m', 'P 42 c m', 'P 42 n m', 'P 4 c c', 'P 4 n c', 'P 42 m c', 'P 42 b c', 'I 4 m m', 'I 4 c m', 'I 41 m d', 'I 41 c d', 'P -4 2 m', 'P -4 2 c', 'P -4 21 m', 'P -4 21 c', 'P -4 m 2', 'P -4 c 2', 'P -4 b 2', 'P -4 n 2', 'I -4 m 2', 'I -4 c 2', 'I -4 2 m', 'I -4 2 d', 'P 4/m m m', 'P 4/m c c', 'P 4/n b m', 'P 4/n n c', 'P 4/m b m', 'P 4/m n c', 'P 4/n m m', 'P 4/n c c', 'P 42/m m c', 'P 42/m c m', 'P 42/n b c', 'P 42/n n m', 'P 42/m b c', 'P 42/m n m', 'P 42/n m c', 'P 42/n c m', 'I 4/m m m', 'I 4/m c m', 'I 41/a m d', 'I 41/a c d', 'P 3', 'P 31', 'P 32', 'R 3', 'P -3', 'R -3', 'P 3 1 2', 'P 3 2 1', 'P 31 1 2', 'P 31 2 1', 'P 32 1 2', 'P 32 2 1', 'R 3 2', 'P 3 m 1', 'P 3 1 m', 'P 3 c 1', 'P 3 1 c', 'R 3 m', 'R 3 c', 'P -3 1 m', 'P -3 1 c', 'P -3 m 1', 'P -3 c 1', 'R -3 m', 'R -3 c', 'P 6', 'P 61', 'P 65', 'P 62', 'P 64', 'P 63', 'P -6', 'P 6/m', 'P 63/m', 'P 6 2 2', 'P 61 2 2', 'P 65 2 2', 'P 62 2 2', 'P 64 2 2', 'P 63 2 2', 'P 6 m m', 'P 6 c c', 'P 63 c m', 'P 63 m c', 'P -6 m 2', 'P -6 c 2', 'P -6 2 m', 'P -6 2 c', 'P 6/m m m', 'P 6/m c c', 'P 63/m c m', 'P 63/m m c', 'P 2 3', 'F 2 3', 'I 2 3', 'P 21 3', 'I 21 3', 'P m -3', 'P n -3', 'F m -3', 'F d -3', 'I m -3', 'P a -3', 'I a -3', 'P 4 3 2', 'P 42 3 2', 'F 4 3 2', 'F 41 3 2', 'I 4 3 2', 'P 43 3 2', 'P 41 3 2', 'I 41 3 2', 'P -4 3 m', 'F -4 3 m', 'I -4 3 m', 'P -4 3 n', 'F -4 3 c', 'I -4 3 d', 'P m -3 m', 'P n -3 n', 'P m -3 n', 'P n -3 m', 'F m -3 m', 'F m -3 c', 'F d -3 m', 'F d -3 c', 'I m -3 m', 'I a -3 d'];


const initialState = {
  searchString: '',
  loading: false,
  error: false,
  errorMessage: '',
  loadingMore: false,
  loadingPrototype: false,
  spacegroupsCollapsed: true,
  nAtomsCollapsed: true,
  nSpeciesCollapsed: true,
  speciesCollapsed: true,
  speciesSortByFrequency: false,
  spacegroupSortByFrequency: true,
  atomsSortByFrequency: false,
  stoichiometrySortByFrequency: true,
  stoichiometriesCollapsed: true,
  showPrototype: false,
};

const getGeometryUrl = (repository, handle) => {
  if (repository === 'OQMD') {
    return `http://oqmd.org/materials/entry/${handle.split('-')[2]}`;
  } else if (repository === 'MaterialsProject') {
    return `https://materialsproject.org/materials/${handle}/`;
  } else if (repository === 'AMCSD') {
    return `http://rruff.geo.arizona.edu/AMS/CIF_text_files/${handle}`;
  } else if (repository === 'catalysis-hub') {
    return `http://api.catalysis-hub.org/graphql?query=%7Bsystems(uniqueId%3A%22${handle}%22)%20%7B%0A%20%20edges%20%7B%0A%20%20%20%20node%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20uniqueId%0A%20%20%20%20%20%20energy%0A%20%20%20%20%20%20keyValuePairs%0A%20%20%20%20%20%20InputFile(format%3A%22cif%22)%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%7D`;
  } else if (repository === 'COD') {
    return `http://www.crystallography.net/cod/${handle}.html`;
  } else if (repository === 'AFLOW') {
    return `http://aflowlib.duke.edu/${handle.split(/-/g).slice(0, handle.split(/-/g).length - 1).join('/')}`;
  }
  return 'http://www.catalysis-hub.org/Error: Unknown repository';
};

const cf = (formula) => {
  const res = {};
  let ress = '';
  formula.map((symbol) => {
    res[symbol] = (res[symbol] || 0) + 1;
    return res;
  });
  Object.keys(res).map((key) => {
    ress += (res[key] === 1 ? key : key + res[key]);
    return ress;
  });
  return ress;
};

export class PrototypeSearch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      showInfo: ((this.props.cookies.get('prototypeSearchShowInfo') || 'true') === 'true'),
      searchString: this.props.searchTerms,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = initialState;
    this.selectPrototype = this.selectPrototype.bind(this);
    this.unselectPrototype = this.unselectPrototype.bind(this);
    this.handoffWyckoff = this.handoffWyckoff.bind(this);
    this.handoffCatKit = this.handoffCatKit.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);

    /* this.setState(initialState);*/
  }
  componentWillMount() {
    this.setState({
      searchString: this.props.searchTerms,
    });
    this.submitSearch();
  }

  handleShowInfo() {
    const value = !this.state.showInfo;
    this.setState({
      showInfo: value,
    });
    this.props.cookies.set('showInfo', value);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  handoffWyckoff(ptype) {
    const params = { params: {
      spacegroup: ptype.spacegroup,
    },
      ttl: 300,
    };
    cachios.get(`${apiRoot}/apps/bulkEnumerator/get_wyckoff_list`, params).then((response) => {
      this.props.wyckoffSetWyckoffList(response.data.wyckoff_list);
    });
    axios.post(structureUrl, {
      spacegroup: ptype.spacegroup,
      parameter_names: ptype.parameter_names,
      parameters: ptype.parameters,
      species: ptype.species,
      wyckoffs: ptype.wyckoffs,
    }).then((response) => {
      this.props.wyckoffSetCellParameters(
        _.fromPairs(
          _.zip(
            JSON.parse(ptype.parameter_names.replace(/'/g, '"')),
            JSON.parse(ptype.parameters)
          )
        )
      );
      this.props.wyckoffSetName(ptype.prototype);
      this.props.wyckoffSetSpacegroup(parseInt(ptype.spacegroup, 10));
      this.props.wyckoffReceiveBulkStructure(response.data.structure);

      const wyckoffPoints = _.zip(
        JSON.parse(ptype.species.replace(/'/g, '"')),
        JSON.parse(ptype.wyckoffs.replace(/'/g, '"'))
      ).map((p) => ({
        species: p[0],
        symbol: p[1],
      }));
      this.props.wyckoffSetWyckoffPoints(wyckoffPoints);
    }).catch((error) => {
      this.setState({
        error: true,
        loading: false,
        errorMessage: error,
      });
    });
  }

  handoffCatKit(ptype) {
    axios.post(structureUrl, {
      spacegroup: ptype.spacegroup,
      parameter_names: ptype.parameter_names,
      parameters: ptype.parameters,
      species: ptype.species,
      wyckoffs: ptype.wyckoffs,
    }).then((response) => {
      this.props.receiveBulkCif(response.data.structure);
      this.props.saveBulkParams({
        name: ptype.protopype,
        spacegroup: ptype.spacegroup,
      });
      this.props.dropBulkInput();
    });
  }

  loadMore() {
    this.setState({
      loadingMore: true,
    });
    this.props.saveSearchLimit(this.props.searchLimit + 50);
    this.submitSearch(true);
  }

  selectPrototype(ptype) {
    this.props.savePrototype(ptype);
    this.setState({
      showPrototype: true,
      loadingPrototype: true,

    });
    const params = { params: {
      search_terms: this.state.searchString,
      facet_filters: JSON.stringify(this.props.facetFilters),
      prototype: ptype,
    },
    };
    axios.get(ptypeUrl, params).then((response) => {
      const repoPrototypes = _.groupBy(response.data.prototypes, 'repository');
      this.props.saveRepoPrototypes(repoPrototypes);
      this.setState({
        loadingPrototype: false,
      });
    });
  }

  unselectPrototype() {
    this.setState({
      showPrototype: false,
    });
    this.props.savePrototype('');
  }

  submitSearch(loadMore = false) {
    this.setState({
      error: false,
      loading: true,
      showPrototype: false,
    });
    this.props.saveSearchTerms(this.state.searchString);
    if (!loadMore) {
      this.props.saveSearchResults({});
    }
    this.props.savePrototype('');
    const searchString = this.state.searchString
      .replace(/:\s+/g, ':') // remove spaces right after colon
      .replace(/[;]/g, ''); // remove control characters like ; or ,
    const params = { params: {
      search_terms: searchString,
      facet_filters: JSON.stringify(this.props.facetFilters),
      limit: this.props.searchLimit,
    },
      /* ttl: 300,*/
    };
    axios.get(url, params).then((response) => {
      this.setState({
        loading: false,
        loadingMore: false,
      });
      this.props.saveSearchResults(response.data);
    }).catch((error) => {
      this.setState({
        error: true,
        loading: false,
        errorMessage: error,
      });
    }
    );
  }

  render() {
    return (
      <div>
        <Script url="/static/ChemDoodleWeb.js" />
        {!this.state.showInfo ? null :
        <Paper className={this.props.classes.outerPaper}>
          <SearchInfo />
        </Paper>
        }
        <Header />
        {!this.state.error ? null :
        <Paper className={this.props.classes.errorPaper}>
          <h3>
              Error in search.
              </h3>
          <div>
            <pre>{this.props.searchTerms}</pre>
          </div>
          <ul>
            {this.props.facetFilters.map(((filter, i) => (
              <li key={`li_${i}`}>
                {filter}
              </li>
                  )
                ))}
          </ul>
          <div>
              Try again or change your queries.
              </div>
          <Grid container direction="row" justify="flex-end">
            <Grid item>
              <Button
                raised
                onClick={() => {
                  this.setState({
                    error: false,
                  });
                }}
              >
                    OK
                  </Button>
            </Grid>
          </Grid>
        </Paper>
        }
        <Paper>
          <Grid container direction="column" justify="space-between">
            <Grid item>
              <TextField
                autoFocus
                onChange={this.handleChange('searchString')}
                value={this.state.searchString}
                label="Search ..."
                placeholder="stoichiometry:AB2 species:AgO n_species:2-5 repository:AMCSD,catalysis-hub"
                className={this.props.classes.textField}
                onKeyDown={((event) => {
                  if (event.nativeEvent.keyCode === 13) {
                    this.submitSearch();
                  }
                })}
              />
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="space-between">
                {_.isEmpty(this.props.searchResults) ? null :
                <div
                  className={this.props.classes.hintText}
                >
                  {`${this.props.searchResults.time.toFixed(2)} s, ${this.props.searchResults.n_compounds} structures.`}</div>
                }
                <Hidden smDown>
                  <Button
                    className={this.props.classes.button}
                    onClick={() => this.handleShowInfo()}
                  >
                    {this.state.showInfo ? 'Hide Info' : 'Info' }
                  </Button>
                </Hidden>
                <Button raised onClick={this.submitSearch} color="primary" className={this.props.classes.button}><MdSearch /> Search </Button>
                <Grid container direction="row" justify="flex-end">
                  <Grid item>
                    <Hidden mdUp>
                      <Button
                        className={this.props.classes.button}
                        onClick={() => this.handleShowInfo()}
                      >
                        {this.state.showInfo ? 'Hide Info' : 'Info' }
                      </Button>
                    </Hidden>
                  </Grid>
                  {this.props.facetFilters.map((facetFilter, i) => (
                    <Grid
                      item
                      key={`chip_${i}`}
                    >
                      <Chip
                        label={`${facetFilter}`}
                        className={this.props.classes.button}
                        onDelete={() => { this.props.removeFacetFilter(facetFilter); }}
                      />
                    </Grid>
                  ))

                  }
                </Grid>

                <Grid container justify="space-between" direction="row">
                  {!_.isEmpty(this.props.searchResults) ? null :
                  <Hidden smDown>
                    <Grid item className={this.props.classes.paper}>
                      <div className={this.props.classes.paper}>
                        <div>
                              Example searches:
                            </div>
                        <Typography>
                              stoichiometry:AB species:GaPd crystal_system:tetragonal repository:AMCSD,catalysis-hub spacegroup:120-150,23
                            </Typography>
                      </div>
                    </Grid>
                  </Hidden>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {this.state == null || this.state.loading ? <LinearProgress className={this.props.classes.progress} /> : null }
        <Grid container direction="row" justify="space-between">
          <Grid item xs={3}>
            {_.isEmpty(this.props.searchResults.repositories) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <FormControl component="div">
                  <FormLabel component="legend">Repositories</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.repositories
                          .map((repository, si) => (
                            <FormControlLabel
                              key={`sg_${si}`}
                              label={`${repository[0]} (${repository[1]})`}
                              control={<Checkbox
                                value={`repository:${repository[0]}`}
                                checked={_.indexOf(this.props.facetFilters, `repository:${repository[0]}`) > -1}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    this.props.addFacetFilter(`repository:${repository[0]}`);
                                  } else {
                                    this.props.removeFacetFilter(`repository:${repository[0]}`);
                                  }
                                  return checked;
                                }}
                              />}
                            />
                          ))}
                  </FormGroup>
                </FormControl>
              </Paper>
            </Hidden>
            }
            {_.isEmpty(this.props.searchResults.stoichiometries) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <FormHelperText
                      onClick={() => {
                        this.setState({
                          stoichiometriesCollapsed: !this.state.stoichiometriesCollapsed,
                        });
                      }}
                    >{this.state.stoichiometriesCollapsed ?
                      <div>show more <MdExpandMore /></div>
                            : <div>show less <MdExpandLess /></div>
                        }</FormHelperText>
                  </Grid>
                  <Grid item>
                    <FormHelperText
                      onClick={() => this.setState({ stoichiometrySortByFrequency: !this.state.stoichiometrySortByFrequency })}
                    >
                        Sort By {this.state.stoichiometrySortByFrequency ? 'Value' : 'Frequency'}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <FormControl component="div">
                  <FormLabel component="legend">Stoichiometry</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.stoichiometries
                          .sort((a, b) => {
                            if (this.state.stoichiometrySortByFrequency) {
                              return b[1] - a[1];
                            }
                            if (a[0] > b[0]) {
                              return 1;
                            }
                            return -1;
                          })
                          .slice(0, this.state.stoichiometriesCollapsed ? shortLength : 230)
                          .map((stoichiometry, si) => (
                            <FormControlLabel
                              key={`sm_${si}`}
                              label={`${stoichiometry[0]} (${stoichiometry[1]})`}
                              control={<Checkbox
                                value={`stoichiometry:${stoichiometry}`}
                                checked={_.indexOf(this.props.facetFilters, `stoichiometry:${stoichiometry[0]}`) > -1}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    this.props.addFacetFilter(`stoichiometry:${stoichiometry[0]}`);
                                  } else {
                                    this.props.removeFacetFilter(`stoichiometry:${stoichiometry[0]}`);
                                  }
                                  return checked;
                                }}
                              />}
                            />
                          ))}
                  </FormGroup>
                </FormControl>
              </Paper>
            </Hidden>
            }


            {_.isEmpty(this.props.searchResults.n_species) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <FormHelperText
                      onClick={() => {
                        this.setState({
                          nSpeciesCollapsed: !this.state.nSpeciesCollapsed,
                        });
                      }}
                    >{
                          this.state.nSpeciesCollapsed ?
                            <div>show more <MdExpandMore /></div>
                            : <div>show less <MdExpandLess /></div>
                        }</FormHelperText>
                  </Grid>
                  <Grid item>
                    <FormHelperText
                      onClick={() => this.setState({ speciesSortByFrequency: !this.state.speciesSortByFrequency })}
                    >
                        Sort By {this.state.speciesSortByFrequency ? 'Value' : 'Frequency'}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <FormControl component="div">
                  <FormLabel component="legend">#Species</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.n_species
                          .sort((a, b) => {
                            if (this.state.speciesSortByFrequency) {
                              return a[0] - b[0];
                            }
                            return b[1] - a[1];
                          })
                          .slice(0, this.state.nSpeciesCollapsed ? shortLength : longLength)
                          .map((nSpecies, si) => (
                            <FormControlLabel
                              key={`spec_${si}`}
                              label={`${nSpecies[0]} (${nSpecies[1]})`}
                              control={<Checkbox
                                value={`n_species:${nSpecies}`}
                                checked={_.indexOf(this.props.facetFilters, `n_species:${nSpecies[0]}`) > -1}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    this.props.addFacetFilter(`n_species:${nSpecies[0]}`);
                                  } else {
                                    this.props.removeFacetFilter(`n_species:${nSpecies[0]}`);
                                  }
                                  return checked;
                                }}
                              />}
                            />
                          ))}
                  </FormGroup>
                </FormControl>
              </Paper>
            </Hidden>
            }



            {_.isEmpty(this.props.searchResults.n_atoms) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <FormHelperText
                      onClick={() => {
                        this.setState({
                          nAtomsCollapsed: !this.state.nAtomsCollapsed,
                        });
                      }}
                    >{
                          this.state.nAtomsCollapsed ?
                            <div>show more <MdExpandMore /></div>
                            : <div>show less <MdExpandLess /></div>
                        }</FormHelperText>
                  </Grid>
                  <Grid item>
                    <FormHelperText
                      onClick={() => this.setState({ atomsSortByFrequency: !this.state.atomsSortByFrequency })}
                    >
                        Sort By {this.state.atomsSortByFrequency ? 'Value' : 'Frequency'}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <FormControl component="div">
                  <FormLabel component="legend">#Atoms</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.n_atoms
                          .sort((a, b) => {
                            if (this.state.atomsSortByFrequency) {
                              return a[0] - b[0];
                            }
                            return b[1] - a[1];
                          })
                          .slice(0, this.state.nAtomsCollapsed ? shortLength : longLength)
                          .map((nAtoms, si) => (
                            <FormControlLabel
                              key={`sg_${si}`}
                              label={`${nAtoms[0]} (${nAtoms[1]})`}
                              control={<Checkbox
                                value={`n_atoms:${nAtoms}`}
                                checked={_.indexOf(this.props.facetFilters, `n_atoms:${nAtoms[0]}`) > -1}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    this.props.addFacetFilter(`n_atoms:${nAtoms[0]}`);
                                  } else {
                                    this.props.removeFacetFilter(`n_atoms:${nAtoms[0]}`);
                                  }
                                  return checked;
                                }}
                              />}
                            />
                          ))}
                  </FormGroup>
                </FormControl>
              </Paper>
            </Hidden>
            }




            {_.isEmpty(this.props.searchResults.species) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <FormControl component="div">
                  <FormLabel component="legend">Species</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.species
                            .slice(0, this.state.speciesCollapsed ? shortLength : longLength)
                            .map((species, si) => (
                              <FormControlLabel
                                key={`spg_${si}`}
                                label={`${cf(species[0])}  (${species[1]})`}
                                control={<Checkbox
                                  value={`species:${species}`}
                                  checked={_.indexOf(this.props.facetFilters, `species:${species[0]}`) > -1}
                                  onChange={(event, checked) => {
                                    if (checked) {
                                      this.props.addFacetFilter(`species:${species[0]}`);
                                    } else {
                                      this.props.removeFacetFilter(`species:${species[0]}`);
                                    }
                                    return checked;
                                  }}
                                />}
                              />
                            ))}
                  </FormGroup>
                  <FormHelperText
                    onClick={() => {
                      this.setState({
                        speciesCollapsed: !this.state.speciesCollapsed,
                      });
                    }}
                  >{
                            this.state.speciesCollapsed ?
                              <div>show more <MdExpandMore /></div>
                              : <div>show less <MdExpandLess /></div>
                          }</FormHelperText>
                </FormControl>
              </Paper>
            </Hidden>
            }



            {_.isEmpty(this.props.searchResults.spacegroups) ? null :
            <Hidden xsDown>
              <Paper className={this.props.classes.facetPanel}>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <FormHelperText
                      onClick={() => {
                        this.setState({
                          spacegroupsCollapsed: !this.state.spacegroupsCollapsed,
                        });
                      }}
                    >{this.state.spacegroupsCollapsed ?
                      <div>show more <MdExpandMore /></div>
                            : <div>show less <MdExpandLess /></div>
                        }</FormHelperText>
                  </Grid>
                  <Grid item>
                    <FormHelperText
                      onClick={() => this.setState({ spacegroupSortByFrequency: !this.state.spacegroupSortByFrequency })}
                    >
                        Sort By {this.state.spacegroupSortByFrequency ? 'Value' : 'Frequency'}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <FormControl component="div">
                  <FormLabel component="legend">Spacegroups [HM-Symbol]</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.spacegroups
                          .sort((a, b) => {
                            if (this.state.spacegroupSortByFrequency) {
                              return b[1] - a[1];
                            }
                            return a[0] - b[0];
                          })
                          .slice(0, this.state.spacegroupsCollapsed ? shortLength : 230)
                          .map((spacegroup, si) => (
                            <FormControlLabel
                              key={`sg_${si}`}
                              label={`${spacegroup[0]} [${hmSymbols[parseInt(spacegroup, 10) - 1]}] (${spacegroup[1]})`}
                              control={<Checkbox
                                value={`spacegroup:${spacegroup}`}
                                checked={_.indexOf(this.props.facetFilters, `spacegroup:${spacegroup[0]}`) > -1}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    this.props.addFacetFilter(`spacegroup:${spacegroup[0]}`);
                                  } else {
                                    this.props.removeFacetFilter(`spacegroup:${spacegroup[0]}`);
                                  }
                                  return checked;
                                }}
                              />}
                            />
                          ))}
                  </FormGroup>
                </FormControl>
              </Paper>
            </Hidden>
            }
          </Grid>
          <Grid item sm={9} xs={12} >
            {_.isEmpty(this.props.searchResults.prototypes) ? null :
            <Paper>
              {this.state.loadingPrototype ? <LinearProgress className={this.props.classes.progress} /> : null}
              {this.state.showPrototype ?
                <div>
                  <h3 className={this.props.classes.subheader}>
                    <IconButton
                      onClick={() => this.unselectPrototype()}
                    >
                      <MdChevronLeft />
                    </IconButton>
                          Prototype {this.props.ptype}</h3>
                  {Object.keys(this.props.repoPrototypes).map((repository, ri) => (
                    <Paper
                      key={`repolist_${ri}`}
                      className={this.props.classes.paper}
                    >
                      <h4>{repository}</h4>
                      <ul>
                        {this.props.repoPrototypes[repository].map((ptype, pi) => (
                          <li key={`ptype_${pi}`}>
                            <ReactGA.OutboundLink
                              eventLabel="Goto Structure Source"
                              to={getGeometryUrl(ptype.repository, ptype.handle, ptype.tags)}
                              target="_blank"
                            >
                                    Source: {ptype.repository}:{ptype.handle}
                            </ReactGA.OutboundLink>
                            <ul>
                              {Object.keys(ptype).map((entry, ei) => (
                                <li key={`entry_${ei}`}>
                                  {entry}: {ptype[entry]}
                                </li>
                                    ))}
                            </ul>
                            <Grid container direction="row" justify="flex-end">
                              <Grid item>
                                <Button
                                  color="primary"
                                  onClick={() => this.handoffWyckoff(ptype)}
                                >
                                  <Link
                                    className={this.props.classes.buttonLink}
                                    to={'/bulkGenerator'}
                                  >
                                          Open in Wyckoff Bulk Generator
                                        </Link>
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  color="primary"
                                  onClick={() => this.handoffCatKit(
                                          ptype
                                        )}
                                >
                                  <Link
                                    className={this.props.classes.buttonLink}
                                    to={'/catKitDemo'}
                                  >
                                          Open in CatKit
                                        </Link>
                                </Button>
                              </Grid>
                            </Grid>
                          </li>
                              ))}
                      </ul>
                    </Paper>
                        ))}
                </div>
                      :
                <div>

                  <div>
                    <h3 className={this.props.classes.subheader}>Prototypes ({this.props.searchResults.n_prototypes})</h3>
                    {this.props.searchResults.prototypes.map((ptype, pi) => (
                      <Paper key={`pcard_${pi}`} className={this.props.classes.pcard}>
                        <h4>Prototype {ptype[0]}</h4>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <div>
                                    Structures: {ptype[1]}
                            </div>
                          </Grid>
                          <Grid item>
                            <Hidden xsDown>
                              <Button
                                raised
                                color="primary"
                                onClick={() => this.selectPrototype(ptype[0])}
                                className={this.props.classes.button}
                              >Details <MdChevronRight />
                              </Button>
                            </Hidden>
                            <Hidden smUp>
                              <Button
                                raised
                                color="primary"
                                onClick={() => this.selectPrototype(ptype[0])}
                                className={this.props.classes.button}
                              ><MdChevronRight />
                              </Button>
                            </Hidden>
                          </Grid>
                        </Grid>
                      </Paper>
                          )) }
                  </div>
                  <Grid container direction="row" justify="center">
                    <Grid item>
                      <Button
                        onClick={() => { this.loadMore(); }}
                      >
                        {this.state.loadingMore ? <CircularProgress /> : null }

                              Load More
                            </Button>
                    </Grid>
                  </Grid>
                </div>
                  }
            </Paper>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}

PrototypeSearch.propTypes = {
  classes: PropTypes.object,
  searchResults: PropTypes.object,
  searchLimit: PropTypes.number,
  facetFilters: PropTypes.array,
  ptype: PropTypes.string,
  searchTerms: PropTypes.string,
  repoPrototypes: PropTypes.object,

  saveSearchResults: PropTypes.func,
  addFacetFilter: PropTypes.func,
  removeFacetFilter: PropTypes.func,
  saveSearchLimit: PropTypes.func,
  saveSearchTerms: PropTypes.func,
  savePrototype: PropTypes.func,
  saveRepoPrototypes: PropTypes.func,
  receiveBulkCif: PropTypes.func,
  saveBulkParams: PropTypes.func,
  dropBulkInput: PropTypes.func,

  wyckoffReceiveBulkStructure: PropTypes.func,
  wyckoffSetCellParameters: PropTypes.func,
  wyckoffSetName: PropTypes.func,
  /* wyckoffSetPermutations: PropTypes.func,*/
  wyckoffSetSpacegroup: PropTypes.func,
  wyckoffSetWyckoffPoints: PropTypes.func,
  wyckoffSetWyckoffList: PropTypes.func,

  cookies: instanceOf(Cookies),
};

const mapStateToProps = (state) => ({
  facetFilters: state.get('prototypeSearch').facetFilters,
  ptype: state.get('prototypeSearch').ptype,
  repoPrototypes: state.get('prototypeSearch').repoPrototypes,
  searchLimit: state.get('prototypeSearch').searchLimit,
  searchResults: state.get('prototypeSearch').searchResults,
  searchTerms: state.get('prototypeSearch').searchTerms,
});

const mapDispatchToProps = (dispatch) => ({
  saveSearchResults: (searchResults) => {
    dispatch(actions.saveSearchResults(searchResults));
  },
  saveSearchTerms: (searchTerms) => {
    dispatch(actions.saveSearchTerms(searchTerms));
  },
  addFacetFilter: (facetFilter) => {
    dispatch(actions.addFacetFilter(facetFilter));
  },
  removeFacetFilter: (facetFilter) => {
    dispatch(actions.removeFacetFilter(facetFilter));
  },
  saveSearchLimit: (searchLimit) => {
    dispatch(actions.saveSearchLimit(searchLimit));
  },
  savePrototype: (ptype) => {
    dispatch(actions.savePrototype(ptype));
  },
  saveRepoPrototypes: (repoPrototypes) => {
    dispatch(actions.saveRepoPrototypes(repoPrototypes));
  },
  receiveBulkCif: (bulkCif) => {
    dispatch(catKitActions.receiveBulkCif(bulkCif));
  },
  dropBulkInput: () => {
    dispatch(catKitActions.dropBulkInput());
  },
  saveBulkParams: (bulkParams) => {
    dispatch(catKitActions.saveBulkParams(bulkParams));
  },
  wyckoffReceiveBulkStructure: (x) => {
    dispatch(wyckoffActions.receiveBulkStructure(x));
  },
  wyckoffSetCellParameters: (x) => {
    dispatch(wyckoffActions.setCellParameters(x));
  },
  wyckoffSetName: (x) => {
    dispatch(wyckoffActions.setName(x));
  },
  wyckoffSetPermutations: (x) => {
    dispatch(wyckoffActions.setPermutations(x));
  },
  wyckoffSetSpacegroup: (x) => {
    dispatch(wyckoffActions.setSpacegroup(x));
  },
  wyckoffSetWyckoffPoints: (x) => {
    dispatch(wyckoffActions.setWyckoffPoints(x));
  },
  wyckoffSetWyckoffList: (x) => {
    dispatch(wyckoffActions.receiveWyckoffList(x));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withCookies(
    withStyles(styles, { withTheme: true })(
      PrototypeSearch
    ))
);
