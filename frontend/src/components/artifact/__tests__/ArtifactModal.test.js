import React from 'react';
import { formatISO } from 'date-fns';
import { addArtifact, updateAndSaveArtifact } from 'actions/artifacts';
import { render, screen, fireEvent, userEvent, waitFor, within, act } from 'utils/test-utils';
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
  render(<ArtifactModal artifactEditing={null} showModal={true} closeModal={jest.fn()} {...props} />);

const waitForDropdownToClose = () => waitFor(() => expect(screen.queryAllByRole('option')).toHaveLength(0));
const waitForInputValueChange = (input, value, expectedValue) => {
  fireEvent.change(input, { target: { value } });
  return waitFor(() => expect(input).toHaveValue(expectedValue ?? value));
};

jest.mock('../../../actions/artifacts', () => ({
  __esModule: true,
  addArtifact: jest.fn(),
  updateAndSaveArtifact: jest.fn()
}));

describe('<ArtifactModal />', () => {
  beforeEach(() => {
    addArtifact.mockImplementation(() => ({ type: 'ADD_ARTIFACT' }));
    updateAndSaveArtifact.mockImplementation(() => ({ type: 'UPDATE_AND_SAVE_ARTIFACT' }));
  });

  afterEach(() => jest.clearAllMocks());

  it('does not render the modal if it is not opened', () => {
    renderComponent({ showModal: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('allows submission and calls closeModal', async () => {
    const closeModal = jest.fn();
    renderComponent({ closeModal });

    const dialog = within(screen.getByRole('dialog'));

    await waitForInputValueChange(dialog.getByLabelText(/Artifact Name/), 'NewArtifactName');
    await waitForInputValueChange(dialog.getByLabelText('Version:'), 'NewArtifactVersion');

    userEvent.click(dialog.getByText('Create'));

    await waitFor(() => {
      expect(closeModal).toHaveBeenCalled();
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

      const descriptionField = within(dialog.getByText(/Description/));
      const cpgTag = descriptionField.getByText('CPG');

      expect(cpgTag).toHaveAttribute('class', expect.stringContaining('cpgTag'));
      expect(cpgTag).toHaveAttribute('class', expect.not.stringContaining('cpgTagComplete'));

      await waitForInputValueChange(dialog.getByLabelText(/Description/), 'description');

      expect(cpgTag).toHaveAttribute('class', expect.stringContaining('cpgTagComplete'));
    });

    it('can fill out the CPG form', async () => {
      renderComponent();
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

        const [approvalDate, lastReviewDate, effectivePeriodStart, effectivePeriodEnd] = dialog.getAllByPlaceholderText(
          'mm/dd/yyyy'
        );

        fireEvent.change(approvalDate, { target: { value: '01/01/2000' } });
        fireEvent.change(lastReviewDate, { target: { value: '01/02/2000' } });

        fireEvent.change(effectivePeriodStart, {
          target: { value: '01032000' }
        });
        await waitForInputValueChange(effectivePeriodEnd, '01042000', '01/04/2000');
      });

      userEvent.click(dialog.getAllByLabelText('Select...')[0]); // status
      userEvent.click(screen.getByRole('option', { name: 'draft' }));

      await waitForDropdownToClose();

      userEvent.click(dialog.getByLabelText('Select...')); // experimental
      userEvent.click(screen.getByRole('option', { name: 'false' }));

      await waitForDropdownToClose();

      userEvent.click(dialog.getByText('Add Context'));

      userEvent.click(dialog.getByLabelText('Select...')); // context type
      userEvent.click(screen.getByRole('option', { name: 'gender' }));

      await waitForDropdownToClose();

      userEvent.click(dialog.getByLabelText('Select...')); // gender
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
      userEvent.click(dialog.getByLabelText('Select...')); // related artifact type
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
        expect(addArtifact).toHaveBeenCalled();
      });

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
        approvalDate: formatISO(new Date(2000, 0, 1)),
        lastReviewDate: formatISO(new Date(2000, 0, 2)),
        effectivePeriod: { start: formatISO(new Date(2000, 0, 3)), end: formatISO(new Date(2000, 0, 4)) },
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
    }, 30000);

    it('can edit the form', async () => {
      const { getByText } = render(
        <ArtifactModal artifactEditing={artifactMock} showModal={true} closeModal={jest.fn()} />
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
