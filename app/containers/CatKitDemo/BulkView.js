import React from 'react';

import GeometryCanvas from 'components/GeometryCanvas';
import PropTypes from 'prop-types';

export class BulkView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          <h2>Bulk Structure</h2>
          <GeometryCanvas cifdata={this.props.bulkCif} id="bulk_preview" x={2} y={2} z={2} ref={(gmCanvas) => { this.gmCanvas = gmCanvas; }} />
        </div>
        }
      </div>
    );
  }
}


BulkView.propTypes = {
  bulkCif: PropTypes.string.isRequired,
};

