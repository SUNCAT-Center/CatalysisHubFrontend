// needed for regenerator-runtime
// (ES7 generator support is required by redux-saga)
import 'babel-polyfill';

const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-15');

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
