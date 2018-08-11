import _ from 'lodash';
export const styles = (theme) => ({
  filterInput: {
    margin: theme.spacing.unit * 2,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  buttonLink: {
    textDecoration: 'none',
  },
  outboundLink: {
    textDecoration: 'none',
  },
  smallPaper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
  publicationActions: {
    marginTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  authorEntry: {
    marginLeft: theme.spacing.unit * 3,
  },
  authorList: {
    display: 'flex',
    height: '500px',
    flexWrap: 'wrap',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    zIndex: 1000,
  },
  publicationAction: {
    margin: theme.spacing.unit,
    textDecoration: 'none',
    height: 0,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
  },
});
