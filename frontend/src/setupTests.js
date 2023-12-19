import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import axios from 'axios';

// Some tests take a long time, depending on the environment.
// Running inside a container in the CI environment can be a particular problem.
jest.setTimeout(60000);

// Default waitFor timeout (1000) is not enough for some tests, especially in CI
configure({ asyncUtilTimeout: 5000 });

axios.defaults.adapter = 'http';
axios.defaults.baseURL = 'http://localhost';
