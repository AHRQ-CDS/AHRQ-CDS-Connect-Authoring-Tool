import React from 'react';
import { render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import ArtifactTable from '../ArtifactTable';

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

  const renderComponent = (props = {}) =>
    render(
      <ArtifactTable
        match={match}
        artifacts={artifactsMock}
        afterAddArtifact={jest.fn()}
        deleteArtifact={jest.fn()}
        {...props}
      />
    );

  it('renders artifacts', () => {
    renderComponent();

    expect(screen.getByText('My Second CDS Artifact')).toBeInTheDocument();
    expect(screen.getByText('My CDS Artifact')).toBeInTheDocument();
  });

  it('allows opening and closing of the edit modal', async () => {
    renderComponent();

    userEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(screen.getByText('Edit Artifact Details')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => {
      expect(screen.queryByText('Edit Artifact Details')).not.toBeInTheDocument();
    });
  });

  it('allows deleting of artifacts', () => {
    const deleteArtifact = jest.fn();
    renderComponent({ deleteArtifact });

    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(screen.getByText('Delete Artifact Confirmation')).toBeInTheDocument();

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText(artifactsMock[0].name)).toBeInTheDocument();
    expect(dialog.getByText(artifactsMock[0].version)).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', {name: 'Delete'}));

    expect(deleteArtifact).toBeCalledWith(artifactsMock[0]);
  });
});
