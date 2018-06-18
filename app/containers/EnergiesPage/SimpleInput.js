import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Scroll from 'react-scroll';

import { MdChevronRight, MdSearch, MdWarning } from 'react-icons/lib/md';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { FormGroup } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';

import * as actions from './actions';


const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textTransform: 'none',
  },
  textField: {
    width: '80%',
  },
  progressBar: {
    margin: theme.spacing.unit,
  },
});

const initialState = {
  searchString: '',
  loading: false,
};


class EnergiesPageSimpleInput extends React.Component { // eslint-disable-line react/prefer-stateless-function}
  constructor(props) {
    super(props);
    this.state = initialState;
    this.submitForm = this.submitForm.bind(this);
    this.props.clearSystems();
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }


  submitForm() {
    this.setState({
      loading: true,
    });
    this.props.clearSystems();
    this.props.receiveReactions([]);

    const filterString = `textsearch: "${this.state.searchString}", `;
    const query = {
      query: `query{reactions ( first: 10, ${filterString} ) { totalCount edges { node { id dftCode dftFunctional reactants products facet chemicalComposition reactionEnergy activationEnergy surfaceComposition reactionSystems { name aseId systems { id calculatorParameters }} } } }}`,
      ttl: 300,
    };

    cachios.post(newGraphQLRoot, query).then((response) => {
      this.props.receiveReactions(response.data.data.reactions.edges);
      this.props.saveSearchString(this.state.searchString);
      this.props.saveSearchQuery(query.query);
      this.props.saveResultSize(response.data.data.reactions.totalCount);
      Scroll.animateScroll.scrollMore(500);
      this.setState({
        loading: false,
      });
    }).catch(() => {
      this.props.setDbError();
      this.setState({
        loading: false,
      });
    });
  }
  render() {
    return (


      <Paper className={this.props.classes.paper}>
        <Grid container justify="flex-end" direction="row">
          <Grid item>
            <Tooltip title="Detailed input of reactants, products, surface, facet.">
              <Button
                onClick={this.props.toggleSimpleSearch}
                className={this.props.classes.button}
              > Detail Search <MdChevronRight /></Button>
            </Tooltip>
          </Grid>
        </Grid>
        {this.props.dbError ? <div><MdWarning />Failed to contact database. </div> : null }
        <h2>Surface Reactions</h2>
        <FormGroup row>
          <TextField
            autoFocus
            onChange={this.handleChange('searchString')}
            label="Free Text Search"
            placeholder="oxygen evolution bajdich 2017 OOH"
            className={this.props.classes.textField}
            onKeyDown={((event) => {
              if (event.nativeEvent.keyCode === 13) {
                this.submitForm();
              }
            })}
          />

          <Grid container justify="flex-end" direction="row">
            <Grid item>
              <Button raised onClick={this.submitForm} color="primary" className={this.props.classes.button}><MdSearch /> Search </Button>
            </Grid>
          </Grid>
        </FormGroup>

        {this.state.loading ? <LinearProgress color="primary" className={this.props.classes.progressBar} /> : null }
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  simpleSearch: state.get('energiesPageReducer').simpleSearch,
  dbError: state.get('energiesPageReducer').dbError,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSimpleSearch: () => {
    dispatch(actions.toggleSimpleSearch());
    dispatch(actions.clearSystems());
  },
  receiveReactions: (reactions) => {
    dispatch(actions.receiveReactions(reactions));
  },
  clearSystems: () => {
    dispatch(actions.clearSystems());
  },
  setDbError: () => {
    dispatch(actions.setDbError());
  },
  saveResultSize: (resultSize) => {
    dispatch(actions.saveResultSize(resultSize));
  },
  saveSearchString: (searchString) => {
    dispatch(actions.saveSearchString(searchString));
  },
  saveSearchQuery: (searchQuery) => {
    dispatch(actions.saveSearchQuery(searchQuery));
  },
});

EnergiesPageSimpleInput.propTypes = {
  classes: PropTypes.object,
  dbError: PropTypes.bool,
  setDbError: PropTypes.func,
  toggleSimpleSearch: PropTypes.func,
  clearSystems: PropTypes.func.isRequired,
  saveResultSize: PropTypes.func,
  saveSearchString: PropTypes.func,
  receiveReactions: PropTypes.func.isRequired,
  saveSearchQuery: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(EnergiesPageSimpleInput)
);
