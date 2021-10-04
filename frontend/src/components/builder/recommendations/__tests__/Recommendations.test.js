import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, userEvent, within } from 'utils/test-utils';
import Recommendations from '../Recommendations';
import { mockArtifact } from 'mocks/artifacts';

const recommendations = [
  {
    uid: 'rec-101',
    grade: 'A',
    subpopulations: [
      {
        uniqueId: 'sp-001',
        subpopulationName: 'Subpopulation #1'
      }
    ],
    text: 'Recommendation #1',
    rationale: 'Test rationale',
    comment: 'Test comment',
    links: [
      {
        type: 'absolute',
        label: 'Test Link',
        url: 'https://test-link.com'
      }
    ]
  },
  {
    uid: 'rec-002',
    grade: 'A',
    subpopulations: [],
    text: 'Recommendation #2',
    rationale: '',
    comment: '',
    links: []
  },
  {
    uid: 'rec-003',
    grade: 'A',
    subpopulations: [],
    text: 'Recommendation #3',
    rationale: '',
    comment: '',
    links: []
  }
];

const mockArtifactWithRecommendations = { ...mockArtifact, recommendations };

describe('<Recommendations />', () => {
  const ui = ({ artifact = mockArtifactWithRecommendations, ...props } = {}) => (
    <Provider store={createStore(x => x, { artifacts: { artifact } })}>
      <Recommendations handleUpdateRecommendations={jest.fn()} {...props} />
    </Provider>
  );

  it('can render a list of recommendations', () => {
    render(ui());

    expect(screen.getAllByText(/recommend\.\.\./i)).toHaveLength(3);
  });

  it('can add a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.getByRole('button', { name: /new recommendation/i }));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith(
      recommendations.concat({
        uid: expect.any(String),
        grade: 'A',
        subpopulations: [],
        text: '',
        rationale: '',
        comment: '',
        links: []
      })
    );
  });

  it('can update a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    fireEvent.change(screen.queryAllByPlaceholderText('Describe your recommendation')[0], {
      target: { name: 'text', value: 'Recommendation #1 Edited' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        text: 'Recommendation #1 Edited'
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.queryAllByRole('button', { name: /delete recommendation/i })[2]);

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText(/delete recommendation confirmation/i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([recommendations[0], recommendations[1]]);
  });

  it('can display a recommendation subpopulation', () => {
    render(ui());

    expect(screen.getByText(/if all of the following apply\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/subpopulation #1/i)).toBeInTheDocument();
  });

  it('can display a recommendation text', () => {
    render(ui());

    expect(screen.queryAllByPlaceholderText('Describe your recommendation')[0]).toHaveValue('Recommendation #1');
  });

  it('can display a recommendation rationale', () => {
    render(ui());

    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')[0]).toHaveValue(
      'Test rationale'
    );
  });

  it('can display a recommendation comment', () => {
    render(ui());

    userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[0]);
    expect(screen.queryAllByPlaceholderText('Add an optional comment')[0]).toHaveValue('Test comment');
  });

  it('can display a recommendation link', () => {
    render(ui());

    expect(screen.getByRole('button', { name: /absolute/i })).toBeInTheDocument();
    expect(screen.queryAllByPlaceholderText('Link Text')[0]).toHaveValue('Test Link');
    expect(screen.queryAllByPlaceholderText('Link Address')[0]).toHaveValue('https://test-link.com');
  });

  it('can add a subpopulation to a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.queryAllByRole('button', { name: /add subpopulation/i })[0]);
    userEvent.click(screen.queryAllByTestId('add-subpopulation')[0]);
    userEvent.click(screen.getByRole('option', { name: /meets exclusion criteria/i }));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        subpopulations: [
          recommendations[0].subpopulations[0],
          {
            special: true,
            special_subpopulationName: '"MeetsExclusionCriteria"',
            subpopulationName: 'Meets Exclusion Criteria',
            uniqueId: 'default-subpopulation-2'
          }
        ]
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can add a rationale to a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')).toHaveLength(1);

    userEvent.click(screen.queryAllByRole('button', { name: /add rationale/i })[0]);
    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')).toHaveLength(2);

    fireEvent.change(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')[1], {
      target: { name: 'text', value: 'Recommendation #2 Rationale' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        rationale: 'Recommendation #2 Rationale'
      },
      recommendations[2]
    ]);
  });

  it('can add a comment to a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.queryAllByPlaceholderText('Add an optional comment')).toHaveLength(0);

    userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[1]);
    expect(screen.getByPlaceholderText('Add an optional comment')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Add an optional comment'), {
      target: { name: 'text', value: 'Recommendation #2 Comment' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        comment: 'Recommendation #2 Comment'
      },
      recommendations[2]
    ]);
  });

  it('can add a link to a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.getByText(/link\.\.\./i)).toBeInTheDocument();

    userEvent.click(screen.queryAllByRole('button', { name: /add link/i })[1]);
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        links: [
          {
            uid: expect.any(String),
            type: '',
            label: '',
            url: ''
          }
        ]
      },
      recommendations[2]
    ]);
  });

  it('can delete a subpopulation from a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.getByRole('button', { name: /remove subpopulation/i }));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        subpopulations: []
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a rationale from a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.queryAllByRole('button', { name: /remove field/i })[0]);
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        rationale: ''
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a comment from a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[0]);
    fireEvent.change(screen.getByPlaceholderText('Add an optional comment'), {
      target: { name: 'text', value: '' }
    });
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        comment: ''
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a link from a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    userEvent.click(screen.getByRole('button', { name: /remove link/i }));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        links: []
      },
      recommendations[1],
      recommendations[2]
    ]);
  });
});
