
import React from 'react';

import Script from 'react-load-script';
import ReactGA from 'react-ga';

export class CatKitDemoHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="https://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js" />

        <h1>CatKit Slab Generator</h1>
        <div>Checkout full code on <ReactGA.OutboundLink
          eventLabel="https://github.com/jboes/CatKit"
          to="https://github.com/jboes/CatKit"
        >
                github/jboes/CatKit
              </ReactGA.OutboundLink>
        </div>
      </div>
    );
  }
}
