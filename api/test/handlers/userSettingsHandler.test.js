// Instead of deleting this, I have fully commented it out in case we need to
// test a handler individually (since I spent some time figuring it out).
// For now, however, we have decided to test the full routes using supertest.

// const sandbox = require('sinon').createSandbox();
// const { mock } = sandbox;
// const { expect } = require('chai');
// const UserSettingsHandler = require('../../src/handlers/userSettingsHandler');
// const UserSettings = require('../../src/models/userSettings');

// class FakeResponse {
//   constructor() {
//     this.store = { headers: {} };
//     this.sent = {};
//   }

//   json(json) {
//     return this.send(json);
//   }

//   send(body) {
//     if (body != null) {
//       this.store.body = body;
//     }
//     if (this.store.statusCode == null) {
//       this.store.statusCode = 200;
//     }
//     this.sent = Object.assign({}, this.store)
//     return this;
//   }

//   sendStatus(status) {
//     this.store.statusCode = status;
//     return this.send();
//   }

//   setHeader(name, value) {
//     this.store.headers[name] = value;
//     return this;
//   }

//   status(status) {
//     this.store.statusCode = status;
//     return this;
//   }
// }

// describe('userSettingsHandler', () => {
//   beforeEach(() => sandbox.restore());
//   describe('#get', () => {
//     it('should return settings for authenticated users with settings', () => {
//       sandbox.replace(
//         UserSettings,
//         'find',
//         mock('find')
//           .withArgs({ user: 'bob' })
//           .yields(null, [{ user: 'bob', termsAcceptedDate: '2023-04-05' }])
//       );
//       const req = { user: { uid: 'bob' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.get(req, res);
//       expect(res.sent.statusCode).to.eq(200);
//       expect(res.sent.body).to.eql({ termsAcceptedDate: '2023-04-05' });
//     });

//     it('should return HTTP 500 if there is an error finding', () => {
//       sandbox.replace(UserSettings, 'find', mock('find').withArgs({ user: 'bob' }).yields('Connection Error'));
//       const req = { user: { uid: 'bob' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.get(req, res);
//       expect(res.sent.statusCode).to.eq(500);
//       expect(res.sent.body).to.eq('Connection Error');
//     });

//     it('should return HTTP 404 for authenticated users without settings', () => {
//       sandbox.replace(UserSettings, 'find', mock('find').withArgs({ user: 'bob' }).yields(null, []));
//       const req = { user: { uid: 'bob' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.get(req, res);
//       expect(res.sent.statusCode).to.eq(404);
//     });

//     it('should return HTTP 500 for authenticated users with multiple settings', () => {
//       sandbox.replace(
//         UserSettings,
//         'find',
//         mock('find')
//           .withArgs({ user: 'bob' })
//           .yields(null, [
//             { user: 'bob', termsAcceptedDate: '2023-04-05' },
//             { user: 'bob', termsAcceptedDate: '2023-06-01' }
//           ])
//       );
//       const req = { user: { uid: 'bob' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.get(req, res);
//       expect(res.sent.statusCode).to.eq(500);
//     });

//     it('should return HTTP 401 for unauthenticated users', () => {
//       const req = {};
//       const res = new FakeResponse();
//       UserSettingsHandler.get(req, res);
//       expect(res.sent.statusCode).to.eq(401);
//       expect(res.sent.headers['WWW-Authenticate']).to.eql('FormBased');
//     });
//   });

//   describe('#put', () => {
//     it('should upsert settings for authenticated users', () => {
//       sandbox.replace(
//         UserSettings,
//         'findOneAndUpdate',
//         mock('findOneAndUpdate')
//           .withArgs({ user: 'bob' }, { $set: { termsAcceptedDate: '2023-04-05' } }, { upsert: true, new: true })
//           .yields(null, { user: 'bob', termsAcceptedDate: '2023-04-05' })
//       );
//       const req = { user: { uid: 'bob' }, body: { termsAcceptedDate: '2023-04-05' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.put(req, res);
//       expect(res.sent.statusCode).to.eq(200);
//       expect(res.sent.body).to.eql({ termsAcceptedDate: '2023-04-05' });
//     });

//     it('should return HTTP 500 if there is an error upserting', () => {
//       sandbox.replace(
//         UserSettings,
//         'findOneAndUpdate',
//         mock('findOneAndUpdate')
//           .withArgs({ user: 'bob' }, { $set: { termsAcceptedDate: '2023-04-05' } }, { upsert: true, new: true })
//           .yields('Connection Error')
//       );
//       const req = { user: { uid: 'bob' }, body: { termsAcceptedDate: '2023-04-05' } };
//       const res = new FakeResponse();
//       UserSettingsHandler.put(req, res);
//       expect(res.sent.statusCode).to.eq(500);
//       expect(res.sent.body).to.eq('Connection Error');
//     });

//     it('should return HTTP 401 for unauthenticated users', () => {
//       const req = {};
//       const res = new FakeResponse();
//       UserSettingsHandler.put(req, res);
//       expect(res.sent.statusCode).to.eq(401);
//       expect(res.sent.headers['WWW-Authenticate']).to.eql('FormBased');
//     });
//   });
// });
