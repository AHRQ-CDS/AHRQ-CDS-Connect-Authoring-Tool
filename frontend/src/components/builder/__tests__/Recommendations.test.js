import React from 'react';
import Recommendations from '../Recommendations';
import { render, fireEvent } from '../../../utils/test-utils';

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
        {...props}
      />
    );

  it('renders a list of recommendations', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.recommendation')).toHaveLength(1);
  });

  it('can add a new recommendation with button', () => {
    const updateRecommendations = jest.fn();
    const { getByLabelText } = renderComponent({
      updateRecommendations
    });

    fireEvent.click(getByLabelText('New recommendation'));

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
    const { getByLabelText } = renderComponent({ updateRecommendations });

    fireEvent.change(getByLabelText('Recommendation'), { target: { name: 'text', value: newText } });

    expect(updateRecommendations).toHaveBeenCalledWith([{
      ...rec,
      text: newText
    }]);
  });

  it('deletes a recommendation', () => {
    const updateRecommendations = jest.fn();
    const { getByLabelText } = renderComponent({ updateRecommendations });

    fireEvent.click(getByLabelText('remove recommendation'));

    expect(updateRecommendations).toBeCalledWith([]);
  });
});
