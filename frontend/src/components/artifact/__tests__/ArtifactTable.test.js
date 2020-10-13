import React from 'react';

import ArtifactTable from '../ArtifactTable';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<ArtifactTable />', () => {
  const match = {
    path: ''
  };

  const artifactsMock = [
    {
      _id: 'artifact1',
      name: 'My CDS Artifact',
      version: '1.0.0',
      updatedAt: '2012-10-15T21:26:17Z',
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
    },
    {
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
    }
  ];

  it('renders artifacts', () => {
    const { container } = render(
      <ArtifactTable
        match={match}
        artifacts={artifactsMock}
        afterAddArtifact={jest.fn()}
        deleteArtifact={jest.fn()}
        updateAndSaveArtifact={jest.fn()}
      />
    );

    expect(container.querySelectorAll('tbody tr')).toHaveLength(artifactsMock.length);
  });

  it.skip('allows editing of artifacts', () => {
    const updateAndSaveArtifact = jest.fn();
    const { container } = render(
      <ArtifactTable
        match={match}
        artifacts={artifactsMock}
        afterAddArtifact={jest.fn()}
        deleteArtifact={jest.fn()}
        updateAndSaveArtifact={updateAndSaveArtifact}
      />
    );

    fireEvent.click(container.querySelector('button.edit-artifact-button'));

    fireEvent.change(
      document.body.querySelector('input[name="name"]'),
      { target: { name: 'name', value: 'Edited Artifact Name' } }
    );
    fireEvent.change(
      document.body.querySelector('input[name="version"]'),
      { target: { name: 'version', value: 'Edited Artifact Version' } }
    );
    fireEvent.click(document.body.querySelector('button[type="submit"]'));

    expect(updateAndSaveArtifact).toBeCalledWith(
      artifactsMock[0],
      { name: 'Edited Artifact Name', version: 'Edited Artifact Version' }
    );
  });

  it('allows closing of the edit modal', () => {
    const { container, queryByLabelText } = render(
      <ArtifactTable
        match={match}
        artifacts={artifactsMock}
        afterAddArtifact={jest.fn()}
        deleteArtifact={jest.fn()}
        updateAndSaveArtifact={jest.fn()}
      />
    );

    fireEvent.click(container.querySelector('button.edit-artifact-button'));
    expect(queryByLabelText('Edit Artifact Details')).not.toBeNull();

    fireEvent.click(document.querySelector('.modal__deletebutton'));
    expect(queryByLabelText('Edit Artifact Details')).toBeNull();
  });

  it('allows deleting of artifacts', () => {
    const deleteArtifact = jest.fn();

    const { container } = render(
      <ArtifactTable
        match={match}
        artifacts={artifactsMock}
        afterAddArtifact={jest.fn()}
        deleteArtifact={deleteArtifact}
        updateAndSaveArtifact={jest.fn()}
      />
    );

    fireEvent.click(container.querySelector('button.danger-button'));

    expect(document.querySelector('.modal__heading')).toHaveTextContent('Delete Artifact Confirmation');

    const [artifactName, artifactVersion] =
      document.querySelectorAll('.delete-artifact-confirmation-modal .artifact-info');

    expect(artifactName).toHaveTextContent(`Name: ${artifactsMock[0].name}`);
    expect(artifactVersion).toHaveTextContent(`Version: ${artifactsMock[0].version}`);

    fireEvent.click(document.body.querySelector('button[type="submit"]'));

    expect(deleteArtifact).toBeCalledWith(artifactsMock[0]);
  });
});
