const { expect } = require('chai');
const { isEqual, isObject, transform } = require('lodash');

const Artifact = require('../../src/models/artifact');
const testEmptyPublishableLibrary = require('./fixtures/artifact/Library-Test-Empty-Artifact');
const testPublishableLibraryWithDates = require('./fixtures/artifact/Library-Test-Artifact-With-Dates');
const testPublishableLibraryWithDatesAndContext = require('./fixtures/artifact/Library-Test-Artifact-With-Dates-And-Context');
const testPublishableLibrary = require('./fixtures/artifact/Library-Test-CPG-Export');
const testExpandedContext = require('./fixtures/artifact/Library-Test-Expanded-Context');

describe('Artifact', () => {
  describe('#validate', () => {
    // There isn't much to test, so just check it validates without errors
    it('should validate without errors', done => {
      const artifact = new Artifact({ name: 'Empty Artifact' });
      expect(artifact.name).to.equal('Empty Artifact');
      artifact.validate(err => {
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('#toPublishableLibrary', () => {
    //function below referenced from https://gist.github.com/Yimiprod/7ee176597fef230d1451
    //using to diff two objects, as _.isEqual returns false if array elements are not in the same order
    /**
     * Deep diff between two object, using lodash
     * @param  {Object} object Object compared
     * @param  {Object} base   Object to compare with
     * @return {Object}        Return a new object who represent the diff
     */
    function difference(object, base) {
      function changes(object, base) {
        return transform(object, function (result, value, key) {
          if (!isEqual(value, base[key])) {
            result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
          }
        });
      }
      return changes(object, base);
    }

    it('should create an empty CPG Artifact and export as a Publishable Library', () => {
      //create a CPG artifact with fields defined above
      const testEmptyArtifact = new Artifact({
        name: 'Test Empty Artifact'
      });
      //convert it to a publishable library JSON object
      const emptyPL = testEmptyArtifact.toPublishableLibrary();
      //compare it to the known "good" example file
      expect(isEqual(emptyPL, testEmptyPublishableLibrary)).to.equal(true);
    });

    it('should create a CPG Artifact with dates and export as a Publishable Library', () => {
      const testDates = new Artifact({
        name: 'Test Artifact With Dates',
        approvalDate: '2020-09-01T04:00:00.000Z',
        lastReviewDate: '2020-09-10T04:00:00.000Z',
        effectivePeriod: {
          start: '2020-09-12T04:00:00.000Z',
          end: '2020-09-19T04:00:00.000Z'
        }
      });
      const datePL = testDates.toPublishableLibrary();
      expect(isEqual(difference(datePL, testPublishableLibraryWithDates), {})).to.equal(true);
    });

    it('should create a CPG Artifact with context and dates and export as a Publishable Library', () => {
      const testContext = new Artifact({
        name: 'Test Artifact With Dates and Context',
        approvalDate: '2020-09-01T04:00:00.000Z',
        lastReviewDate: '2020-09-10T04:00:00.000Z',
        effectivePeriod: {
          start: '2020-09-12T04:00:00.000Z',
          end: '2020-09-19T04:00:00.000Z'
        },
        context: [
          { gender: 'male', contextType: 'gender' },
          { system: 'RXNORM', code: '435', contextType: 'clinicalFocus' }
        ]
      });
      const contextPL = testContext.toPublishableLibrary();
      expect(isEqual(difference(contextPL, testPublishableLibraryWithDatesAndContext), {})).to.equal(true);
    });

    it('should create a mostly complete CPG Artifact and export as a Publishable Library', () => {
      const testArtifact = new Artifact({
        name: 'Test CPG Export',
        version: '1.0.0',
        description: 'An artifact for testing CPG Publishable Libraries',
        url: 'https://test.hl7.test',
        status: 'draft',
        experimental: true,
        publisher: 'NULL Publishing',
        context: [
          { gender: 'male', contextType: 'gender' },
          { system: 'RXNORM', code: '435', contextType: 'clinicalFocus' }
        ],
        purpose: 'Testing purposes.',
        usage: 'Only use for testing.',
        strengthOfRecommendation: { strengthOfRecommendation: 'strong', code: '', system: '' },
        qualityOfEvidence: { qualityOfEvidence: 'high', code: '', system: '' },
        copyright: 'NULL',
        approvalDate: '2020-09-01T04:00:00.000Z',
        lastReviewDate: '2020-09-10T04:00:00.000Z',
        effectivePeriod: {
          start: '2020-09-12T04:00:00.000Z',
          end: '2020-09-19T04:00:00.000Z'
        },
        topic: [{ system: 'RXNORM', code: '435' }],
        author: [{ author: 'Mr. Tester' }, { author: 'Ms. Tester (no relation)' }],
        reviewer: [{ reviewer: 'Dr. Reviewer' }],
        endorser: [],
        relatedArtifact: [
          {
            citation: 'Journal of Testing Artifacts, 2020',
            url: 'https://test.test.test',
            description: 'This citation is fictional purely for the use of testing.',
            relatedArtifactType: 'citation'
          }
        ]
      });
      const cpgPL = testArtifact.toPublishableLibrary();
      expect(isEqual(difference(cpgPL, testPublishableLibrary), {})).to.equal(true);
    });

    it('should create a mostly complete CPG Artifact with expanded context and export as a Publishable Library', () => {
      const testCtxArtifact = new Artifact({
        name: 'Testing CPG Context',
        version: '1.0.0',
        context: [
          {
            system: 'LOINC',
            code: '80350-2',
            contextType: 'species'
          },
          {
            gender: 'female',
            contextType: 'gender'
          },
          {
            ageRangeUnitOfTime: 'weeks',
            ageRangeMax: '5',
            ageRangeMin: '1',
            contextType: 'ageRange'
          },
          {
            contextType: 'userType',
            userType: 'user-101Y00000X'
          },
          {
            contextType: 'workflowSetting',
            workflowSetting: 'inpatientEncounter'
          },
          {
            contextType: 'workflowTask',
            workflowTask: 'ALLERLREV'
          },
          {
            contextType: 'clinicalVenue',
            clinicalVenue: 'ECHO'
          },
          {
            contextType: 'program',
            program: '?'
          },
          {
            contextType: 'clinicalFocus',
            code: '435',
            system: 'RXNORM'
          }
        ],
        lastReviewDate: '2020-08-28T04:00:00.000+00:00',
        effectivePeriod: { start: '2020-08-26T04:00:00.000+00:00' },
        author: [{ author: 'Original Author' }],
        reviewer: [{ reviewer: 'The Reviewer' }],
        endorser: [{ endorser: 'Endorser 1' }, { endorser: 'Endorser II' }],
        relatedArtifact: [
          {
            citation: 'NULL',
            url: 'https://test.test.test',
            description: 'Test Description',
            relatedArtifactType: 'citation'
          }
        ]
      });
      const ecPL = testCtxArtifact.toPublishableLibrary();
      expect(isEqual(difference(ecPL, testExpandedContext), {})).to.equal(true);
    });
  });
});
