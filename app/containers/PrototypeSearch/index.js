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
import {
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/lib/md';

import { withCommas } from 'utils/functions';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import CompositionBar from 'components/CompositionBar';
import * as catKitActions from 'containers/CatKitDemo/actions';
import * as wyckoffActions from 'containers/BulkGenerator/actions';
import { apiRoot } from 'utils/constants';
import { hmSymbols } from 'utils/data';
import Header from './header';
import SearchInfo from './Info';
import { styles } from './styles';
import * as actions from './actions';

const url = `${apiRoot}/apps/prototypeSearch/facet_search/`;
const ptypeUrl = `${apiRoot}/apps/prototypeSearch/prototype/`;
const structureUrl = `${apiRoot}/apps/prototypeSearch/get_structure/`;
const shortLength = 5;
const longLength = 20;



const STRUCTURES_PER_OFFSET = 100;

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
  loadedStructures: 0,
  prototypeStructures: 0,
  loadingMoreStructures: false,
  structures: {},
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
    this.getStructure = this.getStructure.bind(this);
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
    setTimeout(() => {
      this.submitSearch();
    }, 500);
  }

  getStructure(ptype, pi) {
    axios.post(structureUrl, {
      spacegroup: ptype.spacegroup,
      parameter_names: ptype.parameter_names,
      parameters: ptype.parameters,
      species: ptype.species,
      wyckoffs: ptype.wyckoffs,
    }).then((response) => {
      this.setState({
        structures: _.merge(
          this.state.structure,
          { [pi]: response.data.structure }
        ),
      });
    });
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
      this.props.catKitStepperHandleReset();
      this.props.saveBulkParams({
        name: ptype.prototype,
        spacegroup: ptype.spacegroup,
        elements: JSON.parse(ptype.species.replace(/'/g, '"')),
        repository: ptype.repository,
        handle: ptype.handle,
        format: this.props.cookies.get('preferredFormat') || 'cif',
        wyckoff: {
          name: ptype.prototype,
          cif: response.data.structure,
          elements: JSON.parse(ptype.species.replace(/'/g, '"')),
          species: JSON.parse(ptype.species.replace(/'/g, '"')),
          spacegroup: ptype.spacegroup,
          wyckoff: JSON.parse(ptype.wyckoffs.replace(/'/g, '"')),
        },
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

  selectPrototype(ptype, nStructures) {
    this.props.savePrototype(ptype);
    this.setState({
      showPrototype: true,
      loadingPrototype: true,
      loadingMoreStructures: true,
      prototypeStructures: nStructures,

    });
    const params = { params: {
      search_terms: this.state.searchString,
      facet_filters: JSON.stringify(this.props.facetFilters),
      prototype: ptype,
      offset: this.state.loadedStructures,
      limit: STRUCTURES_PER_OFFSET,
    },
    };
    axios.get(ptypeUrl, params).then((response) => {
      this.props.saveRepoPrototypes(response.data.repoPrototypes);
      const repoPrototypes = _.groupBy(response.data.prototypes, 'repository');
      this.props.saveGroupedRepoPrototypes(_.merge(this.props.repoPrototypes, repoPrototypes));
      this.setState({
        loadingPrototype: false,
        loadedStructures: this.state.loadedStructures + STRUCTURES_PER_OFFSET,
        loadingMoreStructures: false,
      });
    });
  }

  unselectPrototype() {
    this.setState({
      showPrototype: false,
      loadedStructures: 0,
    });
    this.props.savePrototype('');
    this.props.saveRepoPrototypes([]);
    this.props.saveGroupedRepoPrototypes({});
  }

  submitSearch(loadMore = false) {
    this.setState({
      error: false,
      loading: true,
      showPrototype: false,
      loadedStructures: 0,
    });
    this.props.saveRepoPrototypes([]);
    this.props.saveGroupedRepoPrototypes({});
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
                className={this.props.classes.searchField}
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
                  {`${withCommas(this.props.searchResults.n_compounds)} structures (${this.props.searchResults.time.toFixed(2)} seconds)`}</div>
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

                {!_.isEmpty(this.props.searchResults) && (this.state.searchString).indexOf(' ') > -1 ? null :
                <Grid
                  container
                  justify="space-between"
                  direction="row"
                >
                  <Grid item className={this.props.classes.paper}>
                    <div className={this.props.classes.paper}>
                      <div>
                              Example searches:
                            </div>
                      <Typography>
                              stoichiometry:AB species:GaPd n_species:2 crystal_system:tetragonal repository:AMCSD,catalysis-hub spacegroup:120-150,23
                            </Typography>
                    </div>
                  </Grid>
                </Grid>
                  }
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
                  <FormLabel component="legend">Repositories (#structures)</FormLabel>
                  <FormGroup>
                    {this.props.searchResults.repositories
                          .map((repository, si) => (
                            <FormControlLabel
                              key={`sg_${si}`}
                              label={`${repository[0]} (${withCommas(repository[1])})`}
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
                  <FormLabel component="legend">Stoichiometry (#structures)</FormLabel>
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
                              label={`${stoichiometry[0]} (${withCommas(stoichiometry[1])})`}
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
                  <FormLabel component="legend">#Species (#structures)</FormLabel>
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
                              label={`${nSpecies[0]} (${withCommas(nSpecies[1])})`}
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
                  <FormLabel component="legend">#Atoms (#structures)</FormLabel>
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
                              label={`${nAtoms[0]} (${withCommas(nAtoms[1])})`}
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
                                label={`${cf(species[0])}  (${withCommas(species[1])})`}
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
                  <FormLabel component="legend">
                    <a href="https://en.wikipedia.org/wiki/List_of_space_groups" target="_blank">
                    Spacegroups [HM-Symbol] </a></FormLabel>
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
                              label={`${spacegroup[0]} [${hmSymbols[parseInt(spacegroup, 10) - 1].replace(/ /g, '')}] (${withCommas(spacegroup[1])})`}
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
                  {Object.keys(this.props.groupedRepoPrototypes).map((repository, ri) => (
                    <Paper
                      key={`repolist_${ri}`}
                      className={this.props.classes.paper}
                    >
                      <h4>{repository}</h4>
                      <ul>
                        {this.props.groupedRepoPrototypes[repository].map((ptype, pi) => (
                          <li key={`ptype_${pi}`}>
                            <ReactGA.OutboundLink
                              eventLabel="Goto Structure Source"
                              to={getGeometryUrl(ptype.repository, ptype.handle, ptype.tags)}
                              target="_blank"
                            >
                                    Source: {ptype.repository}:{ptype.handle}
                            </ReactGA.OutboundLink>
                            <Grid container direction="row" justify="space-between">
                              <Grid
                                item
                                className={this.props.classes.structureInfo}
                              >
                                <ul>
                                  <li>
                                    <CompositionBar
                                      width={160}
                                      height={10}
                                      composition={
                                              ptype.species.replace(/\[],'/g, '')}
                                    />
                                  </li>
                                  {Object.keys(ptype).map((entry, ei) => (
                                    <li key={`entry_${ei}`}>
                                      {entry}: {ptype[entry]}
                                    </li>
                                          ))}
                                </ul>
                              </Grid>
                              <Grid className={this.props.classes.preview}>
                                {typeof this.state.structures[pi] === 'undefined' ? null :
                                <GeometryCanvasWithOptions
                                  cifdata={this.state.structures[pi]}
                                  uniqueId="bulk_preview"
                                  id="bulk_preview"
                                  width={400}
                                  height={400}
                                  showButtons={false}
                                  x={2}
                                  y={2}
                                  z={2}
                                  ref={(gmCanvas) => { this.gmCanvas = gmCanvas; }}
                                />

                                        }
                                <div>

                                </div>
                              </Grid>
                            </Grid>
                            <Grid container direction="row" justify="flex-end">
                              <Grid item>
                                <Button
                                  raised
                                  onClick={() => this.getStructure(ptype, pi)}
                                >
                                          Preview Structure
                                        </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  raised
                                  onClick={() => this.handoffWyckoff(ptype)}
                                >
                                  <Link
                                    className={this.props.classes.buttonLink}
                                    to={'/bulkGenerator'}
                                  >
                                      Open in Wyckoff Bulk Generator <MdChevronRight />
                                  </Link>
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  raised
                                  onClick={() => this.handoffCatKit(
                                            ptype
                                          )}
                                >
                                  <Link
                                    className={this.props.classes.buttonLink}
                                    to={'/catKitDemo'}
                                  >
                                            Open in CatKit <MdChevronRight />
                                  </Link>
                                </Button>
                              </Grid>
                            </Grid>
                          </li>
                              ))}
                      </ul>
                    </Paper>
                        ))}
                  { (this.state.loadedStructures === 0 || this.state.loadedStructures >= this.state.prototypeStructures) ? null :
                  <Grid container direction="row" justify="space-around">
                    <Grid item>
                                Showing {this.state.loadedStructures}/{this.state.prototypeStructures}{'\u00A0\u00A0\u00A0'}
                      <Button
                        raised
                        onClick={() => {
                          this.selectPrototype(this.props.ptype, this.state.prototypeStructures);
                        }}
                      >
                                  Load More{'\u00A0\u00A0'} { (this.state.loadingMoreStructures) ? <CircularProgress /> : null}
                      </Button>
                    </Grid>
                  </Grid>
                        }
                </div>
                      :
                <div>

                  <div>
                    <h3 className={this.props.classes.subheader}>Prototypes ({withCommas(this.props.searchResults.n_prototypes)})</h3>
                    {this.props.searchResults.prototypes.map((ptype, pi) => (
                      <Paper key={`pcard_${pi}`} className={this.props.classes.pcard}>
                        <h4>Prototype {ptype[0]}</h4>
                        <Grid container direction="row" justify="space-between">
                          <Grid item>
                            <div>
                                    Structures: {withCommas(ptype[1])}
                            </div>
                            <div>
                                    Spacegroup: {parseInt(ptype[0].split(/_/g)[ptype[0].split(/_/g).length - 1], 10)}
                                    ; HM-Symbol: [{hmSymbols[parseInt(ptype[0].split(/_/g)[ptype[0].split(/_/g).length - 1], 10) - 1].replace(/ /g, '')}]
                                  </div>
                            <div>
                                    Stoichiometry: {ptype[0].split(/_/g)[0]}
                            </div>
                          </Grid>
                          <Grid item>
                            <Hidden xsDown>
                              <Button
                                raised
                                color="primary"
                                onClick={() => this.selectPrototype(ptype[0], ptype[1])}
                                className={this.props.classes.button}
                              >Details <MdChevronRight />
                              </Button>
                            </Hidden>
                            <Hidden smUp>
                              <Button
                                raised
                                color="primary"
                                onClick={() => this.selectPrototype(ptype[0], ptype[1])}
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
  repoPrototypes: PropTypes.array,
  groupedRepoPrototypes: PropTypes.object,

  saveSearchResults: PropTypes.func,
  addFacetFilter: PropTypes.func,
  removeFacetFilter: PropTypes.func,
  saveSearchLimit: PropTypes.func,
  saveSearchTerms: PropTypes.func,
  savePrototype: PropTypes.func,
  saveRepoPrototypes: PropTypes.func,
  saveGroupedRepoPrototypes: PropTypes.func,
  receiveBulkCif: PropTypes.func,
  saveBulkParams: PropTypes.func,
  dropBulkInput: PropTypes.func,
  catKitStepperHandleReset: PropTypes.func,

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
  groupedRepoPrototypes: state.get('prototypeSearch').groupedRepoPrototypes,
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
  saveGroupedRepoPrototypes: (x) => {
    dispatch(actions.saveGroupedRepoPrototypes(x));
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
  catKitStepperHandleReset: () => {
    dispatch(catKitActions.stepperHandleReset());
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
