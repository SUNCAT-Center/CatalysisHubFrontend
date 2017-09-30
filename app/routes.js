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
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage/sagas'),
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

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
      path: 'activityMaps',
      name: 'activityMaps',
      getComponent(location, cb) {
        import('components/ActivityMaps')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: 'pourbaixDiagrams',
      name: 'pourbaixDiagramsPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PourbaixDiagramsPage/reducer'),
          import('containers/PourbaixDiagramsPage/sagas'),
          import('containers/PourbaixDiagramsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('pourbaixDiagramsPage', reducer.default);
          injectSagas(sagas.default);
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
          import('containers/EnergiesPage/sagas'),
          import('containers/EnergiesPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('energiesPage', reducer.default);
          injectSagas(sagas.default);
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
          import('containers/ScalingRelationsPage/sagas'),
          import('containers/ScalingRelationsPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('scalingRelationsPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
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
