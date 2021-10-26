import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

// Some tests take a long time, depending on the environment.
// Running inside a container in the CI environment can be a particular problem.
jest.setTimeout(60000);

axios.defaults.adapter = require('axios/lib/adapters/http');
axios.defaults.host = 'http://localhost';
