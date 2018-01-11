import React from 'react';

export class AdsorbateInput extends React.Component { // eslint-disable-line react/prefer-stateless-function
  handleChange(name) {
    return (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  render() {
    return (
      <div></div>
    );
  }
}

AdsorbateInput.propTypes = {
};
