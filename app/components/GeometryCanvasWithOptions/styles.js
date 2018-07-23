export const styles = (theme) => ({
  avatar: {
    fontColor: '#000000',
    fontSize: 18,
    backgroundColor: '#ffffff',
    marginLeft: -14,
    marginRight: -14,
    marginTop: -5,
    textTranformation: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  fsIconButton: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    marginTop: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      height: 15,
      width: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      height: 10,
      width: 10,
    },
  },
  iconButton: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      height: 15,
      width: 15,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      height: 10,
      width: 10,
    },
  },
  iconButtonIcon: {
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    marginTop: 7,
  },
});
