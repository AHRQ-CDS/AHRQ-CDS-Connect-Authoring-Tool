import React from 'react';
import { render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import ArtifactTable from '../ArtifactTable';

describe('<ArtifactTable />', () => {
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
        artifacts={artifactsMock}
        handleDeleteArtifact={jest.fn()}
        handleUpdateArtifact={jest.fn()}
        handleDuplicateArtifact={jest.fn()}
        {...props}
      />
    );

  it('renders artifacts', async () => {
    renderComponent();

    expect(await screen.findByText('My Second CDS Artifact')).toBeInTheDocument();
    expect(await screen.findByText('My CDS Artifact')).toBeInTheDocument();
  });

  it('allows opening and closing of the edit modal', async () => {
    renderComponent();

    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: 'edit info' })[0]));
    expect(await screen.findByText('Edit Artifact Details')).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'close' })));
    await waitFor(() => {
      expect(screen.queryByText('Edit Artifact Details')).not.toBeInTheDocument();
    });
  });

  it('allows deleting of artifacts', async () => {
    const handleDeleteArtifact = jest.fn();
    renderComponent({ handleDeleteArtifact });

    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]));
    expect(screen.getByText('Delete CDS Artifact Confirmation')).toBeInTheDocument();

    const dialog = within(screen.getByRole('dialog'));

    expect(dialog.getByText(/My Second CDS Artifact/)).toBeInTheDocument();
    expect(dialog.getByText(/1\.0\.1/)).toBeInTheDocument();

    await waitFor(() => userEvent.click(dialog.getByRole('button', { name: /delete/i })));

    expect(handleDeleteArtifact).toBeCalledWith(artifactsMock[0]);
  });

  it('allows duplication of artifacts', async () => {
    const handleDuplicateArtifact = jest.fn();
    renderComponent({ handleDuplicateArtifact });

    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /duplicate/i })[0]));

    expect(handleDuplicateArtifact).toBeCalledWith(artifactsMock[0]);
  });
});
