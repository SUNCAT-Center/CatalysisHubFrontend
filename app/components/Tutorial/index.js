/**
*
* Tutorial
*
*/

import React from 'react';
import { withStyles } from 'material-ui/styles';
import Markdown from 'markdown-to-jsx';

import tutorial from './tutorial.md';


const styles = () => ({
});


class Tutorial extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Markdown>
          {tutorial}
        </Markdown>
      </div>
    );
  }
}

Tutorial.propTypes = {

};


export default withStyles(styles, { withTheme: true })(Tutorial);
