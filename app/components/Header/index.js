import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.png';
import messages from './messages';
import HeaderBar from './HeaderBar';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderBar>
        <A href="http://suncat.stanford.edu/">
          <Img height="100px" src={Banner} alt="react-boilerplate - Logo" />
        </A>
        <NavBar>
          <HeaderLink to="/energies">
            <FormattedMessage {...messages.energies} />
          </HeaderLink>
          <HeaderLink to="/activityMaps">
            <FormattedMessage {...messages.activityMaps} />
          </HeaderLink>
          <HeaderLink to="/scalingRelations">
            <FormattedMessage {...messages.scalingRelations} />
          </HeaderLink>
          <HeaderLink to="/pourbaixDiagrams">
            <FormattedMessage {...messages.pourbaixDiagrams} />
          </HeaderLink>
          <HeaderLink to="/generalSearch">
            <FormattedMessage {...messages.generalSearch} />
          </HeaderLink>
        </NavBar>
      </HeaderBar>
    );
  }
}

export default Header;
