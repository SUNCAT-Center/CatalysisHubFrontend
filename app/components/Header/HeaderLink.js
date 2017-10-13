import { Link } from 'react-router';
import styled from 'styled-components';

export default styled(Link)`
  display: inline-flex;
  padding: 0.25em 2em;
  margin: .3em;
  text-decoration: none;
  border-radius: 0px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 11px;
  border: 2px solid #41ADDD;
  color: #41ADDD;
  
  &:active {
    background: #41ADDD;
    color: #FFF;
  }
`;
