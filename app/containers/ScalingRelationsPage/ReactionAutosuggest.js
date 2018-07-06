
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { MdClear } from 'react-icons/lib/md';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

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
    width: 200,
    marginLeft: 10,
    marginRight: 10,
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
  return suggestion.node.Equation;
}


export function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, helperText, label, onFocus, ...other } = inputProps;
  return (
    <TextField
      fullWidth
      style={{
        width: 350,
        marginTop: 10,
        marginBottom: 10,
      }}
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      helperText={helperText}
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
  const matches = match(suggestion.node.Equation, query);
  const parts = parse(suggestion.node.Equation, matches);

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



class ReactionAutosuggest extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue,
      suggestions: [],
    };
    this.getSuggestions = this.getSuggestions.bind(this);
    /* this.handleChange = this.handleChange.bind(this);*/
  }

  getSuggestions(value) {
    let count = 0;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : [...this.props.reactionsSuggestions].filter((reaction) => {
      const iv = inputValue.replace('*', '\\*').replace('-', '\\-').replace('(', '\\(').replace(')', '\\)');
      const keep = count < 200 && reaction.node.Equation.toLowerCase().match(iv);
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
      justFocused: false,
    });
    this.props.setSubstate(this.props.field,
      { label: newValue,
        value: newValue,
        reaction: this.state.suggestions.filter((elem) => elem.node.Equation === newValue),
      });
    const update = {};
    update[event] = newValue;
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

ReactionAutosuggest.propTypes = ({
  initialValue: PropTypes.string.isRequired,
  reactionsSuggestions: PropTypes.array.isRequired,
  setSubstate: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  autofocus: PropTypes.bool,
  classes: PropTypes.object,
});

ReactionAutosuggest.defaultProps = {
  initialValue: '',
  reactionsSuggestions: [],
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({

});

export default withStyles(styles)(
connect(mapStateToProps, mapDispatchToProps)(ReactionAutosuggest)
);
