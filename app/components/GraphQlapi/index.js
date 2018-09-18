/**
 *
 * GraphQlapi
 *
 */

import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';

import IFrame from 'react-iframe';
import Helmet from 'react-helmet';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Slide from 'material-ui/transitions/Slide';

import { withStyles } from 'material-ui/styles';
import { withCookies, Cookies } from 'react-cookie';

import { newGraphQLRoot } from 'utils/constants';

import { styles } from './styles';

class GraphQlapi extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      graphqlShowInfo: ((this.props.cookies.get('graphqlShowInfo') || 'true') === 'true'),
    };
    this.handleGotit = this.handleGotit.bind(this);
  }

  handleGotit(value) {
    this.setState({
      graphqlShowInfo: value,
    });
    this.props.cookies.set('graphqlShowInfo', value);
  }
  render() {
    return (
      <Slide
        mountOnEnter
        unmountOnExit
        in
        direction="left"
      >
        <div>
          <Helmet>
            <title>GraphQL Console</title>
            <meta keywords="graphql, api, database, catalysis, chemical reactions, density functional theory, surface structures, cif, input files" />
          </Helmet>
          <Grid container direction="row" justify="space-between">
            <Grid item>
              <h2>CatApp Database API</h2>
            </Grid>
            <Grid item>
              {this.state.graphqlShowInfo === true ? null :
              <Button className={this.props.classes.button} color="primary" onClick={() => { this.handleGotit(true); }}>Help!</Button>
        }
            </Grid>
          </Grid>
          {this.state.graphqlShowInfo === false ? null :
          <Card style={{ marginBottom: 20 }}>
            <CardContent>
              <Grid container direction="row" justify="space-between">
                <Grid item >
                  <h3>Welcome to the GraphQL API</h3>
                </Grid>
                <Grid item >
                  <CardActions>
                    <Button color="primary" onClick={() => { this.handleGotit(false); }}>Got it! </Button>
                  </CardActions>
                </Grid>
              </Grid>
              <div>You can write you own queries and submit them with<br /> <pre>Command + Enter</pre></div>
              <div>Some examples are</div>
              <ul>
                <li> <pre>{'{systems}'}</pre> </li>
                <li><pre>{'{catapp { edges { node { reactants products reactionEnergy } } }}'}</pre></li>
                <li><pre>{'{systems(last: 5) { edges { node { id energy PublicationTitle keyValuePairs } } }}'}</pre></li>
              </ul>
              <div>{"Open the 'Docs' tab on the right to find a full documentation."}</div>
              <div>Alternatively you query from the command line using <pre style={{ display: 'inline' }}>curl</pre>:
                  <pre>{ `curl -XPOST https://api.catalysis-hub.org/graphql --data 'query={systems(last: 10 ) {
  edges {
    node {
      energy Cifdata
          }
  }
}}' ` }</pre>
              </div>
              <div>Or you can send the same query from a python script like so</div>
              <pre>{'import requests\n' +
                `requests.post(root, {'query':
              '{systems(last: 5) { edges { node { energy PublicationTitle InputFile(format: "espresso-in") } } }}
              }).json()`}</pre>
              <Grid container direction="row" justify="flex-end">
                <Grid item >
                  <CardActions>
                    <Button color="primary" onClick={() => { this.handleGotit(false); }}>Got it! </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        }

          <Paper>
            <IFrame
              url={newGraphQLRoot}
              width="100%"
              height="80vh"
              position="relative"
              display="initial"
              allowFullScreen
            />
          </Paper>
        </div>
      </Slide>
    );
  }
}

GraphQlapi.propTypes = {
  cookies: instanceOf(Cookies),
  classes: PropTypes.object,

};

export default withCookies(
  withStyles(styles, { withTheme: true })(
    GraphQlapi
  )
);
