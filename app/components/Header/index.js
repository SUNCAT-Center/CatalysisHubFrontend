import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import Button from 'material-ui/Button';

import { appBar } from 'utils/constants';

import Img from './Img';
import NavBar from './NavBar';
// import HeaderLink from './HeaderLink';
import Banner from './banner.png';
import messages from './messages';
import HeaderBar from './HeaderBar';


// import DrawerBar from 'components/DrawerBar';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <HeaderBar>
        <Link to="/">
          <Img height="100px" src={Banner} alt="react-boilerplate - Logo" />
        </Link>
        { appBar ? null :
        <NavBar
          style={{
            marginTop: '15px',
          }}
        >
          <Link to="/energies">
            <Button color="primary" >
              <FormattedMessage {...messages.energies} />
            </Button>
          </Link>


          <Link to="/generalSearch">
            <Button color="primary" >
              <FormattedMessage {...messages.generalSearch} />
            </Button>
          </Link>


          <Link to="/activityMaps">
            <Button color="primary" >
              <FormattedMessage {...messages.activityMaps} />
            </Button>
          </Link>


          <Link to="/scalingRelations">
            <Button color="primary" >
              <FormattedMessage {...messages.scalingRelations} />
            </Button>
          </Link>


          <Link to="/pourbaixDiagrams">
            <Button color="primary" >
              <FormattedMessage {...messages.pourbaixDiagrams} />
            </Button>
          </Link>


          <Link to="/publications">
            <Button color="primary" >
              <FormattedMessage {...messages.publications} />
            </Button>
          </Link>

          <Link to="/graphQLConsole">
            <Button color="primary" >
              <FormattedMessage {...messages.graphqlconsole} />
            </Button>
          </Link>

          <Link to="/yourNextApp">
            <Button color="primary" >
              <FormattedMessage {...messages.yourNextApp} />
            </Button>
          </Link>


          {/*
          <HeaderLink to="/energies" color="primary">
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
          <HeaderLink to="/publications">
            <FormattedMessage {...messages.publications} />
          </HeaderLink>
          <HeaderLink to="/yourNextApp">
            <FormattedMessage {...messages.yourNextApp} />
          </HeaderLink>
          */}
        </NavBar>
        }
      </HeaderBar>
    );
  }
}

export default Header;
