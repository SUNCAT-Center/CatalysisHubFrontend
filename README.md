[![Build Status](https://travis-ci.org/SUNCAT-Center/CatalysisHubFrontend.svg?branch=master)](https://travis-ci.org/SUNCAT-Center/CatalysisHubFrontend.svg?branch=master)

# Catalysis-Hub.Org Frontend


## Install

For local installation head over to

    https://github.com/SUNCAT-Center/CatalysisHubFrontend

and click on the Fork button.  This requires you to have a [GitHub account](https://github.com/join?source=header-home)
with your own username. This will create a fork at http://github.com/[username]/CatalysisHubFrontend
If you open a terminal you can create a local clone via

    git clone https://github.com/[username]/CatalysisHubFrontend.git

Change into the repository `CatalysisHubFrontend` and run

    cd CatalysisHubFrontend
    git remote add upstream https://github.com/SUNCAT-Center/CatalysisHubBackend.git
    npm run setup # only first time
    npm run start

It might show a bunch of error message which we are going to ignore for now. Next, open a browser at `http://localhost:3000/` to see it run.

To run this you will need npm/node which is explained [here](https://docs.npmjs.com/getting-started/installing-node).

## Development

The current interface is created from [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate).

### Contributions

Contributions in the form of pull requests are highly welcome. To this end you will need a [github.com account (free)](https://github.com/join) and create a fork by clicking in the [Fork](https://github.com/SUNCAT-Center/CatalysisHubFrontend#fork-destination-box) in the upper-right corner.
Clone your fork locally and commit your changes locally. Once you push them back to your public repository at github.com/[username]/CatAppBrowser you can create pull requests through the web interface. This will automatically spin up a new instance of the webapp for testing and staging purposes. Once we are happy with the candidate we can merge it into the live version.


### Adding New Apps/Components

To add a new component simply run

    npm run generate component

Give it a succinct name and follow the default choices.
This will create a new folder under `app/components/` with
all the needed files. The new component can be readily imported
and used throughout the app.

### Add New Apps/Containers

For more complex applications, i.e. requiring several levels of user interface and user choice, you should go right a ahead and create a container. For intermittently storing user choices you will likely need [React Redux](https://github.com/reactjs/react-redux). If that sounds scary and complex, don't worry. Still start mocking up the user interface and we can talk about getting 'interactivity' into it later.

## Dependencies

- Graphs are created with [plotly](https://github.com/plotly/react-plotly.js/)
- Interactive structures are displayed with the [ChemDoodle Web](https://web.chemdoodle.com/) component
- React v15 (will be updated to 16 soon)
  React is a powerful JavaScript library that is actively developed by Facebook. With some background in HTML and a little bit of JavaScript one can get quite far. There are a ton of [tutorials](https://reactjs.org/tutorial/tutorial.html) out there.

## UI Development

- This project uses [Material UI](https://material-ui-next.com/) Components throughout.

## Development

- To commit javascript code, it has to pass the ESLint linter. The linter may seem a little pesky at first, but I promise it makes your code look great and let's us focus on bigger code design issues. Some issues can be fixed automatically by running
    `./node_modules/eslint/bin/eslint.js --fix <filename>`

- For testing we rely on [Jest](https://facebook.github.io/jest/docs/en/more-resources.html) and [Travis CI](https://travis-ci.org/SUNCAT-Center/CatalysisHubFrontend). Please have a look a Jest and write some simple tests. Test coverage should eventually go up.
