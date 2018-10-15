export const styles = (theme) => ({
  structureInfo: {
    maxWidth: '50%',
  },
  preview: {
    paddingRight: theme.spacing.unit,
  },
  outboundLink: {
    textDecoration: 'none',
  },
  infoText: {
    margin: theme.spacing.unit * 3,
  },
  hintText: {
    margin: theme.spacing.unit * 3,
    textColor: '#BBBBBB',
  },
  hintBlock: {
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  searchField: {
    width: '98%',
    margin: theme.spacing.unit,
  },
  textField: {
    width: '100%',
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  buttonLink: {
    textDecoration: 'none',
    textColor: 'black',

  },
  subheader: {
    margin: theme.spacing.unit,
  },
  facetPanel: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  pcard: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  errorPaper: {
    marginTop: 3 * theme.spacing.unit,
    marginBottom: 3 * theme.spacing.unit,
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.cardinalred[100],
  },
  outerPaper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  progress: {
    marginBottom: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit,
  },
});
