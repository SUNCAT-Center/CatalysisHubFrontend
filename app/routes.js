// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer } = getAsyncInjectors(store);

  return [
    {
      path: '/index.html',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('home', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('home', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/features',
      name: 'features',
      getComponent(nextState, cb) {
        import('containers/FeaturePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/activityMaps(/:reaction)',
      name: 'activityMaps',
      getComponent(location, cb) {
        import('containers/ActivityMapsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: 'pourbaixDiagrams',
      name: 'pourbaixDiagramsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PourbaixDiagramsPage/reducer'),
          import('containers/PourbaixDiagramsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('pourbaixDiagramsPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/energies',
      name: 'energiesPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EnergiesPage/reducer'),
          import('containers/EnergiesPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('energiesPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/scalingRelations',
      name: 'scalingRelationsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ScalingRelationsPage/reducer'),
          import('containers/ScalingRelationsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('scalingRelationsPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/publications(/:pubId)',
      name: 'publications',
      getComponent(location, cb) {
        import('components/Publications')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/yourNextApp',
      name: 'yourNextApp',
      getComponent(location, cb) {
        import('components/YourNextApp')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/catLearn',
      name: 'CatLearn',
      getComponent(location, cb) {
        import('components/CatLearn')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/generalSearch',
      name: 'generalSearch',
      getComponent(location, cb) {
        import('components/GeneralSearch')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/graphQLConsole',
      name: 'graphQlapi',
      getComponent(location, cb) {
        import('components/GraphQlapi')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/plotlyDemo',
      name: 'plotlyDemo',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PlotlyDemo/reducer'),
          import('containers/PlotlyDemo'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('plotlyDemo', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/catKitDemo(/:data)',
      name: 'catKitDemo',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CatKitDemo/reducer'),
          import('containers/CatKitDemo'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('catKitDemo', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/catKitDemo(/:lattice/:latticeConstant/:composition)',
      name: 'catKitDemo',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CatKitDemo/reducer'),
          import('containers/CatKitDemo'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('catKitDemo', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/profile(/:name)',
      name: 'profile',
      getComponent(location, cb) {
        import('containers/Profile')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: 'appsIndex',
      name: 'apps',
      getComponent(location, cb) {
        import('components/Apps')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/settings',
      name: 'settings',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Settings/reducer'),
          import('containers/Settings'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('settings', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/upload',
      name: 'upload',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Upload/reducer'),
          import('containers/Upload'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('upload', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: 'bulkGenerator',
      name: 'bulkGenerator',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/BulkGenerator/reducer'),
          import('containers/BulkGenerator'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('bulkGenerator', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/feedback',
      name: 'feedBackForm',
      getComponent(location, cb) {
        import('components/FeedBackForm')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/prototypeExplorer',
      name: 'prototypeExplorer',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PrototypeExplorer/reducer'),
          import('containers/PrototypeExplorer'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('prototypeExplorer', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/prototypeSearch',
      name: 'prototypeSearch',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PrototypeSearch/reducer'),
          import('containers/PrototypeSearch'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('prototypeSearch', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/sitemap',
      name: 'sitemap',
      getComponent(location, cb) {
        import('components/Sitemap')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/about',
      name: 'about',
      getComponent(location, cb) {
        import('components/About')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/privacyPolicy',
      name: 'privacyPolicy',
      getComponent(location, cb) {
        import('components/PrivacyPolicy')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/developerGuide',
      name: 'yourNextApp',
      getComponent(location, cb) {
        import('components/YourNextApp')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/catml',
      name: 'catLearn',
      getComponent(location, cb) {
        import('components/CatLearn')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
