/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';

import Paper from 'material-ui/Paper';

const AppWrapper = styled.div`
  max-width: calc(1048px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

export function App(props) {
  return (
    <AppWrapper>
      <Paper
        style={{
          padding: '40px',
          marginTop: '20px',
        }}
        elevation={2}
      >
        <Helmet
          titleTemplate="%s - CatApp Browser"
          defaultTitle="CatApp Browser"
          meta={[
            { name: 'description', content: 'CatApp Browser' },
          ]}
        />
        <Header />
        {React.Children.toArray(props.children)}
      </Paper>
      <Footer />
    </AppWrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);
