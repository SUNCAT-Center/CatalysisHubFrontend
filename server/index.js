/* eslint consistent-return:0 */

const express = require('express');
const csp = require('helmet-csp');
const sslRedirect = require('heroku-ssl-redirect');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use(csp({
  directives: {
    connectSrc: [
      "'self'",
      'api.catalysis-hub.org',
      'catapp-staging.herokuapp.com',
      'ichemlabs.cloud.chemdoodle.com',
      'localhost:5000',
    ],
    fontSrc: [
      "'self'",
      'fonts.googleapis.com',
      'data: fonts.gstatic.com',
    ],
    scriptSrc: [
      "'unsafe-eval'",
      "'unsafe-inline'",
      "'self'",
      'api.catalysis-hub.org',
      'www.google-analytics.com',
      'code.jquery.com',
    ],
    styleSrc: ["'unsafe-inline'",
      "'self'",
      'fonts.googleapis.com',
      'www.stanford.edu'],
    defaultSrc: ["'self'", 'api.catalysis-hub.org'],
    imgSrc: ["'self'", 'api.catalysis-hub.org', 'www.google-analytics.com'],
  },
}));
app.use(sslRedirect());

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
