import axios from 'axios';
import app from './server';

let server;
const port = process.env.API_PORT || 3001;
const baseurl = `http://localhost:${port}/authoring/api/`;

beforeEach(() => {
  server = app.listen(port);
});

afterEach((done) => {
  server.close();
  done();
});

test.skip('GET /', (done) => {
  axios.get(baseurl).then((res) => {
    expect(res.data.message).toBe('API Initialized!');
    done();
  }).catch(err => console.error(err));
});

test.skip('GET /authoring/api/authors', (done) => {
  axios.get(`${baseurl}authors`).then((res) => {
    expect(res.data).toBeDefined();
    // mock more detailed response?
    done();
  }).catch(err => console.error(err));
});
