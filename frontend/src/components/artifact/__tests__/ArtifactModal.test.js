import React from 'react';
// import { formatISO } from 'date-fns'; // ** See comment on line 123
import {
  act,
  // changeDate, // ** See comment on line 123
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  // waitForElementToBeRemoved, // ** See comment on line 123
  within
} from 'utils/test-utils';
import ArtifactModal from '../ArtifactModal';

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
  strengthOfRecommendation: { strengthOfRecommendation: null, code: '', system: '' },
  qualityOfEvidence: { qualityOfEvidence: null, code: '', system: '' },
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

const renderComponent = (props = {}) =>
  render(
    <ArtifactModal
      artifactEditing={null}
      handleAddArtifact={jest.fn()}
      handleCloseModal={jest.fn()}
      handleUpdateArtifact={jest.fn()}
      {...props}
    />
  );

const waitForDropdownToClose = () => waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0));
const waitForInputValueChange = (input, value, expectedValue) => {
  fireEvent.change(input, { target: { value } });
  return waitFor(() => expect(input).toHaveValue(expectedValue ?? value));
};

describe('<ArtifactModal />', () => {
  it('allows submission and closes modal', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    await waitForInputValueChange(dialog.getByLabelText(/Artifact Name/), 'NewArtifactName');
    await waitForInputValueChange(dialog.getByLabelText('Version:'), 'NewArtifactVersion');

    userEvent.click(dialog.getByText('Create'));

    await waitFor(() => {
      expect(handleCloseModal).toHaveBeenCalled();
    });
  });

  describe('modal title', () => {
    it('displays Create New Artifact for new artifacts', async () => {
      renderComponent();

      expect(await screen.findByText('Create New Artifact')).toBeInTheDocument();
    });

    it('displays Edit Artifact Details when editing an artifact', async () => {
      renderComponent({ artifactEditing: artifactMock });

      expect(await screen.findByText('Edit Artifact Details')).toBeInTheDocument();
    });
  });

  describe('cpg fields', () => {
    it('toggles the CPG tag when the field is filled out', async () => {
      renderComponent();

      const dialog = within(await screen.findByRole('dialog'));
      userEvent.click(dialog.getByText('Show CPG Fields'));
      const cpgTag = dialog.getAllByText('CPG')[0];

      expect(cpgTag).toHaveAttribute('class', expect.stringContaining('cpgTag'));
      expect(cpgTag).toHaveAttribute('class', expect.not.stringContaining('cpgTagComplete'));

      await waitForInputValueChange(dialog.getByLabelText(/Description/), 'description');
      expect(cpgTag).toHaveAttribute('class', expect.stringContaining('cpgTagComplete'));
    });

    it('can fill out the CPG form', async () => {
      const handleAddArtifact = jest.fn();
      renderComponent({ handleAddArtifact });

      const dialog = within(await screen.findByRole('dialog'));
      await waitForInputValueChange(dialog.getByLabelText(/Artifact Name/), 'NewArtifactName');
      await waitForInputValueChange(dialog.getByLabelText('Version:'), 'NewArtifactVersion');
      userEvent.click(dialog.getByText('Show CPG Fields'));

      await act(async () => {
        fireEvent.change(dialog.getByLabelText(/Description/), { target: { value: 'NewArtifactDescription' } });
        fireEvent.change(dialog.getByLabelText(/URL/), { target: { value: 'NewArtifactUrl' } });
        fireEvent.change(dialog.getByLabelText(/Publisher/), { target: { value: 'NewArtifactPublisher' } });
        fireEvent.change(dialog.getByLabelText(/Purpose/), { target: { value: 'NewArtifactPurpose' } });
        fireEvent.change(dialog.getByLabelText(/Usage/), { target: { value: 'NewArtifactUsage' } });
        fireEvent.change(dialog.getByLabelText(/Copyright/), { target: { value: 'NewArtifactCopyright' } });
      });

      // ** JSDOM doesn't handle testing dates very well because it doesn't use a browser. Testing the dates in this
      // form works, but uses up so much memory via range selection errors that the tests take too long. Since we
      // test the DatePicker component elsewhere, I've commented these tests out, but they can be uncommented to
      // test any specific changes if needed. Recommend looking into end-to-end testing in a browser (like
      // https://www.cypress.io/).

      // await changeDate('01/01/2000'); // approvalDate
      // await waitFor(() => {
      //   expect(screen.queryAllByRole('button', { name: /change date/i })).toHaveLength(4);
      // });

      // await changeDate('01/02/2000', 1); // lastReviewDate
      // await waitFor(() => {
      //   expect(screen.queryAllByRole('button', { name: /change date/i })).toHaveLength(4);
      // });

      // await changeDate('01/03/2000', 2); // effectivePeriodStart
      // await waitFor(() => {
      //   expect(screen.queryAllByRole('button', { name: /change date/i })).toHaveLength(4);
      // });

      // await changeDate('01/04/2000', 3); // effectivePeriodEnd
      // await waitFor(() => {
      //   expect(screen.queryAllByRole('button', { name: /change date/i })).toHaveLength(4);
      // });

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // status
      userEvent.click(screen.getByRole('option', { name: 'draft' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // experimental
      userEvent.click(screen.getByRole('option', { name: 'false' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // strengthOfRecommendation
      userEvent.click(screen.getByRole('option', { name: 'strong' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // qualityOfEvidence
      userEvent.click(screen.getByRole('option', { name: 'high' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getByText('Add Context'));
      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // context type
      userEvent.click(screen.getByRole('option', { name: 'gender' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // gender
      userEvent.click(screen.getByRole('option', { name: 'female' }));
      await waitForDropdownToClose();

      userEvent.click(dialog.getByText('Add Author'));
      userEvent.click(dialog.getByText('Add Reviewer'));
      userEvent.click(dialog.getByText('Add Endorser'));

      await act(async () => {
        fireEvent.change(document.querySelector('input[name="reviewer[0].reviewer"]'), {
          target: { value: 'NewArtifactReviewer' }
        });
        fireEvent.change(document.querySelector('input[name="author[0].author"]'), {
          target: { value: 'NewArtifactAuthor' }
        });
        await waitForInputValueChange(
          document.querySelector('input[name="endorser[0].endorser"]'),
          'NewArtifactEndorser'
        );
      });

      userEvent.click(dialog.getByText('Add Related Artifact'));
      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // related artifact type
      userEvent.click(screen.getByRole('option', { name: 'Citation' }));
      await waitForDropdownToClose();

      await act(async () => {
        fireEvent.change(document.querySelector('textarea[name="relatedArtifact[0].description"]'), {
          target: { value: 'NewArtifactCitationDescription' }
        });
        fireEvent.change(document.querySelector('textarea[name="relatedArtifact[0].url"]'), {
          target: { value: 'NewArtifactCitationUrl' }
        });
        await waitForInputValueChange(
          document.querySelector('textarea[name="relatedArtifact[0].citation"]'),
          'NewArtifactCitationCitation'
        );
      });

      userEvent.click(dialog.getByText('Create'));
      await waitFor(() => {
        expect(handleAddArtifact).toHaveBeenCalledWith({
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
          strengthOfRecommendation: { strengthOfRecommendation: 'strong', code: '', system: '', other: '' },
          qualityOfEvidence: { qualityOfEvidence: 'high', code: '', system: '', other: '' },
          copyright: 'NewArtifactCopyright',
          // ** See comment on line 123
          // Format dates using this approach so tests pass regardless of the TZ they are run in
          // approvalDate: formatISO(new Date(2000, 0, 1)),
          // lastReviewDate: formatISO(new Date(2000, 0, 2)),
          // effectivePeriod: { start: formatISO(new Date(2000, 0, 3)), end: formatISO(new Date(2000, 0, 4)) },
          approvalDate: null,
          lastReviewDate: null,
          effectivePeriod: { start: null, end: null },
          topic: [],
          author: [{ author: 'NewArtifactAuthor' }],
          reviewer: [{ reviewer: 'NewArtifactReviewer' }],
          endorser: [{ endorser: 'NewArtifactEndorser' }],
          relatedArtifact: [
            {
              relatedArtifactType: 'citation',
              description: 'NewArtifactCitationDescription',
              url: 'NewArtifactCitationUrl',
              citation: 'NewArtifactCitationCitation'
            }
          ]
        });
      });
    }, 120000);

    it('can edit the form', async () => {
      const handleUpdateArtifact = jest.fn();
      renderComponent({ artifactEditing: artifactMock, handleUpdateArtifact });

      const dialog = within(await screen.findByRole('dialog'));
      await waitForInputValueChange(dialog.getByLabelText(/Artifact Name/), 'Edited Artifact Name');

      userEvent.click(dialog.getByText('Save'));

      await waitFor(() => {
        expect(handleUpdateArtifact).toHaveBeenCalledWith(
          artifactMock,
          expect.objectContaining({ name: 'Edited Artifact Name' })
        );
      });
    });
  });
});
