module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  graphQLRoot: (process.env.NODE_ENV !== 'production') ? '//localhost:5000/graphql' : '//catappdatabase.herokuapp.com/graphql',
  suBranding: false,
  appBar: true,
  version: '0.1.0',

};
