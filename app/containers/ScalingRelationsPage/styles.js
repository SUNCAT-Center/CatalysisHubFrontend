
export const styles = (theme) => ({
  mainPaper: {
    minHeight: 200,
    padding: 15,
  },
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
  progressBar: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  paper: {
    padding: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  flipButton: {
    height: '100%',
  },
  tab: {
    textTransform: 'none',
  },
  itemText: {
    width: 10,
  },
  progress: {
    marginTop: 2 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
  },
});


