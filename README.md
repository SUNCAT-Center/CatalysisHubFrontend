# CatApp Browser


## Install

For local installation make a local clone of this repo

    git clone https://github.com/mhoffman/CatAppBrowser.git

change into the repository and run

    cd CatAppBrowser
    npm run setup # only first time
    npm run start

Open a browser at `http://localhost:3000/` to see it run.

To run this you will need npm/node which is explained [here](https://docs.npmjs.com/getting-started/installing-node).


## Development

The current interface is created from [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate). This may change in the future, we are just playing with different interfaces.

### Contributions

Contributions in the form of pull requests are highly welcome. To this end you will need a github.com account (free) and create a fork by clicking in the [Fork](https://github.com/mhoffman/CatAppBrowser#fork-destination-box) in the upper-right corner.
Clone your fork locally and commit your changes locally. Once you push them back to your public repository at github.com/<username>/CatAppBrowser you can create pull requests through the web interface. This will automatically spin up a new instance of the webapp for testing and staging purposes. Once we are happy with the candidate we can merge it into the live version.


### Adding New Components

To add a new component simply run

    npm run generate component

Give it a succinct name and follow the default choices.
This will create a new folder under `app/components/` with
all the needed files. The new component can be readily imported
and used throughout the app.

## Dependencies

- Graphs are created with [mpld3](http://mpld3.github.io/)
- React v15 (will be updated to 16 soon)
  React is a powerful JavaScript library that is actively developed by Facebook. With some background in HTML and a little bit of JavaScript one can quite far. There are a ton of [tutorials](https://reactjs.org/tutorial/tutorial.html) out there.

## UI Development

- This project uses [Material UI](http://www.material-ui.com/#/components/slider) Component throughout.

## Development

- To commit javascript code, it has to pass the ESLint linter. The linter may seem a little pesky at first, but I promise it makes your code look great and let's us focus on bigger code design issues.
- For testing we rely on [Jest](https://facebook.github.io/jest/docs/en/more-resources.html) and [Travis CI](https://travis-ci.org/mhoffman/CatAppBrowser)
