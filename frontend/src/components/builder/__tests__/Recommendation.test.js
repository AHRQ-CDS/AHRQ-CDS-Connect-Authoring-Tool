import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Recommendation from '../Recommendation';

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
  comment: 'comment text'
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
    renderComponent({ onRemove });

    userEvent.click(screen.getByLabelText('remove recommendation'));

    expect(onRemove).toHaveBeenCalledWith(rec.uid);
  });

  it('displays the recommendation text', () => {
    renderComponent();

    expect(screen.getByLabelText('Recommendation')).toHaveValue('recommendation text');
  });

  it('displays the rationale text', () => {
    renderComponent();

    expect(screen.getByLabelText('Rationale')).toHaveValue('rationale text');
  });

  it('displays the comment text', () => {
    renderComponent();

    expect(screen.getByLabelText('Comment')).toHaveValue('comment text');
  });

  it('displays the adds rationale button when there is no rationale', () => {
    renderComponent({
      rec: {
        ...rec,
        rationale: ''
      }
    });

    expect(screen.queryByLabelText('Rationale')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('Add rationale'));

    expect(screen.getByLabelText('Rationale')).toBeInTheDocument();
  });

  it('displays comment input after clicking show comments', () => {
    renderComponent({
      rec: {
        ...rec,
        comment: ''
      }
    });

    expect(screen.queryByLabelText('Comment')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('Add Comments'));

    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  });

  it('can edit recommendation text', () => {
    const newText = 'This is a test.';
    const onUpdate = jest.fn();
    renderComponent({ onUpdate });

    fireEvent.change(screen.getByLabelText('Recommendation'), { target: { name: 'text', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { text: newText });
  });

  it('can edit rationale text', () => {
    const newText = 'This is a test.';
    const onUpdate = jest.fn();

    renderComponent({ onUpdate });

    fireEvent.change(screen.getByLabelText('Rationale'), { target: { name: 'rationale', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { rationale: newText });
  });

  it('can remove rationale', () => {
    const newText = '';
    const onUpdate = jest.fn();

    renderComponent({ onUpdate });

    userEvent.click(screen.getByLabelText('remove rationale'));

    expect(onUpdate).toBeCalledWith(rec.uid, { rationale: newText });
  });

  it('can edit comment text', () => {
    const newText = 'This is a test comment.';
    const onUpdate = jest.fn();

    renderComponent({ onUpdate });

    fireEvent.change(screen.getByLabelText('Comment'), { target: { name: 'comment', value: newText } });

    expect(onUpdate).toBeCalledWith(rec.uid, { comment: newText });
  });

  it('can remove a comment', () => {
    const newText = '';
    const onUpdate = jest.fn();

    renderComponent({ onUpdate });

    userEvent.click(screen.getByLabelText('remove comment'));

    expect(onUpdate).toBeCalledWith(rec.uid, { comment: newText });
  });

  it('renders subpopulations', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(1);
    expect(container.querySelectorAll('.recommendation__subpopulation-pill')).toHaveLength(1);
  });

  it('can add a subpopulation', () => {
    const { container } = renderComponent({
      rec: {
        ...rec,
        subpopulations: []
      }
    });

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(0);

    userEvent.click(screen.getByLabelText('Add subpopulation'));

    expect(container.querySelectorAll('.recommendation__subpopulations')).toHaveLength(1);
  });

  it('displays "No options" when there are no subpopulations to add', () => {
    renderComponent();

    userEvent.click(screen.getByLabelText('Add a subpopulation'));

    expect(screen.getByText('No options')).not.toBeNull();
  });

  it('applies subpopulations', () => {
    const updateRecommendations = jest.fn();
    const recommendation = {
      ...rec,
      subpopulations: []
    };
    renderComponent({
      artifact: {
        recommendations: [recommendation],
        subpopulations: [subpop]
      },
      rec: recommendation,
      updateRecommendations
    });

    userEvent.click(screen.getByLabelText('Add subpopulation'));
    userEvent.click(screen.getByLabelText('Add a subpopulation'));
    userEvent.click(screen.getByText('Test Subpopulation 1'));

    expect(updateRecommendations).toBeCalledWith([rec]);
  });

  it('can remove a subpopulation', () => {
    const updateRecommendations = jest.fn();
    renderComponent({ updateRecommendations });

    userEvent.click(screen.getByLabelText('Remove Test Subpopulation 1'));

    expect(updateRecommendations).toBeCalledWith([
      {
        ...rec,
        subpopulations: []
      }
    ]);
  });

  it('calls setActiveTab when clicking "New subpopulation"', () => {
    const setActiveTab = jest.fn();
    renderComponent({ setActiveTab });

    userEvent.click(screen.getByLabelText('New subpopulation'));

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
    renderComponent({
      artifact: {
        subpopulations: [specialSubpop],
        recommendations: [recommendation]
      },
      rec: recommendation,
      updateRecommendations
    });

    userEvent.click(screen.getByLabelText('Add subpopulation'));
    userEvent.click(screen.getByLabelText('Add a subpopulation'));
    userEvent.click(screen.getByText('Test Subpopulation 1'));

    expect(updateRecommendations).toHaveBeenCalledWith([
      {
        ...rec,
        subpopulations: [specialSubpop]
      }
    ]);
  });
});
