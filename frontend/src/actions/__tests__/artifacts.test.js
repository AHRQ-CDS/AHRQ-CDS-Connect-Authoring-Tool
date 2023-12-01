import _ from 'lodash';
import nock from 'nock';

import * as actions from '../artifacts';
import * as types from '../types';
import { mockArtifact } from 'mocks/artifacts';

describe('artifact actions', () => {
  afterAll(() => nock.restore());

  // ----------------------- UPDATE ARTIFACT ------------------------------- //
  describe('update artifact', () => {
    it('should create an action to update an artifact', () => {
      const artifactToUpdate = mockArtifact;
      const props = { id: 2 };
      const artifact = { ...mockArtifact, id: 2 };
      const librariesInUse = [];

      const expectedAction = {
        type: types.UPDATE_ARTIFACT,
        artifact,
        librariesInUse
      };

      actions.updateArtifact(
        artifactToUpdate,
        props
      )(response => {
        expect(response).toEqual(expectedAction);
      });
    });

    it('should create an action to load an artifact', () => {
      const artifactToUpdate = mockArtifact;
      const artifact = { ...mockArtifact };
      const librariesInUse = [];

      const expectedAction = { type: types.LOAD_ARTIFACT, artifact, librariesInUse };

      return actions.loadArtifact(artifactToUpdate)(response => {
        expect(response).toEqual(expectedAction);
      });
    });
  });

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  describe('save artifact', () => {
    it('should create an action saying the artifact was saved', () => {
      const mockArtifactWithoutId = _.cloneDeep(mockArtifact);
      mockArtifactWithoutId._id = null;

      nock('http://localhost').post('/authoring/api/artifacts').reply(200, mockArtifactWithoutId);

      const expectedAction = { type: types.SAVE_ARTIFACT_SUCCESS, artifact: mockArtifactWithoutId };

      actions.artifactSaved(mockArtifactWithoutId)(response => {
        expect(response).toEqual(expectedAction);
      });
    });
  });
});
