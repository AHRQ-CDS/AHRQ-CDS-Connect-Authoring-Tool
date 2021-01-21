import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');
axios.defaults.host = 'http://localhost';
