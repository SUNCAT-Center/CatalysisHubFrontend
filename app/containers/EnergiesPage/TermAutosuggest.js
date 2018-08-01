import React from 'react';
import PropTypes from 'prop-types';

import cachios from 'cachios';
import { newGraphQLRoot } from 'utils/constants';

// Requirements for autoComplete
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { MdClear } from 'react-icons/lib/md';
import IconButton from 'material-ui/IconButton';

// const toProperCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

import * as actions from './actions';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    float: 'left',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  input: {
    padding: '10 20 10 20',
    float: 'left',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  suggestion: {
    display: 'block',
    zIndex: 10,
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    zIndex: 10,
  },
  textField: {
    width: '100%',
  },
});

export function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

export function getSuggestionValue(suggestion) {
  return suggestion.label;
}


export function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, helperText, label, onFocus, onKeyUp, ...other } = inputProps;
  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      helperText={helperText}
      label={label}
      onFocus={onFocus}
      onKeyUp={() => { onKeyUp(); }}
      onTouchEnd={() => { onKeyUp(); }}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

export function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => part.highlight ? (
          <span key={index} style={{ fontWeight: 300 }}>
            {part.text}
          </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          ))}
      </div>
    </MenuItem>
  );
}

class TermAutosuggest extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue,
      rawSuggestions: new Set(),
      suggestions: [],
      justFocused: false,
    };
    /* this.getSuggestions = this.getSuggestions.bind(this);*/
    this.onFocus = this.onFocus.bind(this);
    this.clearValue = this.clearValue.bind(this);
  }
  componentDidMount() {
    this.getRawSuggestions(false);
  }
  onFocus = () => {
    this.setState({
      justFocused: true,
    });
    this.getRawSuggestions();
  }
  onBlur = () => {
    this.setState({
      justFocused: true,
    });
    this.getRawSuggestions();
  }
  getRawSuggestions() {
    let query;
    let responseField;
    let parseField;

    let reactants = (_.get(this.props.filter, 'reactants', '~') || '~').replace(/\*/g, 'star').replace(/[ ]/g, '');
    if (this.props.field === 'reactants') {
      reactants = 'reactants: "~", ';
    } else if (reactants !== '~') {
      reactants = `reactants: "${reactants}", `;
    } else {
      reactants = '';
    }

    let products = (_.get(this.props.filter, 'products', '~') || '~').replace(/\*/g, 'star').replace(/[ ]/g, '');
    if (this.props.field === 'products') {
      products = 'products: "~", ';
    } else if (products !== '~') {
      products = `products: "${products}", `;
    } else {
      products = '';
    }

    let surfaceComposition = (_.get(this.props.filter, 'surfaceComposition', '~') || '~').replace(/\*/g, 'star');
    if (this.props.field === 'surfaceComposition') {
      surfaceComposition = 'surfaceComposition: "~", ';
    } else if (surfaceComposition !== '~') {
      surfaceComposition = `surfaceComposition: "${surfaceComposition}", `;
    } else {
      surfaceComposition = '';
    }

    let facet = (_.get(this.props.filter, 'facet', '~') || '~').replace(/\*/g, 'star').replace(/[ ]/g, '');
    if (this.props.field === 'facet') {
      facet = 'facet: "~", ';
    } else if (facet !== '~') {
      facet = `facet: "${facet}", `;
    } else {
      facet = '';
    }

    if (this.props.field === 'reactants') {
      query = `{reactions(${reactants}${products}${surfaceComposition}${facet}distinct: true) { edges { node { ${this.props.field} } } }}`;
      responseField = 'reactants';
      parseField = true;
    } else if (this.props.field === 'products') {
      query = `{reactions(${reactants}${products}${surfaceComposition}${facet}distinct: true) { edges { node { products } } }}`;
      responseField = 'products';
      parseField = true;
    } else if (this.props.field === 'surfaceComposition') {
      query = `{reactions(${reactants}${products}${surfaceComposition}${facet}distinct: true) { edges { node { surfaceComposition } } }}`;
      responseField = 'surfaceComposition';
      parseField = false;
    } else if (this.props.field === 'facet') {
      query = `{reactions(${reactants}${products}${surfaceComposition}${facet}distinct: true) { edges { node { facet } } }}`;
      responseField = 'facet';
      parseField = false;
    }

    let label = '';
    cachios.post(newGraphQLRoot, {
      query,
      ttl: 300,
    }).then((response) => {
      const suggestions = new Map();
      response.data.data.reactions.edges.map((edge) => {
        // suggestions.push({label: edge.node.reactants});
        if (parseField) {
          label = (Object.keys(JSON.parse(edge.node[responseField]))).join(' + ').replace(/star/g, '*');
        } else {
          label = edge.node[responseField];
        }

        return suggestions.set(label, { label });
      });

      this.setState({
        rawSuggestions: [...suggestions.values()],
      });
    });
  }
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === -1
      ? []
      : [...this.state.rawSuggestions].filter((suggestion) => {
        /* const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;*/
        const iv = inputValue.replace('*', '\\*').replace('-', '\\-').replace('(', '\\(').replace(')', '\\)');
        const keep = count < 10 && suggestion.label.toLowerCase().match(iv);

        if (keep) {
          count += 1;
        }

        return keep;
      });
  }
  clearValue() {
    this.setState({
      value: '',
    });
    this.props.setSubstate(this.props.field, { label: '' });
    this.props.updateFilter(this.props.field, '');
    setTimeout(() => {
      this.props.keyUp();
    }, 500);
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      justFocused: false,
    });
    this.props.setSubstate(this.props.field, { label: newValue, value: newValue });
    const update = {};
    update[event] = newValue;
    this.props.updateFilter(this.props.field, newValue);
  };

  render() {
    const { classes } = this.props;
    const state = this.state;

    return (
      <div className={classes.container}>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={renderInput}
          suggestions={state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          shouldRenderSuggestions={(val) => val.length > 0 || !this.state.justFocused}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            autoFocus: this.props.autofocus,
            onFocus: this.onFocus,
            classes,
            placeholder: (this.props.placeholder),
            value: this.state.value,
            helperText: this.props.helperText,
            label: this.props.label,
            onChange: this.handleChange,
            onKeyUp: this.props.keyUp,
            onKeyDown: ((event) => {
              if (event.nativeEvent.keyCode === 13) {
                this.props.submitForm();
              }
            }),
          }}
        />
        {this.state.value === '' ? null :
        <IconButton
          onClick={() => { this.clearValue(); }}
          style={{
            marginLeft: '-35px',
            marginTop: '-10px',
          }}
        >
          <MdClear />
        </IconButton>
      }
      </div>
    );
  }
}

TermAutosuggest.propTypes = {
  field: PropTypes.oneOf([
    'reactants',
    'products',
    'surfaceComposition',
    'facet',
  ]),
  setSubstate: PropTypes.func,
  submitForm: PropTypes.func,
  updateFilter: PropTypes.func,
  keyUp: PropTypes.func,
  classes: PropTypes.object,
  autofocus: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  filter: PropTypes.object,
  initialValue: PropTypes.string,
};

TermAutosuggest.defaultProps = {
  autofocus: false,
  helperText: '',
  label: '',
  placeholder: '',
  initialValue: '',
  filter: {},
};

const mapStateToProps = (state) => ({
  filter: state.get('energiesPageReducer').filter,
});

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (field, value) => {
    dispatch(actions.updateFilter(field, value));
  },
});

export default withStyles(styles)(
connect(mapStateToProps, mapDispatchToProps)(TermAutosuggest)
);
