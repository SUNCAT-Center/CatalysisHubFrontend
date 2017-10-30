module.exports = {
  backendRoot: 'https://obscure-woodland-71302.herokuapp.com/',
  graphQLRoot: (process.env.NODE_ENV === 'production') ? '//localhost:5000/graphql' : '//catapp-console.herokuapp.com/graphql',
};
