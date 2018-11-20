export const styles = (xtheme) => ({
  footerLink: {
    textColor: 'white',
    color: 'white',
    textDecoration: 'none',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: xtheme.palette.chocolate[500],
    paddingLeft: '5%',
    paddingRight: '5%',
    [xtheme.breakpoints.down('xs')]: {
      visibility: 'hidden',
    },
  },
  footerList: {
    display: 'flex',
    flexDirection: 'row',
  },
  footerListItem: {
    whiteSpace: 'nowrap',
  },
  footerListItemText: {
    whiteSpace: 'nowrap',
    [xtheme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  banner: {
    [xtheme.breakpoints.up('xl')]: {
      marginLeft: 220,
    },
  },
  logo: {
    width: '20px',
  },
});

