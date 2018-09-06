export const styles = (theme) => ({
  AppWrapper: {
    maxWidth: 'calc(1200px + 16px * 2)',
    margin: '20 auto',
    marginTop: '40px',
    display: 'flex',
    minHeight: '100%',
    padding: '0 0px',
    flexDirection: 'column',
    textDecoration: 'none',
    position: 'block',
  },
  appHint: {
    fontSize: 12,
    textAlign: 'left',
  },
  appsPaper: {
    padding: 10,
    paddingTop: 5,
    marginBottom: theme.spacing.unit * 2,
    textAlign: 'left',
    cornerRadius: 40,
  },
  appPaper: {
    padding: 10,
    paddingTop: 5,
    minWidth: 280,
    maxWidth: 300,
    textAlign: 'left',
    backgroundColor: '#eeeeee',
    cornerRadius: 40,
    '&:hover': {
      backgroundColor: theme.palette.sandhill[300],
    },
  },

  browsePaper: {
    backgroundColor: theme.palette.sky[100],
    '&:hover': {
      backgroundColor: theme.palette.sky[50],
    },
  },
  analyzePaper: {
    backgroundColor: theme.palette.cardinalred[100],
    '&:hover': {
      backgroundColor: theme.palette.cardinalred[50],
    },
  },
  createPaper: {
    backgroundColor: theme.palette.poppy[100],
    '&:hover': {
      backgroundColor: theme.palette.poppy[50],
    },
  },
  contributePaper: {
    backgroundColor: theme.palette.mint[100],
    '&:hover': {
      backgroundColor: theme.palette.mint[50],
    },
  },

  browse: {
    backgroundColor: theme.palette.sky[400],
  },
  analyze: {
    backgroundColor: theme.palette.cardinalred[400],
  },
  create: {
    backgroundColor: theme.palette.poppy[400],
  },
  contribute: {
    backgroundColor: theme.palette.mint[400],
  },
});
