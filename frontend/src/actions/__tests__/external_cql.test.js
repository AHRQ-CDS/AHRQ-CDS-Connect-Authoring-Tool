import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import _ from 'lodash';

import * as actions from '../external_cql';
import * as types from '../types';

import localModifiers from '../../data/modifiers';
import mockArtifact from '../../mocks/mockArtifact';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const modifierMap = _.keyBy(localModifiers, 'id');
const modifiersByInputType = {};

localModifiers.forEach(modifier => {
  modifier.inputTypes.forEach(inputType => {
    modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
  });
});

// Names used in mockArtifact -  used in multiple tests and never changed
const mockArtifactNames = [
  { name: "Doesn't Meet Inclusion Criteria", id: 'default-subpopulation-1' },
  { name: 'Meets Exclusion Criteria', id: 'default-subpopulation-2' }
];

describe('external cql actions', () => {
  // ----------------------- LOAD EXTERNAL CQL LIST ------------------------ //
  describe('load external cql list', () => {
    it('dispatches a LOAD_EXTERNAL_CQL_LIST_SUCCESS action upon a successful GET of list', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };
      const artifactId = 'abc132';

      nock('http://localhost').get(`/authoring/api/externalCQL/${artifactId}`).reply(200, externalCqlList);

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        }
      ];

      return store.dispatch(actions.loadExternalCqlList(artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_EXTERNAL_CQL_LIST_FAILURE action upon an unsuccessful GET of list', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const artifactId = 'abc132';

      nock('http://localhost')
        .get(`/authoring/api/externalCQL/${artifactId}`)
        .reply(404, function () {
          this.req.response.statusMessage = 'Not found';
          return { status: 404 };
        });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_FAILURE,
          status: 404,
          statusText: 'Not found'
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        }
      ];

      return store.dispatch(actions.loadExternalCqlList(artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('correctly calculates library parents after fetching list', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const artifactId = 'abc132';

      // A list of libraries that has dependencies - used to check the parent library object is built correctly
      const externalCqlList = [
        {
          name: 'My Artifact',
          version: '1',
          details: {
            dependencies: [
              {
                version: '2',
                path: 'CDS_Connect_Conversions_New',
                localIdentifier: 'Convert'
              },
              {
                version: '2.0.0',
                path: 'CDS_Connect_Commons_New',
                localIdentifier: 'C3F'
              },
              {
                version: '2.0.1',
                path: 'FHIRHelpers_New',
                localIdentifier: 'FHIRHelpers'
              }
            ]
          }
        },
        {
          name: 'CDS_Connect_Conversions_New',
          version: '2',
          details: { dependencies: [] }
        },
        {
          name: 'CDS_Connect_Commons_New',
          version: '2.0.0',
          details: {
            dependencies: [
              {
                version: '2.0.1',
                path: 'FHIRHelpers_New',
                localIdentifier: 'FHIRHelpers'
              }
            ]
          }
        },
        {
          name: 'FHIRHelpers_New',
          version: '2.0.1',
          details: { dependencies: [] }
        }
      ];

      // Expected parent relationships based on dependencies defined above
      const expectedParentsOfLibraries = {
        'my-artifact-1': [],
        'cds-connect-conversions-new-2': ['my-artifact-1'],
        'cds-connect-commons-new-2.0.0': ['my-artifact-1'],
        'fhir-helpers-new-2.0.1': ['my-artifact-1', 'cds-connect-commons-new-2.0.0']
      };

      nock('http://localhost').get(`/authoring/api/externalCQL/${artifactId}`).reply(200, externalCqlList);

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries: expectedParentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        }
      ];

      // Confirm the parentsOfLibraries object is created correctly when the list is successfully loaded
      return store.dispatch(actions.loadExternalCqlList(artifactId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- LOAD EXTERNAL CQL LIBRARY DETAILS ------------- //
  describe('library details', () => {
    it('dispatches a LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS action upon successful details request', () => {
      const store = mockStore({});
      const libraryId = 'lib123';
      const externalCqlLibraryDetails = [{ name: 'My Library', details: [] }];

      nock('http://localhost')
        .get(`/authoring/api/externalCQL/details/${libraryId}`)
        .reply(200, externalCqlLibraryDetails);

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST },
        {
          type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_SUCCESS,
          externalCqlLibraryDetails
        }
      ];

      return store.dispatch(actions.loadExternalCqlLibraryDetails(libraryId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE action upon an unsuccessful details request', () => {
      const store = mockStore({});
      const badLibraryId = 'notLib123';

      nock('http://localhost')
        .get(`/authoring/api/externalCQL/details/${badLibraryId}`)
        .reply(404, function () {
          this.req.response.statusMessage = 'Not found';
          return { status: 404 };
        });

      const expectedActions = [
        { type: types.EXTERNAL_CQL_LIBRARY_DETAILS_REQUEST },
        {
          type: types.LOAD_EXTERNAL_CQL_LIBRARY_DETAILS_FAILURE,
          status: 404,
          statusText: 'Not found'
        }
      ];

      return store.dispatch(actions.loadExternalCqlLibraryDetails(badLibraryId)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- ADD EXTERNAL CQL LIBRARY ---------------------- //
  describe('add library', () => {
    it('dispatches ADD_EXTERNAL_CQL_LIBRARY_SUCCESS action upon successful add', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const library = { artifact: mockArtifact };
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL')
        .reply(200, {});

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS, message: '' },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(library)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to CQL-to-ELM errors', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const badLibrary = { artifact: mockArtifact };
      const elmErrors = [{ startLine: 1 }, { startLine: 2 }];
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL')
        .reply(400, elmErrors);

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        {
          type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE,
          status: 400,
          statusText: '',
          data: elmErrors
        },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_SUCCESS action upon an unsuccessful add due to duplicate library', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const badLibrary = { artifact: mockArtifact };
      const dupLibraryText = 'Library with identical name and version already exists.';
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL')
        .reply(200, dupLibraryText);

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        {
          type: types.ADD_EXTERNAL_CQL_LIBRARY_SUCCESS,
          message: dupLibraryText
        },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a ADD_EXTERNAL_CQL_LIBRARY_FAILURE action upon an unsuccessful add due to other errors', () => {
      // An other error could be that the cql-to-elm translator is down.
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const badLibrary = { artifact: mockArtifact };
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .post('/authoring/api/externalCQL')
        .reply(500, 'Internal Server Error');

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.ADD_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        {
          type: types.ADD_EXTERNAL_CQL_LIBRARY_FAILURE,
          status: 500,
          statusText: 'Internal Server Error',
          data: []
        },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.addExternalLibrary(badLibrary)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ------------------------- DELETE EXTERNAL CQL LIBRARY ------------------- //
  describe('delete library', () => {
    it('dispatches a DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS action upon successful delete', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const libraryId = 'lib123';
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .delete(`/authoring/api/externalCQL/${libraryId}`)
        .reply(200);

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_SUCCESS },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a DELETE_EXTERNAL_CQL_LIBRARY_FAILURE action upon failed delete', () => {
      const store = mockStore({
        externalCQL: {
          externalCqlList: []
        }
      });
      const libraryId = 'lib123';
      const externalCqlList = [
        { name: 'My Artifact', version: '1', details: { dependencies: [] } },
        {
          name: 'My other artifact',
          version: '1',
          details: { dependencies: [] }
        }
      ];
      const parentsOfLibraries = {
        'my-artifact-1': [],
        'my-other-artifact-1': []
      };

      nock('http://localhost')
        .put('/authoring/api/artifacts')
        .reply(200, mockArtifact)
        .get('/authoring/api/artifacts')
        .reply(200, [mockArtifact])
        .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
        .reply(200, externalCqlList)
        .get(`/authoring/api/artifacts/${mockArtifact._id}`)
        .reply(200, [mockArtifact])
        .delete(`/authoring/api/externalCQL/${libraryId}`)
        .reply(404, function () {
          this.req.response.statusMessage = 'Not found';
          return { status: 404 };
        });

      const expectedActions = [
        { type: types.SAVE_ARTIFACT_REQUEST },
        { type: types.DELETE_EXTERNAL_CQL_LIBRARY_REQUEST },
        { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifact },
        { type: types.ARTIFACTS_REQUEST },
        {
          type: types.DELETE_EXTERNAL_CQL_LIBRARY_FAILURE,
          status: 404,
          statusText: 'Not found'
        },
        { type: types.EXTERNAL_CQL_LIST_REQUEST },
        { type: types.LOAD_ARTIFACTS_SUCCESS, artifacts: [mockArtifact] },
        {
          type: types.LOAD_EXTERNAL_CQL_LIST_SUCCESS,
          externalCqlList,
          parentsOfLibraries
        },
        { type: types.MODIFIERS_REQUEST },
        {
          type: types.LOAD_MODIFIERS_SUCCESS,
          modifierMap,
          modifiersByInputType
        },
        { type: types.ARTIFACT_REQUEST, id: mockArtifact._id },
        {
          type: types.LOAD_ARTIFACT_SUCCESS,
          artifact: mockArtifact,
          names: mockArtifactNames,
          librariesInUse: []
        },
        { type: types.SET_STATUS_MESSAGE, message: null }
      ];

      return store.dispatch(actions.deleteExternalCqlLibrary(libraryId, mockArtifact)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
