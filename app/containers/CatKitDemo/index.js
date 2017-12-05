/*
 *
 * CatKitDemo
 *
 */

import React from 'react';
import { connect } from 'react-redux';


import BulkInput from './BulkInput';
import { BulkView } from './BulkView';
import { SlabInput } from './SlabInput';
import { SlabView } from './SlabView';

export class CatKitDemo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <BulkInput {...this.props} />
        <BulkView {...this.props} />
        <SlabInput {...this.props} />
        <SlabView {...this.props} />
      </div>
    );
  }
}

CatKitDemo.propTypes = {
  /* dispatch: PropTypes.func.isRequired,*/
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CatKitDemo);
