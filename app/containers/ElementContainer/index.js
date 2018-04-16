/*
 *
 * ElementContainer
 *
 */

import { connect } from 'react-redux';

import ElementBox from 'components/ElementBox';
import * as actions from 'containers/PeriodicTableSelector/actions';

const mapStateToProps = (state) => ({
  selection: state.get('periodicTableSelector').selection,
});

const mapDispatchToProps = (dispatch) => (
  {
    clickElement: (key) => {
      dispatch(actions.clickElement(key));
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ElementBox);
