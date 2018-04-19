import packageJson from './package.json';

module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  /* flaskRoot: 'http://localhost:5001',*/
  flaskRoot: 'http://catapp-staging.herokuapp.com/',
  apiRoot: 'http://api.catalysis-hub.org/',
  /* graphQLRoot: (process.env.NODE_ENV !== 'production') ? '//localhost:5000/graphql' : '//catappdatabase.herokuapp.com/graphql', */
  graphQLRoot: '//catappdatabase.herokuapp.com/graphql',
  newGraphQLRoot: '//api.catalysis-hub.org/graphql',
  docRoot: '//docs.catalysis-hub.org',
  whiteLabel: false,
  suBranding: false,
  appBar: true,
  version: packageJson.version,
  gaTrackingId: 'UA-109061730-1',
  apps: [
    {
      title: 'Activity Maps',
      route: '/activityMaps',
      tooltip: 'Interactive activity maps.',
      children: [
        {
          title: 'CO Hydrogenation (111)',
          route: 'CO_Hydrogenation_111',
        },
        {
          title: 'NRR',
          route: 'NRR',
        },
        {
          title: 'OER',
          route: 'OER',
        },
        {
          title: 'ORR',
          route: 'ORR',
        },

      ],
    }, {
      title: 'CatML',
      route: '/catml',
      tooltip: 'Machine learning based predictions',
    }, {
      title: 'CatKit Slab Generator',
      route: '/catKitDemo',
      tooltip: 'Build your own slab geometry.',
    }, {
      title: 'GraphiQL API Console',
      route: '/graphQLConsole',
      tooltip: 'Direct programmatic access to database.',
    }, {
      title: 'Pourbaix Diagrams',
      route: '/pourbaixDiagrams',
      tooltip: 'Interactive electrochemical phase diagrams.',
    }, {
      title: 'Publications',
      route: '/publications',
      tooltip: 'Interactive list of publications with geometries.',
    }, {
      title: 'Scaling Relations',
      tooltip: 'App for exploring scaling relations -- Work in Progress.',
    }, {
      /* title: 'Upload Datasets',*/
      /* route: '/upload',*/
      /* }, {*/
      title: 'Wyckoff Bulk Generator',
      route: '/bulkGenerator',
      tooltip: 'Construct arbitrary bulk lattices.',
    }, {
      title: 'Your Next App ...',
      route: '/yourNextApp',
      tooltip: 'Documentation on how to write your own apps.',
    },
  ],
};
