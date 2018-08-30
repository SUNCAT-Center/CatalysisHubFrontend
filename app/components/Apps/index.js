/**
 *
 * Apps
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Slide from 'material-ui/transitions/Slide';

import { apps } from 'utils/constants';

import FilteredApps from './filteredApps';
import { styles } from './styles';


class Apps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={this.props.classes.AppWrapper} >

        <Slide
          in
          mountOnEnter
          unmountOnExit
          direction="left"
        >
          <div>
            <FilteredApps
              title="Browse"
              apps={apps} filter={[
                'Surface Reactions',
                'Profiles',
                'Publications',
                'GraphQL API',
              ]}
            />

            <FilteredApps
              title="Analyze"
              apps={apps} filter={[
                'Activity Maps',
                'CatLearn',
                'Pourbaix Diagrams',
                'Prototype Search',
                'Scaling Relations',
              ]}
            />
            <FilteredApps
              title="Create"
              apps={apps} filter={[
                'Wyckoff Bulk Generator',
                'CatKit Slab Generator',
              ]}
            />

            <FilteredApps
              title="Contribute"
              apps={apps} filter={[
                'Upload Datasets',
                'Your Next App ...',
              ]}
            />

          </div>
        </Slide>
      </div>
    );
  }
}

Apps.propTypes = {
  classes: PropTypes.object,

};

export default withStyles(styles, { withTheme: true })(Apps);
