import { appBar } from 'utils/constants';

const drawerWidth = 240;

export const styles = (xtheme) => ({
  toolbar: {
    padding: '0 3.1em 0 0',
  },
  boldFooter: {
    fontWeight: 500,
  },
  lightFooter: {
    margin: 0,
    fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    fontWeight: 200,
  },
  appBarGridItem: {
    /* border: '1px solid black',*/
    /* leave here for debugging layout*/
  },
  mainContainer: {
    minHeight: '100vh',
    overflow: 'hidden',
    display: 'block',
    position: 'relative',
    paddingBottom: 200,
  },
  backLink: {
    color: 'white',
    marginLeft: -xtheme.spacing.unit * 3,
  },
  textLink: {
    color: 'white',
    textDecoration: 'none',
  },
  activeAppBarLink: {
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: 'white',
  },
  appBarTitle: {
    marginTop: 13,
    marginLeft: 0,
    [xtheme.breakpoints.down('sm')]: {
      marginLeft: -20,
    },
    color: 'white',
    decoration: 'none',
    textDecoration: 'none',
    textDecorationStyle: 'none',
  },
  root: {
    width: '100%',
    marginTop: xtheme.spacing.unit * 3,
    zIndex: 1,
  },
  subListHeader: {
    marginTop: 10,
    marginBottom: 20,
    height: 25,
    padding: 5,
  },
  menuItem: {
    padding: 5,
  },
  inactiveTopMenuLink: {
    cursor: 'pointer',
    color: '#cccccc',
    fontSize: 15,
    fontWeight: 'bolder',
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  topMenuLink: {
    cursor: 'pointer',
    color: xtheme.palette.cardinalred[900],
    fontSize: 15,
    fontWeight: 'bolder',
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    '&:hover': {
      backgroundColor: xtheme.palette.cardinalred[100],
    },
  },
  menuLink: {
    cursor: 'pointer',
    color: xtheme.palette.cardinalred[900],
    fontSize: 15,
    marginLeft: xtheme.spacing.unit * 4,
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    height: 25,
    '&:hover': {
      backgroundColor: xtheme.palette.cardinalred[100],
    },
  },
  inactiveLink: {
    cursor: 'pointer',
    color: '#cccccc',
    fontSize: 15,
    marginLeft: xtheme.spacing.unit * 4,
    textDecoration: 'none',
    textTransform: 'none',
    width: '100%',
    height: 25,
  },
  menuButton: {
    textDecoration: 'none',
    textTransform: 'none',
  },
  divider: {
    marginTop: xtheme.spacing.unit * 3,
    marginBottom: xtheme.spacing.unit * 0,
  },
  footer: {
    [xtheme.breakpoints.down('lg')]: {
      visibility: 'hidden',
    },
  },
  barIcon: {
    [xtheme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  barText: {
    marginTop: 10,
    textDecoration: 'none',
    decoration: 'none',
    [xtheme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  helmet: {
    [xtheme.breakpoints.down('sm')]: {
      marginBottom: '-20px',
    },
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  drawerHeader: xtheme.mixins.toolbar,
  navIconHide: {
    [xtheme.breakpoints.up('xl')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [xtheme.breakpoints.up('xl')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  appBar: {
    [xtheme.breakpoints.up('xl')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  mainPaper: {
    margin: 0,
    marginTop: (appBar ? '20px' : '20px'),
    padding: '40px',
    [xtheme.breakpoints.down('md')]: {
      padding: '10px',
      paddingBottom: '40px',
    },
    [xtheme.breakpoints.down('sm')]: {
      padding: '2px',
      paddingBottom: '40px',
    },
  },
  content: {
    backgroundColor: xtheme.palette.background.default,
    width: '100%',
    padding: xtheme.spacing.unit * 0,
    paddingTop: xtheme.spacing.unit * 1,
    height: 'calc(100% - 56px)',
    marginTop: (appBar ? 80 : 0),
    [xtheme.breakpoints.up('lg')]: {
      height: 'calc(100% - 64px)',
      marginTop: 80,
    },
  },
});
