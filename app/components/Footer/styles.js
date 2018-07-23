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
    backgroundColor: xtheme.palette.coolgrey[500],
    paddingLeft: '5%',
    paddingRight: '5%',
    [xtheme.breakpoints.down('sm')]: {
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
  banner: {
    [xtheme.breakpoints.up('xl')]: {
      marginLeft: 220,
    },
  },
});

