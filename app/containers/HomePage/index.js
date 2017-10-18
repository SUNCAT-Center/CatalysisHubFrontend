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

import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import PeriodicTable from 'containers/PeriodicTableSelector';
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
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'CatApp Browser' },
          ]}
        />
        <div>
          <CenteredSection>
            <H1>
              <FormattedMessage {...messages.startProjectHeader} />
            </H1>
          </CenteredSection>
          <Section>
            <PeriodicTable />
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
