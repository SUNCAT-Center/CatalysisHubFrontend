module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  /* graphQLRoot: (process.env.NODE_ENV !== 'production') ? '//localhost:5000/graphql' : '//catappdatabase.herokuapp.com/graphql', */
  graphQLRoot: '//catappdatabase.herokuapp.com/graphql',
  whiteLabel: false,
  suBranding: false,
  appBar: true,
  version: '0.1.4',
  gaTrackingId: 'UA-109061730-1',
  apps: [
    {
      title: 'Activity Maps',
      route: '/activityMaps',
    },
  ],
};
