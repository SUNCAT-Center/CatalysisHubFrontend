import React from 'react';

import PropTypes from 'prop-types';
import GeometryCanvas from 'components/GeometryCanvas';

export class SlabView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          <h2>Unique Slab Geometries</h2>
          {this.props.images.map((image, i) => (
            <GeometryCanvas cifdata={image} key={`slab_preview_${i}`} id={`slab_preview_${i}`} x={2} y={2} z={1} />
                ))}
        </div>
        }
      </div>
    );
  }
}


SlabView.propTypes = {
  bulkCif: PropTypes.string.isRequired,
  images: PropTypes.array,
};
