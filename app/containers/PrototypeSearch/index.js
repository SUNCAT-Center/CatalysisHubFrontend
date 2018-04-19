/*
 *
 * PrototypeSearch
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import cachios from 'cachios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { CircularProgress, LinearProgress } from 'material-ui/Progress';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';

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

import Header from './header';
import { styles } from './styles';
import * as actions from './actions';

const url = 'http://localhost:5002/facet_search/';
const ptypeUrl = 'http://localhost:5002/prototype/';
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
  showPrototype: false,
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
    this.handleChange = this.handleChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.setState(initialState);
    this.selectPrototype = this.selectPrototype.bind(this);
    this.unselectPrototype = this.unselectPrototype.bind(this);
    this.setState(initialState);
  }

  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
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
      ttl: 300 };
    cachios.get(ptypeUrl, params).then((response) => {
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
      this.props.saveSearchResults([]);
    }
    this.props.savePrototype('');
    const params = { params: {
      search_terms: this.state.searchString,
      facet_filters: JSON.stringify(this.props.facetFilters),
      limit: this.props.searchLimit,
    },
      ttl: 300,
    };
    cachios.get(url, params).then((response) => {
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
        <Header />
        <Paper>
          <FormGroup row>
            <TextField
              autoFocus
              onChange={this.handleChange('searchString')}
              label="Search ..."
              placeholder="Pt Ag 216066-60346-342969-Eu3N:NEu3.vasp 160"
              className={this.props.classes.textField}
              onKeyDown={((event) => {
                if (event.nativeEvent.keyCode === 13) {
                  this.submitSearch();
                }
              })}
            />

            <Grid container justify="space-between" direction="row">
              <Grid item>
                {_.isEmpty(this.props.searchResults) ? null :
                <div
                  className={this.props.classes.hintText}
                >
                  {`${this.props.searchResults.time.toFixed(2)} s`}</div>
              }
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
              <Grid item>
                <Button raised onClick={this.submitSearch} color="primary" className={this.props.classes.button}><MdSearch /> Search </Button>
              </Grid>
            </Grid>
          </FormGroup>
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
              <Grid container directon="row" justify="space-between">
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
                            {ptype.repository}:{ptype.filename}
                            <ul>
                              {Object.keys(ptype).map((entry, ei) => (
                                <li key={`entry_${ei}`}>
                                  {entry}: {ptype[entry]}
                                </li>
                                ))}
                            </ul>
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
                        {this.state.loadingPrototype ? <LinearProgress /> : null}

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
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PrototypeSearch));
