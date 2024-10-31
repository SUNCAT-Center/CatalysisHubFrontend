/* eslint consistent-return:0 */

const express = require('express');
const cors = require('cors');
const csp = require('helmet-csp');
const helmet = require('helmet');
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

app.use(helmet({
  frameguard: false,
  noCache: false,
}));
app.use(csp({
  directives: {
    connectSrc: [
      "'self'",
      'api.catalysis-hub.org',
      'catapp-staging.herokuapp.com',
      'ichemlabs.cloud.chemdoodle.com',
      'localhost:5000',
      'slack.com',
      'www.google-analytics.com',
      'catappdatabase2-pr-63.herokuapp.com',
      'slac-suncat.slack.com',
      'newt.nersc.gov',

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
    frameSrc: [
      "'self'",
      'api.catalysis-hub.org',
      'goo.gl',
      'docs.google.com',
      'www.cryst.ehu.es',
      'slac-suncat.slack.com',
      'slack.com',
      'github.com',
      'localhost:5000',
    ],
    frameAncestors: [
      "'self'",
      'github.com',

    ],
    defaultSrc: [
      "'self'",
      'api.catalysis-hub.org',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'api.catalysis-hub.org',
      'www.google-analytics.com',
      'lh1.googleusercontent.com',
      'lh2.googleusercontent.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'secure.gravatar.com',
    ],
  },
}));
app.use(sslRedirect());

const allowedOrigins = ['https://catappdatabase2-pr-63.herokuapp.com', 'https://api.catalysis-hub.org'];
app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://api.catalysis-hub.org, https://newt.nersc.gov');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Pingother, Content-Type, Accept');
  next();
});


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
