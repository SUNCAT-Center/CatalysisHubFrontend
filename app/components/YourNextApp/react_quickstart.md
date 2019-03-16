## React Quick Dive

### Component and Containers

As mentioned above, there are two types sub-directories: components and containers. The idea is to make code organization easier once the code base grows. If you like inside them both declare objects that are derived from `React.Component`. However, the container can actively manipuplate the global app state while components should not. Containers use Redux interact with the app state, while components do not change state. They still contain a little bit of state to reflect graphical interaction that are immediately visible to the user but there is no expectation that they are accesible from a different form or component. Again, if this is all confusing hub-bub, you might probably start with a `container`. You can always delete the corresponding files and hooks later to turn it into a component.

### State and props

Much of the programming flow of a React app is that each component has props and state. You can think of them like read-only (or parameters) and read-and-write variables of a function. Props are always passed in from other component upon invocation, while state maybe changed by each component (using `this.setState(...)`). If you wonder about the point of props if you cannot change them: you can influence what a compoent looks like by calling it with different props. State on the other hand can be thought of more like a traditional variable in programming


### JSX

JSX is one of the essential features of the React framework. It is a neat little syntax that essentially looks like HTML but allows to write little snippets of nested javascript code blocks that declare the user interface. It allows to seamlessly mix HTML Tags with user-defined Tags representing React components. A small block of JSX might look as follows:

      <div>
      <h1>Hi</h1>
      <div>Welcome to this snippet! More to follow.</div>
      </div>

But upon defining a React Component like so

      class Welcome extends React.Component {
        render() {
          return (
            <div>Welcome to this snippet! More to follow.</div>
          );
        }
      }

we can re-use this component directly in some other block, like so:

      <div>
      <h1>Hi</h1>
      <Welcome />
      </div


Neat, isn't it? It allows us to very easily write re-usable components in a declarative fashion and use them throughout our project. Click [here](https://reactjs.org/docs/introducing-jsx.html) for further reading.

---

**Tip**: The project repository has some pre-commit hooks that will automatically a linter again every javascript file that is about to be commited to git history. The `eslint` linter is quite picky but ensures a consistent coding style across the project. So let's all stick to and keep the code readable. Not all but some glitches can be fitched automatically inplace with manual intervention. The following `alias`

        alias ae='./node_modules/eslint/bin/eslint.js --fix'

allows to automatically fix many issues when run from the root of the project like so

        ae app/components/<ComponentName>/<script.js>


It will all issues it can fix by itself and report any remaining ones.

---

### Redux Quickstart

As apps or even parts of apps grow more complex in functionality storing and keeping track of the apps state becomes crucial. The recommended way of managing state in this project is [redux](https://redux.js.org/) which stores the whole app state in one central store object. There are many great online discussions on best practices. The learning curve can be a little steep initially. Fully, subscribing to learning by doing, we will simply do a quick start type guide touching upon all essential steps in setting up a `action -> reducer -> props` cycle. We assume that we created a container with

        npm run generate container

with setting as follows:

      ? What should it be called? TestContainer
      ? Select a base component: Component
      ? Do you want headers? No
      ? Do you want an actions/constants/selectors/reducer tuple for this container? Yes
      ? Do you want sagas for asynchronous flows? (e.g. fetching data) No
      ? Do you want i18n messages (i.e. will this component use text)? No
      ? Do you want Material UI styling? Yes

The basic steps for every user interaction are as follows:

- identify user action
- declare a corresponding constant in `./constants.js`
- declare a payload action in `./actions.js` to filter the state changing information 
- declare a reducer that describes how the payload interaction changes the corresponding app state in `./reducers.js`
- hook the container reducer into the global app store in `/app/reducers.js`.

The first step is to identify every user action as starting point for changing the app state.



### Styling


For websites the established way of declaring how the interface looks is very efficienly done with CSS. One main goal here is to keep content and presentation apart. Using the Material UI a lot of styling automatically gives a consistent look. If custom styling becomes necessary, the Material UI still provides a very nice way of concisely using a CSS Style syntax for every component while keeping the content apart from its presentation or styling. The recommended way is as follows:

In the `import` section at the top of a component we import the styling wrapper

    import { withStyles } from 'material-ui/styles';

Below the imports but above the `React.Component` we declare custom styles using classes like so

    const styles = (theme) => ({
      <customClassName>: {
        color: '#fff',
        textDecoration: 'underline',
        [theme.breakpoints.down('lg')]: {
          visibility: 'hidden',
          display: 'none',
        },
        ...
      }
    })


The sub-block containing `theme.breakpoints.down('...')` demonstrates
how to make styling different depending on screen size. This can be quite
handy to make the app **responsive**, which means no less that the user interface
is usable on every screen size (e.g. desktop, tablet, mobile, TV.)

Having defined such a style named `<customClassName>` we can assign it to any JSX block like, so:

      <div className={this.props.classes.<CustomClassName>}>
      ...
      </div>


Now there are only to minor changes left. First we declare the classes prop type.

      ExampleComponent.propTypes = {
        classes: PropTypes.object,
      }

Second, we tie the newly defined styles to component

      export default withStyles(styles, { withTheme: true })(ExampleComponent);


