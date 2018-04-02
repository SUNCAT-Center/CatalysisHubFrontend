/*
 *
 * ScalingRelationsPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import Input from './Input';

export class ScalingRelationsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h2>Scaling Relations</h2>
        <Input {...this.props} />
        <div>
        Currently under construction.
        </div>
      </div>
    );
  }
}

ScalingRelationsPage.propTypes = {
};

const mapStateToProps = () => ({

});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ScalingRelationsPage);
