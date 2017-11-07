/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import { FaDatabase } from 'react-icons/lib/fa';
import View from 'flexbox-react';

import axios from 'axios';
import { graphQLRoot, whiteLabel } from 'utils/constants';


import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  constructor(props) {
    super(props);
    this.state = {
      geometries: 0,
      reactions: 0,
    };
  }

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
    axios.post(graphQLRoot, {
      query: '{catapp { edges { node { id } } }}',
    }).then((response) => {
      this.setState({
        reactions: response.data.data.catapp.edges.length,
      });
    });
    axios.post(graphQLRoot, {
      query: '{systems { edges { node { id } } }}',
    }).then((response) => {
      this.setState({
        geometries: response.data.data.systems.edges.length,
      });
    });
  }

  render() {
    return (
      <article>
        { whiteLabel === true ? null :
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'CatApp Browser' },
          ]}
        />
        }
        <div>
          <CenteredSection>
            {whiteLabel ? null :
            <H1>
              <FormattedMessage {...messages.startProjectHeader} />
            </H1>
            }
          </CenteredSection>
          <Section>
            <View row justifyContent="space-around">
              <View row>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    textAlign: 'center',
                  }}
                >
                  <h3>Reaction Energies</h3>
                  <View row style={{ justifyContent: 'center' }}>
                    <Chip label={this.state.reactions} avatar={<FaDatabase size={24} />} />
                  </View>
                </Paper>
              </View>
              <View row>
                <Paper
                  style={{
                    padding: 25,
                    minWidth: 240,
                    textAlign: 'center',
                    align: 'center',
                  }}
                >
                  <h3>Geometries</h3>
                  <View row style={{ justifyContent: 'center' }}>
                    <Chip label={this.state.geometries} avatar={<FaDatabase size={24} />} />
                  </View>
                </Paper>
              </View>
            </View>
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
