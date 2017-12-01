import React, { PropTypes } from 'react';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

// Requirements for autoComplete
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { MdClear } from 'react-icons/lib/md';
import IconButton from 'material-ui/IconButton';

const toProperCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

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
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
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
      value: '',
      rawSuggestions: new Set(),
      suggestions: [],
    };
    /* this.getSuggestions = this.getSuggestions.bind(this);*/
  }
  componentDidMount() {
    let query;
    let responseField;
    let parseField;
    if (this.props.field === 'reactants') {
      query = '{catapp(reactants: "~", distinct: true) { edges { node { reactants } } }}';
      responseField = 'reactants';
      parseField = true;
    } else if (this.props.field === 'products') {
      query = '{catapp(products: "~", distinct: true) { edges { node { products } } }}';
      responseField = 'products';
      parseField = true;
    } else if (this.props.field === 'surface') {
      query = '{catapp(surfaceComposition: "~", distinct: true) { edges { node { surfaceComposition } } }}';
      responseField = 'surfaceComposition';
      parseField = false;
    } else if (this.props.field === 'facet') {
      query = '{catapp(facet: "~", distinct: true) { edges { node { facet } } }}';
      responseField = 'facet';
      parseField = false;
    }

    let label = '';
    axios.post(graphQLRoot, {
      query,
    }).then((response) => {
      const suggestions = new Map();
      response.data.data.catapp.edges.map((edge) => {
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

    return inputLength === 0
      ? []
      : [...this.state.rawSuggestions].filter((suggestion) => {
        /* const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;*/
        const iv = inputValue.replace('*', '\\*').replace('-', '\\-').replace('(', '\\(').replace(')', '\\)');
        const keep = count < 5 && suggestion.label.toLowerCase().match(iv);

        if (keep) {
          count += 1;
        }

        return keep;
      });
  }
  clearValue = () => {
    this.setState({
      value: '',
    });
    this.props.setSubstate(this.props.field, { label: '' });
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
    });
    this.props.setSubstate(this.props.field, { label: newValue });
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
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            autoFocus: this.props.autofocus,
            classes,
            placeholder: toProperCase(this.props.field),
            value: this.state.value,
            onChange: this.handleChange,
            onKeyDown: ((event) => {
              if (event.nativeEvent.keyCode === 13) {
                this.props.submitForm();
              }
            }),
          }}
        />
        {this.state.value === '' ? null :
        <IconButton
          style={{
            marginLeft: '-35px',
            marginTop: '-10px',
          }}
        >
          <MdClear
            onClick={this.clearValue}
          />
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
    'surface',
    'facet',
  ]),
  setSubstate: PropTypes.func,
  submitForm: PropTypes.func,
  classes: PropTypes.object,
  autofocus: PropTypes.bool,
};

TermAutosuggest.defaultProps = {
  autofocus: false,
};


export default withStyles(styles)(TermAutosuggest);
