import React from 'react';
import nock from 'nock';
import { render, fireEvent, userEvent, screen, within } from 'utils/test-utils';
import CodeSelectModal from '../CodeSelectModal';

describe('<CodeSelectModal />', () => {
  const renderComponent = (props = {}) =>
    render(<CodeSelectModal handleSelectCode={jest.fn()} handleCloseModal={jest.fn()} {...props} />);

  const setInputValue = (input, value) => {
    fireEvent.change(input, { target: { value } });
  };

  it('can close modal with "Cancel" button', async () => {
    const handleCloseModal = jest.fn();

    renderComponent({ handleCloseModal });

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('can input a code and code system without verification', async () => {
    const handleSelectCode = jest.fn();
    const handleCloseModal = jest.fn();
    const code = '123-4';

    renderComponent({ handleSelectCode, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    setInputValue(dialog.getByLabelText('Code'), code);
    userEvent.click(dialog.getByLabelText('Code system'));
    userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
    userEvent.click(dialog.getByRole('button', { name: 'Select' }));

    expect(handleSelectCode).toHaveBeenCalledWith({
      code,
      codeSystem: { id: 'http://snomed.info/sct', name: 'SNOMED' },
      display: ''
    });
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('allows users to enter a URI for the "Other" code system', async () => {
    const handleSelectCode = jest.fn();
    const handleCloseModal = jest.fn();
    const code = '123-4';
    const codeSystemUri = 'www.example.org';

    renderComponent({ handleSelectCode, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    setInputValue(dialog.getByLabelText('Code'), code);
    userEvent.click(dialog.getByLabelText('Code system'));
    userEvent.click(screen.getByRole('option', { name: 'Other' }));
    setInputValue(dialog.getByLabelText('System URI'), codeSystemUri);

    userEvent.click(dialog.getByRole('button', { name: 'Select' }));

    expect(handleSelectCode).toHaveBeenCalledWith({
      code,
      codeSystem: { id: codeSystemUri, name: 'Other' },
      display: ''
    });
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it('can validate codes and save their display name', async () => {
    const handleSelectCode = jest.fn();
    const handleCloseModal = jest.fn();
    const code = '123-4';

    nock('http://localhost')
      .get('/authoring/api/fhir/code')
      .query({ code, system: 'http://snomed.info/sct' })
      .reply(200, {
        code,
        systemName: 'SNOMED',
        display: 'One Two Three-Four'
      });

    renderComponent({ handleSelectCode, handleCloseModal });

    const dialog = within(screen.getByRole('dialog'));

    setInputValue(dialog.getByLabelText('Code'), code);
    userEvent.click(dialog.getByLabelText('Code system'));
    userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
    userEvent.click(dialog.getByRole('button', { name: 'Validate' }));

    expect(await dialog.findByText('Display')).toBeInTheDocument();

    userEvent.click(dialog.getByRole('button', { name: 'Select' }));

    expect(handleSelectCode).toBeCalledWith({
      code,
      codeSystem: {
        name: 'SNOMED',
        id: 'http://snomed.info/sct'
      },
      display: 'One Two Three-Four'
    });
  });
});
