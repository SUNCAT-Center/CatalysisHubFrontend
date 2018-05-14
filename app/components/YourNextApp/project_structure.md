
### Frontend: Project Structure

The basic layout of the frontend project accounting
for all files and directories that need to be typically
touched for implementing new features, looks as follows:

        /app # All programming logic
          /components # Reusable blocks w/o state
          /containers #  Bigger app blocks w/ state
          /utils
            /constants.js #  global constants like URLs
            /theme.js # Global app style
        /internals # File config settings and generators
        /routes.js # Mapping between URL input and components

Most of the additional code goes into a corresponding folder in either `app/components` or `app/containers`. These folders are structured such that new components can be dropped in to the project and code-coupling with other components is minimal. Unit tests go into each folder pertaining to the component. If you think about building a bigger feature such as a little single-page page app with one or more form fields, a diagram, and a component showing a slab you should probably right away start by creating a new container. If you want to build a small component that can be used throughout the frend, that should probably go into `components`. The will then automatically go into the corresponding sub-folder along with a subdirectory for unit test (`./tests`). Each folder should thought of one functional component that can be submitted (and maintained) using version control.

To wire up a URL typed into the address bar (or a clicked linked) with content shown, you need to look into `routes.js`. To define a new top level URL type

        npm run generate route

It will ask you for the URL and the component (or container) that should be shown. The generator is just a handy short hand. Details can always be adjusted later.  A route may also contain dynamic parts like `/component/:var1/:var2`, which can be processed as a variable in the corresponding component as `this.props.routeParams`. The `/containers/Profile/index.js` container illustrates this technique. URLs can be changed quite flexibly, but the [immortal words](https://www.w3.org/Provider/Style/URI) of the [web developer](https://twitter.com/vasusrini/status/516649874205716481) still count. 

