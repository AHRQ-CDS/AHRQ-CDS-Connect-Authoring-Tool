import React from 'react';

import ArtifactModal from '../ArtifactModal';
import { addArtifact, updateAndSaveArtifact } from '../../../actions/artifacts';
import { render, fireEvent, waitFor, userEvent, openSelect } from '../../../utils/test-utils';

const artifactMock = {
  _id: 'artifact2',
  name: 'My Second CDS Artifact',
  version: '1.0.1',
  updatedAt: '2012-11-15T21:26:17Z',
  description: '',
  url: '',
  status: null,
  experimental: null,
  publisher: '',
  context: [],
  purpose: '',
  usage: '',
  copyright: '',
  approvalDate: null,
  lastReviewDate: null,
  effectivePeriod: { start: null, end: null },
  topic: [],
  author: [],
  reviewer: [],
  endorser: [],
  relatedArtifact: []
};

jest.mock('../../../actions/artifacts', () => ({
  __esModule: true,
  addArtifact: jest.fn(),
  updateAndSaveArtifact: jest.fn()
}));

describe('<ArtifactModal />', () => {
  beforeEach(() => {
    addArtifact.mockImplementation(() => ({ type: 'ADD_ARTIFACT'}));
    updateAndSaveArtifact.mockImplementation(() => ({ type: 'UPDATE_AND_SAVE_ARTIFACT' }));
  });
  afterEach(() => jest.clearAllMocks());

  it('does not render the modal if it is not opened', () => {
    const { container } = render(
      <ArtifactModal
        artifactEditing={null}
        showModal={false}
        closeModal={jest.fn()}
      />
    );

    expect(container.querySelector('.element-modal')).toBeEmptyDOMElement();
    expect(document.querySelector('.ReactModalPortal')).toBeEmptyDOMElement();
  });

  it('allows submission and calls closeModal', async () => {
    const closeModal = jest.fn();

    const { getByText } = render(
      <ArtifactModal
        artifactEditing={null}
        showModal={true}
        closeModal={closeModal}
      />
    );

    userEvent.type(document.querySelector('input[name="name"]'), 'NewArtifactName');
    userEvent.type(document.querySelector('input[name="version"]'), 'NewArtifactVersion');
    fireEvent.click(getByText('Create'));

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
    });
  });

  describe('modal title', () => {
    it('displays Create New Artifact for new artifacts', () => {
      const { getByText } = render(
        <ArtifactModal
          artifactEditing={null}
          showModal={true}
          closeModal={jest.fn()}
        />
      );

      expect(getByText('Create New Artifact')).toBeDefined();
    });

    it('displays Edit Artifact Details when editing an artifact', () => {
      const { getByText } = render(
        <ArtifactModal
          artifactEditing={artifactMock}
          showModal={true}
          closeModal={jest.fn()}
        />
      );

      expect(getByText('Edit Artifact Details')).toBeDefined();
    });
  });

  describe('cpg fields', () => {
    it('toggles the CPG tag when the field is filled out', () => {
      const { getByText, getByLabelText } = render(
        <ArtifactModal
          artifactEditing={null}
          showModal={true}
          closeModal={jest.fn()}
        />
      );

      fireEvent.click(getByText('Show CPG Fields'));

      let cpgTag = getByText(/Description/).querySelector('.cpg-tag');
      expect(cpgTag).not.toHaveClass('cpg-tag-complete');

      userEvent.type(getByLabelText(/Description/), 'description');

      cpgTag = getByText(/Description/).querySelector('.cpg-tag');
      expect(cpgTag).toHaveClass('cpg-tag-complete');
    });

    it('can fill out the CPG form', async () => {
      // Increase timeout as this test takes a long time when running in the Docker container
      jest.setTimeout(30000);
      const { getByText, getByLabelText } = render(
        <ArtifactModal
          artifactEditing={null}
          showModal={true}
          closeModal={jest.fn()}
        />
      );

      userEvent.type(document.querySelector('input[name="name"]'), 'NewArtifactName');
      userEvent.type(document.querySelector('input[name="version"]'), 'NewArtifactVersion');
      fireEvent.click(getByText('Show CPG Fields'));
      fireEvent.change(getByLabelText(/Description/), { target: { value: 'NewArtifactDescription' } });
      fireEvent.change(getByLabelText(/URL/), { target: { value: 'NewArtifactUrl' } });
      openSelect(document.querySelector('input[name=status]').parentNode);
      fireEvent.click(getByText('draft'));
      openSelect(document.querySelector('input[name=experimental]').parentNode);
      fireEvent.click(getByText('false'));
      fireEvent.change(getByLabelText(/Publisher/), { target: { value: 'NewArtifactPublisher' } });
      fireEvent.click(getByText('Add Context'));
      openSelect(document.querySelector('input[name="context[0].contextType"]').parentNode);
      fireEvent.click(getByText('gender'));
      openSelect(document.querySelector('input[name="context[0].gender"]').parentNode);
      fireEvent.click(getByText('female'));
      fireEvent.change(getByLabelText(/Purpose/), { target: { value: 'NewArtifactPurpose' } });
      fireEvent.change(getByLabelText(/Usage/), { target: { value: 'NewArtifactUsage' } });
      fireEvent.change(getByLabelText(/Copyright/), { target: { value: 'NewArtifactCopyright' } });
      fireEvent.change(getByLabelText(/Approval Date/), { target: { value: '01/01/2000' } });
      fireEvent.change(getByLabelText(/Last Review Date/), { target: { value: '01/02/2000' } });
      fireEvent.change(document.querySelector(
        'input[name="effectivePeriod.start"]'),
        { target: { value: '01032000' } }
      );
      fireEvent.change(document.querySelector(
        'input[name="effectivePeriod.end"]'),
        { target: { value: '01042000' } }
      );
      fireEvent.click(getByText('Add Author'));
      fireEvent.change(document.querySelector(
        'input[name="author[0].author"]'),
        { target: { value: 'NewArtifactAuthor' } }
      );
      fireEvent.click(getByText('Add Reviewer'));
      fireEvent.change(document.querySelector(
        'input[name="reviewer[0].reviewer"]'),
        { target: { value: 'NewArtifactReviewer' } }
      );
      fireEvent.click(getByText('Add Endorser'));
      fireEvent.change(document.querySelector(
        'input[name="endorser[0].endorser"]'),
        { target: { value: 'NewArtifactEndorser' } }
      );
      fireEvent.click(getByText('Add Related Artifact'));
      openSelect(document.querySelector('input[name="relatedArtifact[0].relatedArtifactType"]').parentNode);
      fireEvent.click(getByText('Citation'));
      fireEvent.change(document.querySelector(
        'textarea[name="relatedArtifact[0].description"]'),
        { target: { value: 'NewArtifactCitationDescription' } }
      );
      fireEvent.change(document.querySelector(
        'textarea[name="relatedArtifact[0].url"]'),
        { target: { value: 'NewArtifactCitationUrl' } }
      );
      fireEvent.change(document.querySelector(
        'textarea[name="relatedArtifact[0].citation"]'),
        { target: { value: 'NewArtifactCitationCitation' } }
      );

      fireEvent.click(getByText('Create'));

      await waitFor(() => {
        expect(addArtifact).toHaveBeenCalledWith({
          name: 'NewArtifactName',
          version: 'NewArtifactVersion',
          description: 'NewArtifactDescription',
          url: 'NewArtifactUrl',
          status: 'draft',
          experimental: 'false',
          publisher: 'NewArtifactPublisher',
          context: [{ contextType: 'gender', gender: 'female' }],
          purpose: 'NewArtifactPurpose',
          usage: 'NewArtifactUsage',
          copyright: 'NewArtifactCopyright',
          // Format dates using this approach so tests pass regardless of the TZ they are run in
          approvalDate: new Date(2000, 0, 1).toISOString(),
          lastReviewDate: new Date(2000, 0, 2).toISOString(),
          effectivePeriod: { start: new Date(2000, 0, 3).toISOString(), end: new Date(2000, 0, 4).toISOString() },
          topic: [],
          author: [{ author: 'NewArtifactAuthor' }],
          reviewer: [{ reviewer: 'NewArtifactReviewer' }],
          endorser: [{ endorser: 'NewArtifactEndorser' }],
          relatedArtifact: [{
            relatedArtifactType: 'citation',
            description: 'NewArtifactCitationDescription',
            url: 'NewArtifactCitationUrl',
            citation: 'NewArtifactCitationCitation'
          }]
        });
      });
    });

    it('can edit the form', async () => {
      const { getByText } = render(
        <ArtifactModal
          artifactEditing={artifactMock}
          showModal={true}
          closeModal={jest.fn()}
        />
      );

      const nameField = document.querySelector('input[name="name"]');

      userEvent.clear(nameField);
      userEvent.type(nameField, 'Edited Artifact Name');
      fireEvent.click(getByText('Save'));

      await waitFor(() => {
        expect(updateAndSaveArtifact).toHaveBeenCalledWith(
          artifactMock,
          expect.objectContaining({ name: 'Edited Artifact Name' })
        );
      });
    });
  });
});
