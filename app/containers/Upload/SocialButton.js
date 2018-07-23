import React from 'react';
import SocialLogin from 'react-social-login';
import PropTypes from 'prop-types';

const Button = ({ children, triggerLogin, ...props }) => (
  <button onClick={triggerLogin} {...props}>
    { children }
  </button>
);

Button.propTypes = {
  triggerLogin: PropTypes.func,
  children: PropTypes.array,

};

export default SocialLogin(Button);
