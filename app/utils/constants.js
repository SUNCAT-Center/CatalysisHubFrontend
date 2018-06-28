/* Import Icons*/

import packageJson from './package.json';

module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  /* flaskRoot: 'http://localhost:5001',*/
  flaskRoot: 'http://catapp-staging.herokuapp.com/',
  apiRoot: 'https://api.catalysis-hub.org/',
  /* apiRoot: 'http://localhost:5000',*/
  /* graphQLRoot: (process.env.NODE_ENV !== 'production') ? '//localhost:5000/graphql' : '//catappdatabase.herokuapp.com/graphql', */
  graphQLRoot: '//catappdatabase.herokuapp.com/graphql',
  /* newGraphQLRoot: '//catappdatabase2-pr-48.herokuapp.com/graphql',*/
  newGraphQLRoot: '//api.catalysis-hub.org/graphql',
  uploadGraphQLRoot: '//api.catalysis-hub.org/apps/upload/graphql',
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
      title: 'CatLearn',
      route: '/catLearn',
      tooltip: 'Machine learning based predictions.',
    }, {
      title: 'CatKit Slab Generator',
      route: '/catKitDemo',
      tooltip: 'Build your own slab geometry.',
    }, {
      title: 'GraphQL API',
      route: '/graphQLConsole',
      tooltip: 'Programmatic access to database.',
    }, {
      title: 'Pourbaix Diagrams',
      route: '/pourbaixDiagrams',
      tooltip: 'Interactive electrochemical phase diagrams.',
    }, {
      title: 'Prototype Search',
      route: '/prototypeSearch',
      tooltip: 'Search for structures using Wyckoff points.',
    }, {
      title: 'Publications',
      route: '/publications',
      tooltip: 'Calculated structures sorted by publications.',
    }, {
      title: 'Surface Reactions',
      tooltip: 'Explore calculated reaction energetics',
      route: '/energies',
    }, {
      title: 'Scaling Relations',
      route: '/scalingRelations',
      tooltip: 'App for exploring scaling relations -- WIP.',
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
      tooltip: 'How to write your own apps.',
    },
  ],
  people: [
    'Ankit Jain',
    'Jake Boes',
    'Kirsten Winther',
    'Martin Hansen',
    'Max Hoffmann',
    'Meng Zhao',
    'Michal Bajdich',
    'Morten Winther',
    'Osman Mamun',
    'Paul Jennings',
    'Thomas Bligaard',
  ],
};
