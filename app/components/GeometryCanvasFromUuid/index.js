/**
 *
 * GeometryCanvasFromUuid
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import gql from 'graphql-tag';
import { createNetworkInterface, ApolloClient } from 'react-apollo';
import { graphQLRoot } from 'utils/constants';

import Button from 'material-ui/Button';
import { MdFileDownload } from 'react-icons/lib/md';

import { download } from 'utils';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: graphQLRoot,
  }),
});

const MButton = styled(Button)`
  margin: 12px,
`;


class GeometryCanvasFromUuid extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      cifdata: '',
      formula: '',
    };
  }

  componentDidMount() {
    const query = gql`
   query{systems(uniqueId: "${this.props.uuid}") {
  edges {
    node {
    Cifdata
    Formula

    }
  }
}}
    `;

    client.query({ query }).then((response) => {
      const cifdata = response.data.systems.edges[0].node.Cifdata;
      const script = document.createElement('script');
      this.setState({ formula: response.data.systems.edges[0].node.Formula });
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
function _load_lib(url, callback){
  id =  'load_' + url;
  var s = document.createElement('script');
  s.src = url;
  s.id = id;
  s.async = true;
  s.onreadystatechange = s.onload = callback;
  s.onerror = function(){console.warn("failed to load library " + url);};
  document.getElementsByTagName("head")[0].appendChild(s);

}
// Load Libraries
_load_lib("https://code.jquery.com/jquery-3.2.1.min.js", function(){
  _load_lib("http://hub.chemdoodle.com/cwc/8.0.0/ChemDoodleWeb.js", function(){

  var rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

  //Code
  let tfcanvas = new ChemDoodle.TransformCanvas3D('${this.props.uuid}_view');
  let cif = ChemDoodle.readCIF(\`${cifdata}\`, 2, 2, 1);

  tfcanvas.specs.set3DRepresentation('Ball and Stick');
  tfcanvas.specs.backgroundColor = '${this.props.bg_color}';
  tfcanvas.specs.projectionPerspective_3D = true;
  tfcanvas.specs.atoms_displayLabels_3D = true;
  tfcanvas.specs.crystals_unitCellLineWidth = 5;
  tfcanvas.specs.shapes_color = 'black';
  tfcanvas.specs.shapes_lineWidth = 1;
  tfcanvas.specs.fog_mode_3D = 0;
  tfcanvas.specs.shadow_3D = false;
  tfcanvas.specs.atoms_useJMOLColors = true;
  tfcanvas.specs.compass_display = true;
  tfcanvas.loadContent([cif.molecule], [cif.unitCell]);
  });
});`;
      document.getElementById(`${this.props.uuid}_div`).appendChild(script);
    });
  }
  render() {
    return (
      <div>
        <p id={`${this.props.uuid}_script`} />
        <div id={`${this.props.uuid}_div`}></div>
        <canvas
          id={`${this.props.uuid}_view`}
          height={this.props.height}
          width={this.props.width}
          style={{
            borderWidth: 1,
            borderColor: '#000000',
            borderStyle: 'solid',
          }}
        />
        <br />
        <MButton
          raised
          onClick={() => { download(`structure_${this.state.formula}.cif`, this.state.cifdata); }}
          style={{
            margin: 12,
          }}
        >
          <MdFileDownload /> Download CIF
        </MButton>
      </div>
    );
  }
}

GeometryCanvasFromUuid.propTypes = {
  uuid: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  bg_color: PropTypes.string,
};

GeometryCanvasFromUuid.defaultProps = {
  height: 550,
  width: 550,
  bg_color: '#fff',
};


export default GeometryCanvasFromUuid;
