const request = require('supertest');
const sandbox = require('sinon').createSandbox();
const { setupExpressApp, importChaiExpect } = require('../utils');

// NOTE: Most of the data exposed by /config is NOT user-dependent; therefore
// authentication is not required. In normal use, however, the use will be
// authenticated; so we test w/ authentication, but don't worry about testing
// without authentication since no sensitive data is at risk.
describe('Route: /authoring/api/config/templates', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return templates', done => {
      request(app)
        .get('/authoring/api/config/templates')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          const idsAndNames = res.body.map(item => ({ id: item.id, name: item.name }));
          expect(idsAndNames).to.eql([
            { id: 0, name: 'Generic' },
            { id: 1, name: 'Demographics' },
            { id: 2, name: 'Observations' },
            { id: 3, name: 'Operations' },
            { id: 4, name: 'Conditions' },
            { id: 5, name: 'Medications' },
            { id: 6, name: 'Procedures' },
            { id: 7, name: 'Parameters' },
            { id: 8, name: 'Encounters' },
            { id: 9, name: 'Allergy Intolerances' },
            { id: 10, name: 'Base Elements' },
            { id: 11, name: 'List Operations' },
            { id: 12, name: 'External CQL' },
            { id: 13, name: 'Immunizations' },
            { id: 14, name: 'Device' },
            { id: 15, name: 'Service Request' }
          ]);
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/config/valuesets', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return valuesets', done => {
      request(app)
        .get('/authoring/api/config/valuesets')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // I think the only things we still care about are genders and time units
          const genders = res.body.demographics.gender.expansion.map(item => item.id);
          expect(genders).to.eql(['male', 'female', 'other', 'unknown']);
          const timeUnits = res.body.demographics.units_of_time.expansion.map(item => item.id);
          expect(timeUnits).to.eql(['a', 'mo', 'wk', 'd', 'h', 'min', 's']);
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/config/valuesets/:valueset*', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return the specifically requested valueset', done => {
      request(app)
        .get('/authoring/api/config/valuesets/demographics/gender')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          // I think the only things we still care about are genders and time units
          const genders = res.body.expansion.map(item => item.id);
          expect(genders).to.eql(['male', 'female', 'other', 'unknown']);
        })
        .end(done);
    });

    it('should return HTTP 404 for an invalid valueset category', done => {
      request(app)
        .get('/authoring/api/config/valuesets/restaurants/bbq')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should return HTTP 404 for an invalid valueset in a valid category', done => {
      request(app)
        .get('/authoring/api/config/valuesets/demographics/favoritecolor')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });
});

describe('Route: /authoring/api/config/conversions', () => {
  let app, options;

  before(() => {
    [app, options] = setupExpressApp();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return conversions', done => {
      request(app)
        .get('/authoring/api/config/conversions')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(
          [
            {
              name: 'Convert.to_mg_per_dL',
              description: 'mmol/L to mg/dL for blood cholesterol'
            }
          ],
          done
        );
    });
  });
});

describe('Route: /authoring/api/config/query/resources/dstu2', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return DSTU2 resources', done => {
      request(app)
        .get('/authoring/api/config/query/resources/dstu2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          const resourceNames = res.body.resources.map(r => r.name);
          expect(resourceNames).to.include('MedicationOrder'); // DSTU2 only
          expect(resourceNames).not.to.include('MedicationRequest'); // STU3 and R4
          expect(resourceNames).not.to.include('ServiceRequest'); // R4 only
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/config/query/resources/stu3', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return STU3 resources', done => {
      request(app)
        .get('/authoring/api/config/query/resources/stu3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          const resourceNames = res.body.resources.map(r => r.name);
          expect(resourceNames).not.to.include('MedicationOrder'); // DSTU2 only
          expect(resourceNames).to.include('MedicationRequest'); // STU3 and R4
          expect(resourceNames).not.to.include('ServiceRequest'); // R4 only
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/config/query/resources/r4', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return R4 resources', done => {
      request(app)
        .get('/authoring/api/config/query/resources/r4')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          const resourceNames = res.body.resources.map(r => r.name);
          expect(resourceNames).not.to.include('MedicationOrder'); // DSTU2 only
          expect(resourceNames).to.include('MedicationRequest'); // STU3 and R4
          expect(resourceNames).to.include('ServiceRequest'); // R4 only
        })
        .end(done);
    });
  });
});

describe('Route: /authoring/api/config/query/resources/operators', () => {
  let app, options, expect;

  before(async () => {
    [app, options] = setupExpressApp();
    expect = await importChaiExpect();
  });

  afterEach(() => {
    sandbox.restore();
    options.reset();
  });

  describe('GET', () => {
    it('should return resource operators', done => {
      request(app)
        .get('/authoring/api/config/query/resources/operators')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body.implicitConversionInfo).to.exist;
          expect(res.body.operators).to.have.lengthOf(39);
        })
        .end(done);
    });
  });
});
