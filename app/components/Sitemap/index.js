/**
*
* Sitemap
*
*/

import React from 'react';
import { routesParser as parseRoutes, sitemapBuilder as buildSitemap } from 'react-router-sitemap';
import configureStore from 'store';
import routes from 'routes';

class Sitemap extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    const store = configureStore();
    const paths = parseRoutes(routes(store));
    const sitemap = buildSitemap('https://www.catalysis-hub.org', paths);
    this.state = {
      sitemap: sitemap.toString(),
    };
  }

  render() {
    return (
      <div>
        {this.state.sitemap}
      </div>
    );
  }
}

Sitemap.propTypes = {

};


export default Sitemap;
