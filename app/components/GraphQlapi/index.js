/**
 *
 * GraphQlapi
 *
 */

import React from 'react';
// import styled from 'styled-components';

import IFrame from 'react-iframe';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';


import { graphQLRoot } from 'utils/constants';

class GraphQlapi extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showInfo: true,
    };
    this.handleGotit = this.handleGotit.bind(this);
  }

  handleGotit() {
    this.setState({
      showInfo: false,
    });
  }
  render() {
    return (
      <div>
        <h2>CatApp Database API</h2>
        {this.state.showInfo === false ? null :
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <h3>Welcome to the GraphQL API</h3>
            <div>You can write you own queries and submit them with<br /> <pre>Command + Enter</pre></div>
            <div>Some examples are</div>
            <ul>
              <li> <pre>{'{systems}'}</pre> </li>
              <li><pre>{'{catapp { edges { node { reactants products reactionEnergy } } }}'}</pre></li>
              <li><pre>{'{systems(last: 5) { edges { node { id energy PublicationTitle keyValuePairs } } }}'}</pre></li>
            </ul>
            <div>{"Open the 'Docs' tab on the right to find a full documentation."}</div>
            <div>Alternatively you query from the command line using <pre style={{ display: 'inline' }}>curl</pre>:
              <pre>{ `curl -XPOST http://catappdatabase.herokuapp.com/graphql --data 'query={systems(last: 10 ) {
  edges {
    node {
      energy Cifdata
          }
  }
}}' ` }</pre>
            </div>
          </CardContent>
          <CardActions>
            <Button dense color="primary" onClick={this.handleGotit}>Got it! </Button>
          </CardActions>
        </Card>
        }

        <IFrame
          url={graphQLRoot}
          width="100%"
          height="80vh"
          position="relative"
          display="initial"
          allowFullScreen
        />
      </div>
    );
  }
}

GraphQlapi.propTypes = {

};

export default GraphQlapi;
