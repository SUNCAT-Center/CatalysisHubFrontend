import React from 'react';

import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import GeometryCanvasWithOptions from 'components/GeometryCanvasWithOptions';

export class SlabView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        { this.props.bulkCif === '' ? null :
        <div>
          <Grid container direction="row" justify="center">
            <Grid item>
              <Grid container justify="flex-start" direction="column">
                {this.props.images.map((image, i) => (
                  <Grid item key={`item_${i}`}>
                    <GeometryCanvasWithOptions
                      cifdata={image}
                      uniqueId={`slab_preview_${i}`}
                      key={`slab_preview_${i}`} id={`slab_preview_${i}`} x={2} y={2} z={1}
                    />
                  </Grid>
                    ))}
              </Grid>
            </Grid>
          </Grid>
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
