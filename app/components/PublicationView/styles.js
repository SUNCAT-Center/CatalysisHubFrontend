import _ from 'lodash';
export const styles = (theme) => ({
  structureBar: {
    padding: theme.spacing.unit,
  },
  table: {
    margin: theme.spacing.unit,
  },
  important: {
    textColor: 'red',
    color: 'red',
  },
  reactionActions: {
    padding: theme.spacing.unit,
  },
  progress: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  publicationAction: {
    margin: theme.spacing.unit,
    height: 0,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
  },
  outboundLink: {
    textDecoration: 'none',
  },
  paper: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  reactionsDiv: {
    overflowY: 'scroll',
    height: '70vh',
    marginTop: theme.spacing.unit * 2,

  },
  structuresDiv: {
    overflowY: 'scroll',
    height: '70vh',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: theme.spacing.unit * 2,
  },
  reaction: {
  },
  headerDiv: {
    padding: theme.spacing.unit,
  },
  selectedReaction: {
    backgroundColor: '#cccccc',
  },
});

