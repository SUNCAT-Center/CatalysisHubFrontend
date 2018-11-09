import _ from 'lodash';
export const styles = (theme) => ({
  filterInput: {
    margin: theme.spacing.unit * 2,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
    zIndex: 1000,
  },
  shareButtons: {
    paddingRight: 2 * theme.spacing.unit,
  },
  publicationAction: {
    margin: theme.spacing.unit,
    height: 6,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
    textDecoration: 'none',
  },
  publicationOffAction: {
    margin: theme.spacing.unit,
    height: 6,
    backgroundColor: _.get(theme, 'palette.sun.100'),
    textDecoration: 'none',
  },

  outboundLink: {
    textDecoration: 'none',
  },
  publicationEntry: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  publicationYear: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  yearPaper: {
    marginBottom: theme.spacing.unit * 7,
  },
  paper: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  smallPaper: {
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    paddingBottom: 0,
  },
  publicationActions: {
    marginTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  table: {
    minWidth: 700,
  },
});
