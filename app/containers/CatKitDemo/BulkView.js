import React from 'react';

/* import GeometryCanvas from 'components/GeometryCanvas';*/
import GeometryCanvasCifdata from 'components/GeometryCanvasCifdata';
import PropTypes from 'prop-types';

export class BulkView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          <h2>Bulk Structure</h2>
          <GeometryCanvasCifdata
            cifdata={this.props.bulkCif}
            uniqueId="bulk_preview"
            id="bulk_preview"
            x={2} y={2} z={2} ref={(gmCanvas) => { this.gmCanvas = gmCanvas; }}
          />
        </div>
        }
      </div>
    );
  }
}


BulkView.propTypes = {
  bulkCif: PropTypes.string.isRequired,
};

