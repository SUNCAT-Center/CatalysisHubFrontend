import _ from 'lodash';

export const styles = (theme) => ({
  bold: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  'centerGrid Grid': {
    marginBottom: 60,
  },
  buttonLink: {
    textTransformation: 'none',
    textDecoration: 'none',
    fontColor: 'white',
    color: 'white',
    fontWeight: 'bold',

  },
  welcomeHeader: {
    marginTop: 0,
    marginBottom: '5%',
  },
  centeredSection: {
    marginLeft: '10%',
    marginRight: '10%',
  },
  truncated: {
    marginRight: '10%',
    textAlign: 'justify',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxHeight: '120px',
  },
  expanded: {
    marginRight: '10%',
    textAlign: 'justify',
  },
  textLink: {
    textDecoration: 'none',
    textColor: 'black',
    color: 'black',
  },
  banner: {
    marginTop: 50,
    width: '100%',
  },
  welcome: {
    marginRight: '10%',
    textAlign: 'left',
  },
  publicationPaper: {
    backgroundColor: '#eeeeee',
    cornerRadius: 40,
    padding: 10,
    paddingTop: 5,
    textAlign: 'left',
    align: 'left',
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  homePaper: {
    backgroundColor: '#eeeeee',
    cornerRadius: 40,
    padding: 10,
    paddingTop: 5,
    minWidth: 230,
    maxWidth: 230,
    textAlign: 'left',
    align: 'left',
  },
  paperInfo: {
    minHeight: 30,
    marginBottom: 10,
    color: 'black',
    textColor: 'black',
  },
  publicationAction: {
    margin: theme.spacing.unit,
    height: 6,
    backgroundColor: _.get(theme, 'palette.sandhill.50'),
    '&:hover': {
      backgroundColor: _.get(theme, 'palette.sandhill.300'),
    },
  },

});
