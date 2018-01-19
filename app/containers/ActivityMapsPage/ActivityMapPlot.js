/**
 *
 * ActivityMapOer
 *
 */

import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import _ from 'lodash';

import axios from 'axios';
import { graphQLRoot } from 'utils/constants';

import plotlydata from './plot_data/OER.json';

function getExactReactions(reactants, products) {
  const query = `{catapp( publication_Title:"~", reactants:"${reactants.join('+')}", products:"${products.join('+')}",) { totalCount edges { node { reactants products chemicalComposition PublicationTitle Reaction reactionEnergy aseIds } } }}`;
  return new Promise((resolve, reject) => {
    axios.post(graphQLRoot, { query })
      .then((response) => {
        resolve(
          response.data.data.catapp.edges
          .filter(({ node }) => {
            const nodeReactants = JSON.parse(node.reactants);
            const nodeProducts = JSON.parse(node.products);
            return (_.isEqual(Object.keys(nodeReactants).sort(), reactants.sort()) &&
                _.isEqual(Object.keys(nodeProducts).sort(), products.sort()));
          })
          .map(({ node }) => node)
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}

class ActivityMapOer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const reactantsProducts = [
      { reactants: ['Ostar'], products: ['H2gas', 'H2Ogas', 'star'] },
      { reactants: ['OHstar'], products: ['H2gas', 'H2Ogas', 'star'] },
      { reactants: ['OOHstar'], products: ['H2gas', 'H2Ogas', 'star'] },
    ];

    reactantsProducts.map(({ reactants, products }) => getExactReactions(reactants, products)
        .then((reactions) => {
          reactions.map((reaction) => Object.values(JSON.parse(reaction.aseIds)).map((aseId) => axios.post(graphQLRoot, { query: `{systems(uniqueId:"${aseId}") {
  edges {
    node {
      energy
      Formula
      uniqueId
    }
  }
}}` }).then((response) => {
  response.data.data.systems.edges.map(({ node }) => (node.Formula.indexOf('Li') > -1));
})));
        })
        .catch(() => {
        }));
  }

  render() {
    return (
      <div>
        <div ref={(el) => { this.instance = el; }}>
          <h2>Activity Map</h2>
          <p>Data generously provided by M. Bajdich, unpublished, 2017.</p>
          <Plot
            {...plotlydata}
            layout={{
              hovermode: 'closest',
              height: Math.max(Math.min(window.innerHeight * 0.6, Number.POSITIVE_INFINITY), 120),
              width: Math.max(Math.min(window.innerWidth * 0.8, 1150), 320),
              margin: { l: 20, r: 20, b: 10, t: 10 },
            }}
            onClick={(event) => { this.props.clickDot(event); }}
          />
        </div>
      </div>
    );
  }
}


ActivityMapOer.propTypes = {
  clickDot: PropTypes.func,
};

export default ActivityMapOer;
