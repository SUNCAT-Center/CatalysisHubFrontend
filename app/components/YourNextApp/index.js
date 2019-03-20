/**
 *
 * YourNextApp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Switch from 'material-ui/Switch';
import Script from 'react-load-script';
import Grid from 'material-ui/Grid';
import ReactGA from 'react-ga';
import Markdown from 'markdown-to-jsx';
import Plot from 'react-plotly.js';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';

import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';
import projectStructure from './project_structure.md';
import reactQuickstart from './react_quickstart.md';
import backendRoutes from './backend_routes.md';
import atomStructures from './atomStructures.md';
import whyJS from './whyJS.md';
import makingPlots from './makingPlots.md';
import ScatterPlot from './scatterPlot';


import { styles } from './styles';

const initialState = {
  showLineNumbers: true,
  initialLoad: true,

};


const cifData = `data_image0\n_cell_length_a       4.04635
_cell_length_b       4.04635
_cell_length_c       4.04635
_cell_angle_alpha    90
_cell_angle_beta     90
_cell_angle_gamma    90

_symmetry_space_group_name_H-M    "P 1"
_symmetry_int_tables_number       1

loop_
  _symmetry_equiv_pos_as_xyz
  'x, y, z'

loop_
  _atom_site_label
  _atom_site_occupancy
  _atom_site_fract_x
  _atom_site_fract_y
  _atom_site_fract_z
  _atom_site_thermal_displace_type
  _atom_site_B_iso_or_equiv
  _atom_site_type_symbol
  Re1      1.0000 0.00000  0.00000  0.00000  Biso   1.000  Re
  Re2      1.0000 0.00000  0.50000  0.50000  Biso   1.000  Re
  Re3      1.0000 0.50000  0.00000  0.50000  Biso   1.000  Re
  Tl1      1.0000 0.50000  0.50000  0.00000  Biso   1.000  Tl
`;
const zPlot = [[10, 10.625, 12.5, 15.625, 20],
       [5.625, 6.25, 8.125, 11.25, 15.625],
       [2.5, 3.125, 5.0, 8.125, 12.5],
       [0.625, 1.25, 3.125, 6.25, 10.625],
       [0, 0.625, 2.5, 5.625, 10]];


class YourNextApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = initialState;
    setTimeout(() => {
      this.setState({
        initialLoad: false,
      });
    }, 5000);
  }
  render() {
    return (
      <div>
        <Script url="https://code.jquery.com/jquery-3.2.1.min.js" />
        <Script url="/static/ChemDoodleWeb.js" />
        <Slide
          mountOnEnter
          unmountOnExit
          in
          direction="left"
        >
          <div>
            <Paper className={this.props.classes.paper}>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <h2>Your Next App</h2>
                </Grid>
                <Grid item>
                  <div>
                    <p>Show line numbers</p>
                    <Switch
                      checked={this.state.showLineNumbers}
                      onClick={() => this.setState({ showLineNumbers: !this.state.showLineNumbers })}
                      value="checkedA"
                    />
                  </div>
                </Grid>
              </Grid>
              <h3>Outline</h3>
              <p>Catalysis-Hub.Org uses
              <ReactGA.OutboundLink
                eventLabel="http://flask.pocoo.org/"
                to="http://flask.pocoo.org/"
                target="_blank"
              > Flask </ReactGA.OutboundLink>
              for its backend features and
              <ReactGA.OutboundLink
                eventLabel="https://reactjs.org/"
                to="https://reactjs.org/"
                target="_blank"
              > {'React.js'} </ReactGA.OutboundLink>{`
            for its frontend features. Both of these projects we are well documented and maintained have a large number of community contributions. This tutorial won't go through
            the details of any of those. Please refer to their respective documentation. This tutorial intends to give a few starting point to get started with your own app
            and get a feel for how different parts play together. Also we will go through some components that are specific to Catalysis-Hub.Org like GraphQL and plotting with Plotly
            as well as some project maintenance stuff like regression tests.
        `}
              </p>
              <p>
        Start mocking up the interface for your next SUNCAT app in <code>app/components/YourNextApp/index.js</code>. Let&apos;s hang out on the <a href="https://slac-suncat.slack.com/messages/C75QBPDMF/">#catapp SLACK channel</a> if you have any questions!
        You will need a recent node version 8, and npm version 5 as a development environment.
      </p>
              <h3 id="development">Development</h3>
              <p>The current interface is created from <a href="https://github.com/react-boilerplate/react-boilerplate">React Boilerplate</a>.</p>
              <h3 id="contributions">Contributions</h3>
              <p>Contributions in the form of pull requests are highly welcome. To this end you will need a <a href="https://github.com/join">github.com account (free)</a> and create a fork by clicking in the <a href="https://github.com/SUNCAT-Center/CatAppBrowser#fork-destination-box">Fork</a> in the upper-right corner. Clone your fork locally and commit your changes locally. Once you push them back to your public repository at github.com/[username]/CatAppBrowser you can create pull requests through the web interface. This will automatically spin up a new instance of the webapp for testing and staging purposes. Once we are happy with the candidate we can merge it into the live version.</p>

            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2 id="install">Install Frontend</h2>
              <p>For local installation make a local clone of this repo</p>
              <SyntaxHighlighter language={'bash'}>
        git clone https://github.com/[username]/CatAppBrowser.git
      </SyntaxHighlighter>
              <p>change into the repository and run</p>
              <SyntaxHighlighter language={'bash'}>{`cd CatAppBrowser
npm run setup # only first time
npm run start`}
              </SyntaxHighlighter>
              <p>Open a browser at <code>http://localhost:3000/</code> to see it run.</p>
              <p>To run this you will need npm/node which is explained <a href="https://docs.npmjs.com/getting-started/installing-node">here</a>.</p>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Install Backend</h2>
              <p>Start by cloning the backend flask repository like so</p>
              <SyntaxHighlighter language={'bash'}>
                {'git clone https://github.com/[username]/CatalysisHubBackend.git'}
              </SyntaxHighlighter>
              <p>Once git has finished cloning cd into the newly created directory and
              create a new virtual environment, like so:</p>
              <SyntaxHighlighter language={'bash'}>
                {'virtualenv -p python3.6 .'}
              </SyntaxHighlighter>
              <p>{`
              Please don't forget the dot ('.'). It matters This will create the usual directories ./bin, ./lib, ./share
              and help keep all dependencies neatly in one directory. You can active the virtual environment like so
              `}
              </p>
              <SyntaxHighlighter language={'bash'}>
                {'. bin/activate'}
              </SyntaxHighlighter>
              <p>
              Now we are ready to install all dependencies locally
            </p>
              <SyntaxHighlighter language={'bash'}>
                {'pip install -r requirements.txt'}
              </SyntaxHighlighter>
            If this has finished installing we can start the flask app like
            <SyntaxHighlighter language={'bash'}>{'python app.py'} </SyntaxHighlighter>
              <p>This should start serving the backend API at `http://localhost:5000`</p>
            </Paper>
            <Paper className={this.props.classes.paper}>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h3 id="adding-new-appscomponents">Adding New Frontend Apps</h3>
              <p>To add a new component simply run</p>
              <SyntaxHighlighter language={'bash'} showLineNumbers={this.state.showLineNumbers}>
              npm run generate container
            </SyntaxHighlighter>
            and follow the dialog. The result could look as follows
            <SyntaxHighlighter language={'bash'} showLineNumbers={this.state.showLineNumbers}>{`
> npm run generate
> react-boilerplate@0.1.6 generate /Users/maxjh/src/CatAppBrowser
> plop --plopfile internals/generators/index.js

? [PLOP] Please choose a generator. container - Add a container component
? What should it be called? MyShinyApp
? Select a base component: Component
? Do you want headers? No
? Do you want an actions/constants/selectors/reducer tuple for this container? Yes
? Do you want sagas for asynchronous flows? (e.g. fetching data) No
? Do you want i18n messages (i.e. will this component use text)? No
? Do you want Material UI styling? Yes
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/index.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/tests/index.test.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/actions.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/tests/actions.test.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/constants.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/selectors.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/tests/selectors.test.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/reducer.js
[SUCCESS] add /Users/maxjh/src/CatAppBrowser/app/containers/MyShinyApp/tests/reducer.test.js
`}
            </SyntaxHighlighter>

              <p> This will create a new folder under <code>app/components/MyNextApp</code> with all the needed files. The new component can be readily imported and used throughout the app.</p>
              <p>{'Let\'s add a new route to the app so that it can be opened in the browser'}</p>
              <SyntaxHighlighter language={'bash'} showLineNumbers={this.state.showLineNumbers}>{`
[dt: 0s] maxjh@dhcp-visitor-217-68:~/src/CatAppBrowser (master)$ npm run generate route
> react-boilerplate@0.1.6 generate /Users/maxjh/src/CatAppBrowser
> plop --plopfile internals/generators/index.js "route"

? Which component should the route show? MyShinyApp
? Enter the path of the route. /myShinyApp
[SUCCESS] modify /Users/maxjh/src/CatAppBrowser/app/routes.js
              `}</SyntaxHighlighter>
              <p>This will add the following new block to <code>./app/routes.js</code></p>
              <SyntaxHighlighter language={'js'} showLineNumbers={this.state.showLineNumbers}>{`
    }, {
      path: '/myShinyApp',
      name: 'myShinyApp',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/MyShinyApp/reducer'),
          import('containers/MyShinyApp'),
        ]); 

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('myShinyApp', reducer.default);
          renderRoute(component);
        }); 

        importModules.catch(errorLoading);
      },  
              `}
              </SyntaxHighlighter>
              <p>{'At this point we don\'t need to do anything about it. But in case we want to change or delete a route we can edit this here directly. Also we should commit this change to git at one point.'}</p>
              <p>If now spin up the frontend using</p>
              <code>npm run start</code>
              <p>we can open a browser at <code>http://localhost:3000/myShinyApp</code> and should be greeted by an empty app.</p>
              <p>Next we open <code>app/containers/MyShinyApp/index.js</code>, which should now look like
            </p>
              <SyntaxHighlighter language={'js'} showLineNumbers={this.state.showLineNumbers}>{`
/*
 *
 * MyShinyApp
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { createStructuredSelector } from 'reselect';
import makeSelectMyShinyApp from './selectors';

const styles = () => ({
});

export class MyShinyApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
      </div>
    );  
  }
}

MyShinyApp.propTypes = { 
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  MyShinyApp: makeSelectMyShinyApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };  
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true})(MyShinyApp));
              `}
              </SyntaxHighlighter>
              <p>A lot if this will look rather foreign for now. The most important part happens around line 20-21. Here the
              app layout is defined using JSX. JSX is essentially a way of writing JavaScript that looks a lot like HTML. It allows
              us to use HTML elements directly</p>
              <p>{'Let\'s go ahead and add a title and some next.'}</p>
              <SyntaxHighlighter language={'html'} showLineNumbers={this.state.showLineNumbers} startingLineNumber={20}>{`<div>
  <h1>My Shiny New App</h1>
  <p>Hi, welcome to my shiny new app. Thanks for stopping by. More to come later. K thanks bye</p>
</div>`}
              </SyntaxHighlighter>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Including data from the GraphQL API</h2>
              <p>For retrieving data from the database we will use the module axios which allows us to make HTTP requests similar
              requests in Python or curl on the command line.
            </p>
              <p>To start we have to import the axios module somewhere near the top of our app, like so:</p>
              <SyntaxHighlighter language="javascript" showLineNumbers={this.state.showLineNumbers}>
                {`import axios from {'axios'};
import { newGraphQLRoot } from 'utils/constants';
`}
              </SyntaxHighlighter>
              <p>While we are at it we also imported the URL of the GraphQL API which is defined in utils/constants.js</p>
              <p>Wherever we need to fetch data from the database (or some other backend endpoint). We can fetch this like so</p>
              <SyntaxHighlighter language={'javascript'} showLineNumbers={this.state.showLineNumbers}>
                {`const url = 'http://api.catalysis-hub.org/apps/myShinNewApp/endpoint_function'
const params = {params:{
param1: 'bla bla bla',
param2: 'bla bla bla',
}};
axios.post(url, parms).then((response) => {
});`}
              </SyntaxHighlighter>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Adding Flask API endpoints</h2>
              <Markdown>
                {backendRoutes}
              </Markdown>
              <p>A lot of interactive functionality can be implemented in the frontend using only JavaScript. However,
              other features are  lot easier to do on the frontend especially, when they strongly leverage existing
              Python libraries such as ASE, CatMAP, CatLearn, CatGen etc.. One other good reason to write API Endpoints
              is that they can be re-used by other apps or even other websites.</p>
              <p>To add a new backend functionality we head over to the directory with the flask APP and create a new folder like</p>
              <SyntaxHighlighter language={'bash'} showLineNumbers={this.state.showLineNumbers}>{'mkdir -p ./apps/myShinyNewAppName'}</SyntaxHighlighter>
            Inside this directory we create a new file named <code>`__init__.py`</code>, that we populate like so
            <SyntaxHighlighter language={'python'} showLineNumbers={this.state.showLineNumbers}>{`import copy import json
import os
import os.path
import pprint
import zipfile
import time
import datetime
import random
import re

# workaround to work on both Python 2 and Python 3
try:
    import io as StringIO
except ImportError:
    import StringIO

import numpy as np

import flask

import ase.atoms
import ase.io



app = flask.Blueprint('myShinyNewApp', __name__)

@app.route('/hello_world', methods=['GET', 'POST'])
def hello_world():
    time0 = time.time()

    # HERE BE DRAGONS
    name = flask.request.args.get('name', 'FOOBAR')

    atoms = ase.atoms.Atoms('H')
    with StringIO.StringIO() as outfile:
        ase.io.write(outfile, atoms, format='cif')
        atoms_string = outfile.getvalue()

    return flask.jsonify({
        'message': 'Hello {name}, have a Hydrogen (atom)'.format(**locals()),
        'atom': atoms_string,
        'time': time.time() - time0,
        })  
`} </SyntaxHighlighter>
              <p>Of course, what you put below line 33, will depend on the functionality of your app. But hopefully this
              can give you some ideas.
            </p>
              <p>In this code stub we have created a Flask.Blueprint which allows us to write modular apps by combining
              several python modules that could each act like individual apps under one common router.</p>
              <p>To wire this blueprint up into the main Flask app, we open the apps.py file in the main directory and just
              before the</p>
              <SyntaxHighlighter language={'python'} showLineNumbers={this.state.showLineNumbers}>{`if __name__ == '__main__':
  ...
            `}
              </SyntaxHighlighter>
              <p> part we add the two lines </p>
              <SyntaxHighlighter language={'python'} showLineNumbers={this.state.showLineNumbers}>{`from apps.myShinyNewApp import app as myShinyNewApp
app.register_blueprint(myShinyNewApp, url_prefix='/apps/myShinyNewApp')
            `}
              </SyntaxHighlighter>
              <p>After saving the file, we should be able to run <code>
              python manage.py list_routes</code> and see among other things the line </p>
              <SyntaxHighlighter language={'bash'} showLineNumbers={this.state.showLineNumbers}>{`myShinyNewApp.hello_world                          POST,OPTIONS,GET,HEAD /apps/myShinyNewApp/hello_world
`}</SyntaxHighlighter>
              <p>If this test was successfull, we restart the process running ./app.py </p> and open a browser at

            <ReactGA.OutboundLink
              eventLabel="http://localhost:5000/apps/myShinyNewApp/hello_world?name=Peter"
              to="http://localhost:5000/apps/myShinyNewApp/hello_world?name=Peter"
              target="_blank"
            >http://localhost:5000/apps/myShinyNewApp/hello_world?name=Peter</ReactGA.OutboundLink>
              <p>This should show us some JSON like</p>
              <SyntaxHighlighter language={'json'} showLineNumbers={this.state.showLineNumbers}>{`{
"atom": "data_image0\n_cell_length_a       0\n_cell_length_b       0\n_cell_length_c       0\n_cell_angle_alpha    90\n_cell_angle_beta     90\n_cell_angle_gamma    90\n\nloop_\n  _atom_site_label\n  _atom_site_occupancy\n  _atom_site_fract_x\n  _atom_site_fract_y\n  _atom_site_fract_z\n  _atom_site_thermal_displace_type\n  _atom_site_B_iso_or_equiv\n  _atom_site_type_symbol\n  H1       1.0000 0.00000  0.00000  0.00000  Biso   1.000  H\n", 
"message": "Hello FOOBAR, have a Hydrogen (atom)", 
"time": 0.0005071163177490234
}`}
              </SyntaxHighlighter>
              <p>Congrats, you have just written your first web app!</p>







            </Paper>
            <Paper className={this.props.classes.paper}>
              <Markdown>
                {reactQuickstart}
              </Markdown>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <Markdown>
                {makingPlots}
              </Markdown>
              <Plot
                data={[{
                  type: 'contour',
                  z: zPlot,
                  showscale: true,
                  colorbar: { titleside: 'right', title: 'Target Function [eV]' },
                  colorscale: [['0.0', 'rgb(165,0,38)'], ['0.111111111111', 'rgb(215,48,39)'], ['0.222222222222', 'rgb(244,109,67)'], ['0.333333333333', 'rgb(253,174,97)'], ['0.444444444444', 'rgb(254,224,144)'], ['0.555555555556', 'rgb(224,243,248)'], ['0.666666666667', 'rgb(171,217,233)'], ['0.777777777778', 'rgb(116,173,209)'], ['0.888888888889', 'rgb(69,117,180)'], ['1.0', 'rgb(49,54,149)']],
                },
                {
                  type: 'scatter',
                  mode: 'markers',
                  x: [1, 2, 3, 4, 3],
                  y: [1, 4, 2, 1.5, 3],
                },
                {
                  type: 'scatter',
                  mode: 'markers',
                  x: [3.5, 1.2, 2.8, 3.1, 0.5],
                  y: [1, 4, 2, 1.5, 3],
                },
                ]}
                config={{
                  scrollZoom: false,
                  legendPosition: true,
                  displayModeBar: false,
                }}
                layout={{
                  hovermode: 'closest',
                  xaxis: {
                    title: 'Descriptor 1',
                  },
                  yaxis: {
                    title: 'Descriptor 2',
                  },
                }}
                onClick={() => {
                }}

              />

            </Paper>
            <Paper className={this.props.classes.paper}>
              <ScatterPlot />
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Displaying Tables</h2>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <Markdown >
                {atomStructures}
              </Markdown>
              {this.state.initialLoad ? null :
              <GeometryCanvasWithOptions
                cifdata={cifData}
                uniqueId={'slab_preview'}
                key={'slab_preview'}
                id={'slab_preview'}
              />
              }

            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Frontend Testing</h2>
              <p>TODO</p>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2>Backend Testing</h2>
              <p>TODO</p>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <h2 id="dependencies">Dependencies</h2>
              <ul>
                <li>Most diagrams are created with <a href={"'https://plot.ly/'"}>Plotly{"'"}s</a></li> js library.
          <li>React v15 (will be updated to 16 hopefully soon) React is a powerful JavaScript library that is actively developed by Facebook. With some background in HTML and a little bit of JavaScript one can quite far. There are a ton of <a href="https://reactjs.org/tutorial/tutorial.html">tutorials</a> out there.</li>
              </ul>
              <h2 id="ui-development">UI Development</h2>
              <ul>
                <li>This project uses <a href="http://www.material-ui.com/#/components/slider">Material UI</a> Components throughout.</li>
              </ul>
              <h2 id="development-1">Development</h2>
              <ul>
                <li><p>To commit javascript code, it has to pass the ESLint linter. The linter may seem a little pesky at first, but I promise it makes your code look great and lets&apos;s us focus on bigger code design issues. Some issues can be fixed automatically by running <code>./node_modules/eslint/bin/eslint.js --fix &lt;filename&gt;</code></p></li>
                <li><p>For testing we rely on <a href="https://facebook.github.io/jest/docs/en/more-resources.html">Jest</a> and <a href="https://travis-ci.org/SUNCAT-Center/CatAppBrowser">Travis CI</a>. Please have a look a Jest and write some simple test. Test coverage should eventually go up.</p></li>
              </ul>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <Markdown>
                {whyJS}
              </Markdown>
            </Paper>
            <Paper className={this.props.classes.paper}>
              <Markdown>
                {projectStructure}
              </Markdown>
            </Paper>
          </div>
        </Slide>
      </div>
    );
  }
}

YourNextApp.propTypes = {
  classes: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(YourNextApp);
