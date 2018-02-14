import React, { PropTypes } from 'react';

// Requirements for autoComplete
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';


import * as actions from './actions';

export const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'];

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
    width: 40,
    paddingBottom: 5,
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
  const { classes, autoFocus, value, helperText, label, onFocus, ...other } = inputProps;
  return (
    <TextField
      autoFocus={autoFocus}
      error={elements.indexOf(value) === -1}
      className={classes.textField}
      onChange={(event) => this.update(event.target.value)}
      value={value}
      helperText={elements.indexOf(value) > -1 ? null : helperText}
      label={label}
      onFocus={onFocus}
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

class ElementAutosuggest extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
  }
  componentDidMount() {
    this.getRawSuggestions(false);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.initialValue,

    });
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
    this.setState({
      rawSuggestions: elements.map((element) => ({ value: element, label: element })),
    });
  }
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === -1
      ? []
      : [...this.state.rawSuggestions].filter((suggestion) => {
        const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;
        /* const iv = inputValue.replace('*', '\\*').replace('-', '\\-').replace('(', '\\(').replace(')', '\\)');*/
        /* const keep = count < 10 && suggestion.label.toLowerCase().match(iv);*/

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
    this.props.updateFilter(this.props.field, '');
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

  update(value) {
    this.setState({
      value,
    });
  }

  render() {
    const { classes } = this.props;
    const state = this.state;

    return (
      <Autosuggest
        className={classes.container}
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
        }}
      />
    );
  }
}

ElementAutosuggest.propTypes = {
  field: PropTypes.string,
  setSubstate: PropTypes.func,
  updateFilter: PropTypes.func,
  classes: PropTypes.object,
  autofocus: PropTypes.bool,
  helperText: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
};

ElementAutosuggest.defaultProps = {
  autofocus: false,
  helperText: '',
  label: '',
  placeholder: '',
  initialValue: '',
  filter: {},
};

const mapStateToProps = (state) => ({
  filter: state.get('energiesPageReducer').filter,
  withGeometry: state.get('energiesPageReducer').withGeometry,
});

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (field, value) => {
    dispatch(actions.updateFilter(field, value));
  },
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ElementAutosuggest)
);

