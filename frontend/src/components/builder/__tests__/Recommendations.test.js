import React from 'react';
import { render, fireEvent, userEvent, screen, within } from 'utils/test-utils';
import Recommendations from '../Recommendations';

const rec = {
  uid: 'rec-100',
  grade: 'A',
  subpopulations: [],
  text: '',
  rationale: ''
};

describe('<Recommendations />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Recommendations
        artifact={{
          subpopulations: [],
          recommendations: [rec]
        }}
        setActiveTab={jest.fn()}
        templates={[]}
        updateRecommendations={jest.fn()}
        updateSubpopulations={jest.fn()}
        openConfirmDeleteModal={jest.fn()}
        removeRecommendation={jest.fn()}
        {...props}
      />
    );

  it('renders a list of recommendations', () => {
    renderComponent();

    expect(document.querySelectorAll('.recommendation')).toHaveLength(1);
  });

  it('can add a new recommendation with button', () => {
    const updateRecommendations = jest.fn();
    renderComponent({
      updateRecommendations
    });

    userEvent.click(screen.getByRole('button', { name: 'New recommendation' }));

    expect(updateRecommendations).toBeCalledWith([
      rec,
      expect.objectContaining({
        grade: 'A',
        subpopulations: [],
        text: '',
        rationale: '',
        uid: expect.stringMatching(/^rec-\d+$/)
      })
    ]);
  });

  it('updates a recommendation', () => {
    const newText = 'this is a test';
    const updateRecommendations = jest.fn();
    renderComponent({ updateRecommendations });

    fireEvent.change(screen.getByPlaceholderText('Describe your recommendation'), {
      target: { name: 'text', value: newText }
    });

    expect(updateRecommendations).toHaveBeenCalledWith([
      {
        ...rec,
        text: newText
      }
    ]);
  });

  it('shows a confirmation modal on delete and deletes on confirm', () => {
    const updateRecommendations = jest.fn();
    renderComponent({ updateRecommendations });

    // click delete
    userEvent.click(screen.getByRole('button', {name: 'remove recommendation'}));

    const dialog = within(screen.getByRole('dialog'));

    // check the modal exists
    expect(dialog.getByText('Delete Recommendation')).toBeInTheDocument();

    // confirm the delete
    userEvent.click(dialog.getByRole('button', { name: 'Delete' }));
    expect(updateRecommendations).toHaveBeenCalledWith([]);
  });
});
