/* Import Icons */

import packageJson from './package.json';

module.exports = {
  apiRoot: 'https://api.catalysis-hub.org/',
  /* apiRoot: 'https://backend-master-ihpitvqqnuqfw2e.herokuapp.com/',*/
  /* apiRoot: 'http://localhost:5000', */
  /* newGraphQLRoot: 'https://backend-master-ihpitvqqnuqfw2e.herokuapp.com/graphql', */
  newGraphQLRoot: '//api.catalysis-hub.org/graphql',
  uploadGraphQLRoot: '//api.catalysis-hub.org/apps/upload/graphql',
  docRoot: 'http://docs.catalysis-hub.org',
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
      //title: 'CatLearn',
      //route: '/catLearn',
      //tooltip: 'Machine learning based predictions.',
    //}, {
      //title: 'CatKit Slab Generator',
      //route: '/catKitDemo',
      //tooltip: 'Build your own slab geometry.',
    //}, {
      title: 'GraphQL API',
      route: '/graphQLConsole',
      tooltip: 'Programmatic access to database.',
    }, {
  //    title: 'Pourbaix Diagrams',
  //    route: '/pourbaixDiagrams',
  //    tooltip: 'Interactive electrochemical phase diagrams.',
  //  }, {
      title: 'Profiles',
      route: '/profile',
      tooltip: 'Contributions by indidual (co-)authors.',
    }, {
  //    title: 'Prototype Search',
  //    route: '/prototypeSearch',
  //    tooltip: 'Search for structures using Wyckoff points.',
  //  }, {
      title: 'Publications',
      route: '/publications',
      tooltip: 'Calculated structures sorted by publications.',
    }, {
      title: 'Surface Reactions',
      tooltip: 'Explore calculated reaction energetics.',
      route: '/energies',
    }, {
      title: 'Scaling Relations',
      route: '/scalingRelations',
      tooltip: 'App for exploring scaling relations.',
    //}, {
    //  title: 'Upload Datasets',
    //  route: '/upload',
    //  tooltip: 'Contribute reaction energy calculations.',
    //}, {
    //  title: 'Wyckoff Bulk Generator',
    //  route: '/bulkGenerator',
    //  tooltip: 'Construct arbitrary bulk lattices.',
    //}, {
    //  title: 'Your Next App ...',
    //  route: '/yourNextApp',
    //  tooltip: 'How to write your own apps.',
    },
  ],
  people: {
    'Kirsten Winther': ['Associate Staff Scientist, SUNCAT, SLAC National Accelerator Laboratory.',
      'http://suncat.stanford.edu/people/kirsten-winther'],
    'Michal Bajdich': ['Staff Scientist, SUNCAT, SLAC National Accelerator Laboratory.',
      'http://suncat.stanford.edu/people/michal-bajdich'],
    'Johannes Voss': ['Staff Scientist, SUNCAT, SLAC National Accelerator Laboratory.',
      'http://suncat.stanford.edu/people/johannes-voss'],
    'Frank Abild Pedersen': ['Senior Staff Scientist, SUNCAT Co-Director, SLAC National Accelerator Laboratory.',
      'http://suncat.stanford.edu/pi/frank-abild-pedersen'],
  },
  contributors: {
    'Thomas Bligaard': ['Professor at Department of Energy Conversion and Storage, Technical University of Denmark',
      'https://www.staff.dtu.dk/tbli'],
    'Max Hoffmann': ['Software engineer at Apple, former postdoc at SUNCAT and developer of the catalysis-hub frontend',
      'http://suncat.stanford.edu/people/max-hoffmann'],
    'Osman Mamun': ['postdoc at Pacific Northwest National Laboratory, former postdoc at SUNCAT',
      'https://www.pnnl.gov/people/osman-mamun'],
    'Jacob Boes': ['Former postdoc at SUNCAT.',
      'https://suncat.stanford.edu/people/jacob-russell-boes'],
    'Martin Hansen': ['Computational materials scientist, former postdoc at SUNCAT.',
      'http://suncat.stanford.edu/people/martin-hangaard-hansen'],
    'Meng Zhao': ['Computational materials scientist, former postdoc at SUNCAT.',
      'http://suncat.stanford.edu/people/meng-zhao'],
    'Philomena Schlexer': ['Former postdoc at SUNCAT.',
      'http://suncat.stanford.edu/theory/people/philomena-schlexer'],
    'Ankit Jain': ['Assistant Professor at IIT Bombay, former postdoc at SUNCAT.',
      'https://www.me.iitb.ac.in/?q=faculty/Prof.%20Ankit%20Jain'],
  },
};
