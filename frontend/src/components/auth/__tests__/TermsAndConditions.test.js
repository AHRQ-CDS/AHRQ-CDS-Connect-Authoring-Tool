import React from 'react';
import { fireEvent, render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import TermsAndConditions from '../TermsAndConditions';

const renderComponent = (props = {}) =>
  render(<TermsAndConditions isOpen={true} logout={jest.fn()} saveTermsDate={jest.fn()} {...props} />);

const waitForCheckboxToCheck = (input, expectedValue) => {
  fireEvent.click(input);
  return waitFor(() => expect(input.checked).toEqual(expectedValue));
};

describe('<TermsAndConditions />', () => {
  it('allows accepting terms and closes', async () => {
    const saveTermsDate = jest.fn();
    renderComponent({ saveTermsDate });

    const dialog = within(screen.getByRole('dialog'));

    const acceptCheckbox = dialog.getByRole('checkbox');
    expect(acceptCheckbox).toBeInTheDocument();
    await waitForCheckboxToCheck(acceptCheckbox, true);

    userEvent.click(dialog.getByText('Accept'));

    await waitFor(() => {
      expect(saveTermsDate).toHaveBeenCalled();
    });
  });

  it('renders warning and closes modal after clicking close twice', async () => {
    const logout = jest.fn();
    renderComponent({ logout });

    const dialog = within(screen.getByRole('dialog'));

    const closeButton = dialog.getByLabelText('close');
    expect(closeButton).toBeInTheDocument();

    // Alert is not rendered initially
    const alert = dialog.queryByRole('alert');
    expect(alert).not.toBeInTheDocument();

    // First time clicking the close button does not log you out and renders alert
    userEvent.click(closeButton);
    await waitFor(() => {
      expect(logout).not.toHaveBeenCalled();
      expect(dialog.queryByRole('alert')).toBeInTheDocument();
    });

    // Second time clicking the close button logs you out
    userEvent.click(closeButton);
    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });

  it('enables accept button only if checkbox is checked', async () => {
    renderComponent({});

    const dialog = within(screen.getByRole('dialog'));

    // Accept button is initially disabled
    const acceptButton = dialog.getByText('Accept');
    expect(acceptButton).toBeInTheDocument();
    expect(acceptButton).toHaveAttribute('disabled');

    // Checking the checkbox enables accept button
    const acceptCheckbox = dialog.getByRole('checkbox');
    await waitForCheckboxToCheck(acceptCheckbox, true);
    expect(acceptButton).not.toHaveAttribute('disabled');
  });
});
