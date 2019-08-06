export const styles = (theme) => ({
  bannerStyle: {
    width: '240px',
    height: '150px',
  },
  paragraph: {
    marginBottom: 2 * theme.spacing.unit,
  },
  peopleList: {
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  paper: {
    textAlign: 'justify',
    marginBottom: 3 * theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginLeft: '10%',
    marginRight: '10%',
    padding: theme.spacing.unit * 3,
  },
  text: {
    marginBottom: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit,
  },
  publication: {
    marginLeft: '5%',
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
});
