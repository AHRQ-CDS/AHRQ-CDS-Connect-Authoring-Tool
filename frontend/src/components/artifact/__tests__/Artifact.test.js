import React from 'react';
import nock from 'nock';
import { render, screen } from 'utils/test-utils';
import Artifact from '../Artifact';

describe('<Artifact />', () => {
  afterAll(() => nock.restore());

  it('shows form and no table when there is no data', async () => {
    nock('http://localhost').get('/authoring/api/artifacts').reply(200, []);

    render(<Artifact />);

    expect(await screen.findByText('No artifacts to show.')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Create New Artifact' })).toBeInTheDocument();
  });

  it('shows a table when there is data', async () => {
    nock('http://localhost')
      .get('/authoring/api/artifacts')
      .reply(200, [
        {
          _id: 'blah',
          name: 'My CDS Artifact',
          version: 'Alpha',
          updatedAt: '2012-10-15T21:26:17Z'
        },
        {
          _id: 'blah2',
          name: 'My Second CDS Artifact',
          version: 'Alpha',
          updatedAt: '2012-11-15T21:26:17Z'
        }
      ]);

    render(<Artifact />);

    expect(await screen.findByText('Artifact Name')).toBeInTheDocument();
    expect(screen.queryByText('No artifacts to show')).not.toBeInTheDocument();
    expect(screen.getByText('My CDS Artifact')).toBeInTheDocument();
    expect(screen.getByText('My Second CDS Artifact')).toBeInTheDocument();
  });
});
