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

/* function sortedObject(obj) {*/
/* return _(obj).toPairs().sortBy(0).fromPairs().value();*/
/* }*/

async function getExactReactions({ reactants, products }) {
  const query = `{catapp( publication_Title:"~", reactants:"${Object.keys(reactants).join('+')}", products:"${Object.keys(products).join('+')}",) { totalCount edges { node { reactants products chemicalComposition PublicationTitle PublicationAuthors Reaction reactionEnergy aseIds } } }}`;
  /* console.log(query);*/
  return new Promise((resolve, reject) => {
    axios.post(graphQLRoot, { query })
      .then((response) => {
        resolve(
          response.data.data.catapp.edges
          .filter(({ node }) => {
            const nodeReactants = JSON.parse(node.reactants);
            const nodeProducts = JSON.parse(node.products);
            return (_.isEqual((nodeReactants), reactants) &&
              _.isEqual((nodeProducts), products));
          })
          .map(({ node }) => node)
          .map((node) => node)
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
}


let a = getExactReactions;
let b = getExactReactions;
a = b;
b = a;


class ActivityMapOer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  async componentDidMount() {
    /* const reactionSystems = {};*/
    /* const reactantsProducts = [*/
    /* { reactants: { Ostar: 1.0 }, products: { H2gas: -1.0, H2Ogas: 1.0, star: 1.0 } },*/
    /* { reactants: { OHstar: 1.0 }, products: { H2gas: -0.5, H2Ogas: 1.0, star: 1.0 } },*/
    /* { reactants: { OOHstar: 1.0 }, products: { H2gas: -1.5, H2Ogas: 2.0, star: 1.0 } },*/
    /* ];*/

    /* console.log('GETTING EXACT REACTIONS');*/
    /* console.log(getExactReactions);*/
    /* const reactions0 = await getExactReactions(reactantsProducts[0]);*/
    /* console.log(`Reactions0 ${reactions0}`);*/
    /* const reactions1 = await getExactReactions(reactantsProducts[1]);*/
    /* console.log(`Reaction1 ${reactions1}`);*/
    /* const reactions2 = await getExactReactions(reactantsProducts[2]);*/
    /* console.log(`Reaction2 ${reactions2}`);*/

    /* console.log(JSON.stringify(reactions0[0].aseIds));*/
    /* console.log((JSON.parse(reactions0[0].aseIds).star))*/

    /* [reactions0, reactions1, reactions2].map((reactions) =>*/
      /* console.log(reactions.length);*/
    /* null);*/
    /* [reactions0, reactions1, reactions2].map((reactions) => {*/
    /* reactions.map((reaction) => {*/
    /* const key = reaction.chemicalComposition;*/
    /* reactionSystems[key] = (reactionSystems[key] || [])*/
    /* return reactionSystems[key].push(reaction)*/
    /* })*/
    /* })*/

    /* reactions0.map((reaction) => {*/
    /* const key = reaction.chemicalComposition;*/
    /* reactionSystems[key] = (reactionSystems[key] || [])*/
    /* return reactionSystems[key].push(reaction)*/
    /* })*/

    /* reactions1.map((reaction) => {*/
    /* const key = reaction.chemicalComposition;*/
    /* reactionSystems[key] = (reactionSystems[key] || [])*/
    /* return reactionSystems[key].push(reaction)*/
    /* })*/

    /* reactions2.map((reaction) => {*/
    /* const key = reaction.chemicalComposition;*/
    /* reactionSystems[key] = (reactionSystems[key] || [])*/
    /* return reactionSystems[key].push(reaction)*/
    /* })*/

    /* console.log(reactionSystems);*/


    /* const reactions = await Promise.all([*/
    /* () => {return getExactReactions(reactantsProducts[0])},*/
    /* () => {return getExactReactions(reactantsProducts[1])},*/
    /* () => {return getExactReactions(reactantsProducts[2])},*/
    /* ])*/
    /* console.log('GOT EXACT REACTIONS');*/
    /* console.log(reactions)*/
    /* console.log(reactionSystems);*/

    /* reactantsProducts.map(({ reactants, products }) => getExactReactions(reactants, products)*/
    /* .then((reactions) => {*/
    /* reactions.map((reaction) => {*/
    /* _.set(*/
    /* reactionSystems*/
    /* [JSON.parse(reaction.aseIds).star, Object.keys(reactants)[0]],*/
    /* reaction*/
    /* );*/
    /* })*/
    /* })*/
    /* .catch(() => {*/
    /* }));*/
    /* console.log(reactionSystems);*/
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
            config={{ scrollZoom: false,
              displayModeBar: false,
              legendPosition: true,
              showTips: false }}
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
