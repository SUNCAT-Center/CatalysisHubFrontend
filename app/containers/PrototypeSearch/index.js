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
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
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

const initialState = {
  loading: false,
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

  handoffWyckoff() {
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
      loading: true,
      showPrototype: false,
    });
    if (!loadMore) {
      this.props.saveSearchResults({});
    }
    this.props.savePrototype('');
    const params = { params: {
      search_terms: this.state.searchString,
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
    });
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
        <Paper>
          <Grid container direction="column" justify="space-between">
            <Grid item>
              <Grid container direction="row" justify="flex-end">
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <FormGroup row>
                    <TextField
                      autoFocus
                      onChange={this.handleChange('searchString')}
                      label="Search ..."
                      placeholder="species:Ag n_species:2-5 repository:AMCSD,catalysis-hub"
                      className={this.props.classes.textField}
                      onKeyDown={((event) => {
                        if (event.nativeEvent.keyCode === 13) {
                          this.submitSearch();
                        }
                      })}
                    />
                    <Button
                      className={this.props.classes.button}
                      onClick={() => this.handleShowInfo()}
                    >
                      {this.state.showInfo ? 'Hide Info' : 'Info' }
                    </Button>
                    {_.isEmpty(this.props.searchResults) ? null :
                    <div
                      className={this.props.classes.hintText}
                    >
                      {`${this.props.searchResults.time.toFixed(2)} s, ${this.props.searchResults.n_compounds} structures.`}</div>
                }

                    <Grid container justify="space-between" direction="row">
                      {!_.isEmpty(this.props.searchResults) ? null :
                      <Grid item className={this.props.classes.paper}>
                        <div>
                          <div>
                            Example searches:
                          </div>
                          <div>
                            stoichiometry:AB species:GaPd crystal_system:tetragonal repository:AMCSD,catalysis-hub spacegroup:120-150,23
                          </div>
                        </div>
                      </Grid>
                  }
                      <Grid item>
                        <Button raised onClick={this.submitSearch} color="primary" className={this.props.classes.button}><MdSearch /> Search </Button>
                      </Grid>
                      <Grid item>
                        <Grid container direction="row" justify="flex-start">
                          <Grid item>
                            {this.props.facetFilters.map((facetFilter, i) => (
                              <Chip
                                key={`chip_${i}`}
                                label={`${facetFilter}`}
                                className={this.props.classes.button}
                                onDelete={() => { this.props.removeFacetFilter(facetFilter); }}
                              />
                        ))

                        }
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {this.state == null || this.state.loading ? <LinearProgress className={this.props.classes.progress} /> : null }
        <Grid container direction="row" justify="space-between">
          <Grid item xs={3}>
            {_.isEmpty(this.props.searchResults.repositories) ? null :
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
            }
            {_.isEmpty(this.props.searchResults.stoichiometries) ? null :
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
            }


            {_.isEmpty(this.props.searchResults.n_species) ? null :
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
            }



            {_.isEmpty(this.props.searchResults.n_atoms) ? null :
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
            }




            {_.isEmpty(this.props.searchResults.species) ? null :
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
            }



            {_.isEmpty(this.props.searchResults.spacegroups) ? null :
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
                <FormLabel component="legend">Spacegroups</FormLabel>
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
                            label={`${spacegroup[0]} (${spacegroup[1]})`}
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
            }
          </Grid>
          <Grid item xs={9}>
            {_.isEmpty(this.props.searchResults.prototypes) ? null :
            <Paper>
              {this.state.loadingPrototype ? <LinearProgress /> : null}
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
                                  onClick={() => this.handoffWyckoff(ptype.prototype, ptype.spacegroup)}
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

                        <div>
                              Structures: {ptype[1]}
                        </div>
                        <Grid container direction="row" justify="flex-end">
                          <Grid item>
                            <Button
                              raised
                              color="primary"
                              onClick={() => this.selectPrototype(ptype[0])}
                              className={this.props.classes.button}
                            >Details <MdChevronRight />
                            </Button>
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
  repoPrototypes: PropTypes.object,

  saveSearchResults: PropTypes.func,
  addFacetFilter: PropTypes.func,
  removeFacetFilter: PropTypes.func,
  saveSearchLimit: PropTypes.func,
  savePrototype: PropTypes.func,
  saveRepoPrototypes: PropTypes.func,
  receiveBulkCif: PropTypes.func,
  saveBulkParams: PropTypes.func,
  dropBulkInput: PropTypes.func,
  cookies: instanceOf(Cookies),
};

const mapStateToProps = (state) => ({
  searchTerms: state.get('prototypeSearch').searchTerms,
  searchResults: state.get('prototypeSearch').searchResults,
  searchLimit: state.get('prototypeSearch').searchLimit,
  facetFilters: state.get('prototypeSearch').facetFilters,
  ptype: state.get('prototypeSearch').ptype,
  repoPrototypes: state.get('prototypeSearch').repoPrototypes,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withCookies(
    withStyles(styles, { withTheme: true })(
      PrototypeSearch
    ))
);
