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
