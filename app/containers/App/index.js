/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Flexbox from 'flexbox-react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';

import Paper from 'material-ui/Paper';

const AppWrapper = styled.div`
  max-width: calc(1200px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

const suBranding = true;
const boldFooterWeight = 500;
const lightFooterWeight = 200;

export function App(props) {
  return (
    <div>
      {suBranding === false ? null :
      <div id="brandbar">
        <div className="container">
          <a href="http://www.stanford.edu" style={{ margin: 60 }}>
            <img src="https://www.stanford.edu/su-identity/images/brandbar-stanford-logo@2x.png" alt="Stanford University" width="152" height="23" />
          </a>
        </div>
      </div>
      }

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
            link={suBranding === false ? [] : [
              { rel: 'stylesheet', href: 'https://www.stanford.edu/su-identity/css/su-identity.css' },
              { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,200' },
            ]}
          />
          <Header />
          {React.Children.toArray(props.children)}
        </Paper>
        <Footer />
      </AppWrapper>
      {suBranding === false ? null :
      <div>
        <Flexbox id="global-footer" flexDirection="column" justifyContent="space-around">
          <Flexbox flexDirection="row" justifyContent="space-around">
            <Flexbox flexDirection="column" justifyContent="space-around">
              <Flexbox flexDirection="row" justifyContent="space-around">
                <Flexbox width="25vh" />
                <Flexbox flexDirection="column" justifyContent="center">
                  <Flexbox>
                    <a href="http://www.stanford.edu">
                      <img src="https://www.stanford.edu/su-identity/images/footer-stanford-logo@2x.png" alt="Stanford University" width="105" height="49" />
                    </a>
                  </Flexbox>
                </Flexbox>
                <Flexbox width="10vh" />

                <Flexbox flexDirection="column" justifyContent="space-around">
                  <Flexbox height="10vh" />
                  <Flexbox
                    id="bottom-text"
                    className="span10"
                    height="5vh"
                    style={{
                      fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                    }}
                  >
                    <ul >
                      <li className="home"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu">Stanford Home</a></li>
                      <li className="maps alt"><a style={{ fontWeight: boldFooterWeight }} href="http://visit.stanford.edu/plan/maps.html">Maps &amp; Directions</a></li>
                      <li className="search-stanford"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu/search/">Search Stanford</a></li>
                      <li className="terms alt"><a style={{ fontWeight: boldFooterWeight }} href="http://www.stanford.edu/site/terms.html">Terms of Use</a></li>
                      <li className="emergency-info"><a style={{ fontWeight: boldFooterWeight }} href="http://emergency.stanford.edu">Emergency Info</a></li>
                    </ul>
                  </Flexbox>
                  <Flexbox height="1vh" />
                  <Flexbox className="clear">
                    <p
                      className="copyright vcard"
                      style={{
                        margin: 0,
                        fontFamily: ['Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                        fontWeight: lightFooterWeight,
                      }}
                    >&copy; <span className="fn org">Stanford University</span>.&nbsp;&nbsp;<span className="adr"> <span className="locality">Stanford</span>, <span className="region">California</span> <span className="postal-code">94305</span></span>.&nbsp;&nbsp;
                      <span id="copyright-complaint"></span>
                    </p>
                  </Flexbox>
                  <Flexbox height="20vh" />
                </Flexbox>
              </Flexbox>
            </Flexbox>
            <Flexbox width="10vh" />
          </Flexbox>
        </Flexbox>
      </div>
      }
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);
