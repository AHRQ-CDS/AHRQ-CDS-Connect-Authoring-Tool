import React from 'react';
import Recommendation from '../Recommendation';
import { render, fireEvent, openSelect } from '../../../utils/test-utils';
import { elementGroups } from '../../../utils/test_fixtures';

const subpop = {
  uniqueId: 'sp-100',
  subpopulationName: 'Test Subpopulation 1'
};

const rec = {
  uid: 'rec-100',
  grade: 'A',
  subpopulations: [subpop],
  text: 'recommendation text',
  rationale: 'rationale text',
  comment: 'comment text',
};

describe('<Recommendation />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Recommendation
        artifact={{
          subpopulations: [subpop],
          recommendations: [rec]
        }}
        onRemove={jest.fn()}
        onUpdate={jest.fn()}
        setActiveTab={jest.fn()}
        templates={elementGroups}
        rec={rec}
        updateRecommendations={jest.fn()}
        updateSubpopulations={jest.fn()}
        {...props}
      />
    );

  it('calls onRemove when deleted', () => {
    const onRemove = jest.fn();
    const { getByLabelText } = renderComponent({ onRemove });

    fireEvent.click(getByLabelText('remove recommendation'));

    expect(onRemove).toHaveBeenCalledWith(rec.uid);
  });

  it('displays the recommendation text', () => {
    const { getByLabelText } = renderComponent();

    expect(getByLabelText('Recommendation')).toHaveValue('recommendation text');
  });

  it('displays the rationale text', () => {
    const { getByLabelText } = renderComponent();

    expect(getByLabelText('Rationale')).toHaveValue('rationale text');
  });

  it('displays the comment text', () => {
    const { getByLabelText } = renderComponent();

    expect(getByLabelText('Comment')).toHaveValue('comment text');
  });

  it('displays the adds rationale button when there is no rationale', () => {
    const { getByLabelText, queryByLabelText } = renderComponent({
      rec: {
        ...rec,
        rationale: ''
      }
    });

    expect(queryByLabelText('Rationale')).toBeNull();

    fireEvent.click(getByLabelText('Add rationale'));

    expect(queryByLabelText('Rationale')).not.toBeNull();
  });

  it('displays comment input after clicking show comments', () => {
    const { getByLabelText, queryByLabelText } = renderComponent({
    rec: {
        ...rec,
        comment: ''
      }
    });

    expect(queryByLabelText('Comment')).toBeNull();

    fireEvent.click(getByLabelText('Show Comments'));

    expect(queryByLabelText('Comment')).not.toBeNull();
  });


  it('can edit recommendation text', () => {
    const newText = 'This is a test.';
    const onUpdate = jest.fn();
    const { getByLabelText } = renderComponent({ onUpdate });

    fireEvent.change(getByLabelText('Recommendation'), { target: { name: 'text', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { text: newText });
  });

  it('can edit rationale text', () => {
    const newText = 'This is a test.';
    const onUpdate = jest.fn();

    const { getByLabelText } = renderComponent({ onUpdate });

    fireEvent.change(getByLabelText('Rationale'), { target: { name: 'rationale', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { rationale: newText });
  });

  it('can edit comment text', () => {
    const newText = 'This is a test comment.';
    const onUpdate = jest.fn();

    const { getByLabelText } = renderComponent({ onUpdate });

    fireEvent.change(getByLabelText('Comment'), { target: { name: 'comment', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { comment: newText });
  });

  it('renders subpopulations', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(1);
    expect(container.querySelectorAll('.recommendation__subpopulation-pill')).toHaveLength(1);
  });

  it('can add a subpopulation', () => {
    const { container, getByLabelText } = renderComponent({
      rec: {
        ...rec,
        subpopulations: []
      }
    });

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(0);

    fireEvent.click(getByLabelText('Add subpopulation'));

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(1);
  });

  it('displays "No options" when there are no subpopulations to add', () => {
    const { getByText, getByLabelText } = renderComponent();

    openSelect(getByLabelText('Add a subpopulation'));

    expect(getByText('No options')).not.toBeNull();
  });

  it('applies subpopulations', () => {
    const updateRecommendations = jest.fn();
    const recommendation = {
      ...rec,
      subpopulations: []
    };
    const { getByText, getByLabelText } = renderComponent({
      artifact: {
        recommendations: [recommendation],
        subpopulations: [subpop]
      },
      rec: recommendation,
      updateRecommendations
    });

    fireEvent.click(getByLabelText('Add subpopulation'));
    openSelect(getByLabelText('Add a subpopulation'));
    fireEvent.click(getByText('Test Subpopulation 1'));

    expect(updateRecommendations).toBeCalledWith([rec]);
  });

  it('can remove a subpopulation', () => {
    const updateRecommendations = jest.fn();
    const { getByLabelText } = renderComponent({ updateRecommendations });

    fireEvent.click(getByLabelText('Remove Test Subpopulation 1'));

    expect(updateRecommendations).toBeCalledWith([{
      ...rec,
      subpopulations: []
    }]);
  });

  it('calls setActiveTab when clicking "New subpopulation"', () => {
    const setActiveTab = jest.fn();
    const { getByLabelText } = renderComponent({ setActiveTab });

    fireEvent.click(getByLabelText('New subpopulation'));

    expect(setActiveTab).toBeCalledWith(2);
  });

  it('applies special subpopulations correctly', () => {
    const updateRecommendations = jest.fn();
    const specialSubpop = {
      ...subpop,
      special: true,
      special_subpopulationName: 'TestSubpop1'
    };
    const recommendation = {
      ...rec,
      subpopulations: []
    };
    const { getByText, getByLabelText } = renderComponent({
      artifact: {
        subpopulations: [specialSubpop],
        recommendations: [recommendation]
      },
      rec: recommendation,
      updateRecommendations
    });

    fireEvent.click(getByLabelText('Add subpopulation'));
    openSelect(getByLabelText('Add a subpopulation'));
    fireEvent.click(getByText('Test Subpopulation 1'));

    expect(updateRecommendations).toHaveBeenCalledWith([{
      ...rec,
      subpopulations: [specialSubpop]
    }]);
  });
});
