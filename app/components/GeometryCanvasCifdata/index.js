/**
 *
 * GeometryCanvasCifdata
 *
 */

import { compose } from 'recompose';
import React from 'react';
import _ from 'lodash';
import PropTypes, { instanceOf } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
/* import Button from 'material-ui/Button';*/
/* import Chip from 'material-ui/Chip';*/
/* import AddIcon from 'material-ui-icons/Add';*/
/* import RemoveIcon from 'material-ui-icons/Remove';*/
import { Md3dRotation } from 'react-icons/lib/md';
import { withCookies, Cookies } from 'react-cookie';

import { isMobile } from 'react-device-detect';

import * as actions from 'components/GeometryCanvasWithOptions/actions';
import { styles } from './styles';

const jQuery = require('jquery');
window.jQuery = jQuery;
const { ChemDoodle } = require('utils/ChemDoodleWeb'); // eslint-disable-line no-unused-vars

const initialState = {
  rotationMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.3],
};

class GeometryCanvasCifdata extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      orientation: 'test orientation',
      perspective: (this.props.cookies.get('perspective') === 'true'),
      tiltToRotate: (this.props.cookies.get('tiltToRotate') === 'true'),
    };
    /* this.downloadStructure = this.downloadStructure.bind(this);*/
  }

  componentDidMount() {
    const script = document.createElement('script');
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
  /*var rotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.3]*/
  /*rotationMatrix = ChemDoodle.lib.mat4.rotate(rotationMatrix, -.8, [1,0,0]);*/
  /*rotationMatrix = ChemDoodle.lib.mat4.rotate(rotationMatrix, +.1, [0,0,1]);*/

  if(typeof cif_${this.props.uniqueId} === 'undefined' ) {
   let cif_${this.props.uniqueId} 
  }
  if(typeof tfcanvas_${this.props.uniqueId} === 'undefined' ) {
   let tfcanvas_${this.props.uniqueId} 
  }
  //Code
  tfcanvas_${this.props.uniqueId} = new ChemDoodle.TransformCanvas3D('${this.props.id}_view');
  document.getElementById("${this.props.id}_view").tfcanvas = tfcanvas_${this.props.uniqueId};
  cif_${this.props.uniqueId} = ChemDoodle.readCIF(\`${this.props.cifdata}\`,  ${this.props.x}, ${this.props.y}, ${this.props.z});
  if (typeof alpha_${this.props.uniqueId} === 'undefined') {
  let alpha_${this.props.uniqueId} = 0.; 
  }
  if (typeof beta_${this.props.uniqueId} === 'undefined') {
  let beta_${this.props.uniqueId} = 0.; 
  }
  if (typeof gamma_${this.props.uniqueId} === 'undefined') {
  let gamma_${this.props.uniqueId} = 0.;
  }

  if(typeof altLabels === 'undefined') {
    var altLabels
  }
  altLabels = ${JSON.stringify(this.props.altLabels)};
  cif_${this.props.uniqueId}.molecule.atoms.map(function(atom, i){
    if(altLabels.hasOwnProperty(i)) {
    atom.altLabel = altLabels[i];
    }
  });


  /*tfcanvas_${this.props.uniqueId}.specs.set3DRepresentation('Line');*/
  /*tfcanvas_${this.props.uniqueId}.specs.set3DRepresentation('Stick');*/
  /*tfcanvas_${this.props.uniqueId}.specs.set3DRepresentation('Wireframe');*/
  /*tfcanvas_${this.props.uniqueId}.specs.set3DRepresentation('van der Waals Spheres');*/
  tfcanvas_${this.props.uniqueId}.specs.set3DRepresentation('Ball and Stick');

  tfcanvas_${this.props.uniqueId}.specs.backgroundColor = '${this.props.color}';
  tfcanvas_${this.props.uniqueId}.specs.projectionPerspective_3D = ${this.props.perspective};
  tfcanvas_${this.props.uniqueId}.specs.compass_display = true;
  tfcanvas_${this.props.uniqueId}.specs.compass_size_3D = 50;
  tfcanvas_${this.props.uniqueId}.specs.atoms_displayLabels_3D = true;
  tfcanvas_${this.props.uniqueId}.specs.crystals_unitCellLineWidth = 5;
  tfcanvas_${this.props.uniqueId}.specs.shapes_color = 'black';
  tfcanvas_${this.props.uniqueId}.specs.shapes_lineWidth = 1;
  tfcanvas_${this.props.uniqueId}.loadContent([cif_${this.props.uniqueId}.molecule], [cif_${this.props.uniqueId}.unitCell]);
  tfcanvas_${this.props.uniqueId}.rotationMatrix = [${this.props.rotationMatrix}] || [${this.state.rotationMatrix}] || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.3];
  tfcanvas_${this.props.uniqueId}.updateScene()

  if(${this.state.tiltToRotate}) {
  window.addEventListener('deviceorientation', (e) => {

  /*ALPHA*/
  /*if(typeof alpha_${this.props.uniqueId} !== 'undefined') {*/
    /*if(.01 < Math.abs(alpha_${this.props.uniqueId} - e.alpha) < 1.5) {*/
    /*tfcanvas_${this.props.uniqueId}.rotationMatrix = ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.uniqueId}.rotationMatrix,(e.alpha -  alpha_${this.props.uniqueId}) * 0.015,  tfcanvas_${this.props.uniqueId}.rotationMatrix.slice(8, 11));*/
    /*}*/
  /*}*/

  /*GAMMA*/
  /*if (typeof gamma_${this.props.uniqueId} !== 'undefined') {*/
    /*if(.01 < Math.abs(gamma_${this.props.uniqueId} - e.gamma) < 1.5) {*/
  /*tfcanvas_${this.props.uniqueId}.rotationMatrix = ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.uniqueId}.rotationMatrix,(e.gamma -  gamma_${this.props.uniqueId}) * 0.015,  tfcanvas_${this.props.uniqueId}.rotationMatrix.slice(8, 11));*/
    /*}*/
  /*}*/

  /*BETA*/
  if (typeof beta_${this.props.uniqueId} !== 'undefined') {
    if(0.01 < Math.abs(beta_${this.props.uniqueId} - e.beta) < 1.5) {
  tfcanvas_${this.props.uniqueId}.rotationMatrix =  ChemDoodle.lib.mat4.rotate(tfcanvas_${this.props.uniqueId}.rotationMatrix, -(e.beta -  beta_${this.props.uniqueId}) * 0.015,  [1, 0, 0]);
    }
  }

  alpha_${this.props.uniqueId} = e.alpha;
  beta_${this.props.uniqueId} = e.beta;
  gamma_${this.props.uniqueId} = e.gamma;
   tfcanvas_${this.props.uniqueId}.updateScene()

  }, true)
  }
  ;
    `;
    const item = document.getElementById(`${this.props.id}_view`);

    item.appendChild(script);
    this.props.saveCanvas(item.tfcanvas);


    document.addEventListener('mouseup', (() => {
      const nonUnity = !_.isEqual(item.tfcanvas.rotationMatrix, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      const nonOld = !_.isEqual(item.tfcanvas.rotationMatrix, this.props.rotationMatrix);

      if (nonUnity && nonOld) {
        this.props.setRotationMatrix(
        item.tfcanvas.rotationMatrix
      );
      }
    }));
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.componentDidMount();
  }
  /* downloadStructure() {*/
  /* axios.get(url, params).then((response) => {*/
  /* const tempUrl = window.URL.createObjectURL(new Blob([response.data]));*/
  /* const link = document.createElement('a');*/
  /* link.href = tempUrl;*/
  /* link.setAttribute('download', `dft_input_${(new Date()).getTime()}.zip`);*/
  /* document.body.appendChild(link);*/
  /* link.click();*/
  /* }).catch(() => {*/
  /* });*/
  /* }*/
  render() {
    return (
      <div>
        {(isMobile === false || this.state.tiltToRotate === false) ? null : <div> <Md3dRotation />{'\u00A0\u00A0'} Tilt phone to rotate.</div> }
        <Paper height={14}>
          <p id={`${this.props.id}_script`} >
            <canvas
              id={`${this.props.id}_view`}
              height={this.props.height}
              width={this.props.width}
              style={{
                borderWidth: this.props.borderWidth,
                borderColor: '#000000',
                borderStyle: 'solid',
              }}
            />
          </p>
        </Paper>
        {/*
        <Button
          raised
          className={this.props.classes.button}
        >
          <MdFullscreen /> Fullscreen
        </Button>
        <Button
          raised
          color="primary"
          className={this.props.classes.button}
          onClick={this.downloadStructure}>
          <MdFileDownload /> Download
        </Button>
        */}
      </div>
    );
  }
}
GeometryCanvasCifdata.defaultProps = {
  height: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  width: Math.max(Math.min(window.innerWidth * 0.5, 600), 300),
  color: '#fff',
  cifdata: '',
  cifurl: '',
  x: 2,
  y: 2,
  z: 1,
  borderWidth: 0,
  altLabels: {},
  perspective: true,
  tiltToRotate: true,
};

GeometryCanvasCifdata.propTypes = {
  uniqueId: PropTypes.string.isRequired,
  cifdata: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  rotationMatrix: PropTypes.array,
  setRotationMatrix: PropTypes.func,
  saveCanvas: PropTypes.func,
  borderWidth: PropTypes.number,
  altLabels: PropTypes.object,
  perspective: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  tiltToRotate: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  cookies: instanceOf(Cookies).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setRotationMatrix: (x) => {
    dispatch(actions.setRotationMatrix(x));
  },
  saveCanvas: (x) => {
    dispatch(actions.saveCanvas(x));
  },
});

const mapStateToProps = (state) => ({
  rotationMatrix: state.get('geometryCanvasReducer').rotationMatrix,
});

export default compose(
  withStyles(styles, { withTheme: true }),
  withCookies,
  connect(mapStateToProps, mapDispatchToProps)
)(GeometryCanvasCifdata);
