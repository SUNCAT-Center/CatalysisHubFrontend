import packageJson from './package.json';

module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  flaskRoot: 'http://localhost:5000',
  /* flaskRoot: 'http://catapp-staging.herokuapp.com/',*/
  /* graphQLRoot: (process.env.NODE_ENV !== 'production') ? '//localhost:5000/graphql' : '//catappdatabase.herokuapp.com/graphql', */
  graphQLRoot: '//catappdatabase.herokuapp.com/graphql',
  whiteLabel: false,
  suBranding: false,
  appBar: true,
  version: packageJson.version,
  gaTrackingId: 'UA-109061730-1',
  apps: [
    {
      title: 'Activity Maps',
      route: '/activityMaps',
    }, {
      title: 'AtoML',
    }, {
      title: 'Wyckoff Bulk Generator',
      route: '/bulkGenerator',
    }, {
      title: 'CatKit Slab Generator',
      route: '/catKitDemo',
    }, {
      title: 'GraphiQL  Console',
      route: '/graphQLConsole',
    }, {
      title: 'Pourbaix Diagrams',
    }, {
      title: 'Publications',
      route: '/publications',
    }, {
      title: 'Scaling Relations',
    }, {
      /* title: 'Upload Datasets',*/
      /* route: '/upload',*/
      /* }, {*/
      title: 'Your Next App ...',
      route: '/yourNextApp',
    },
  ],
};
