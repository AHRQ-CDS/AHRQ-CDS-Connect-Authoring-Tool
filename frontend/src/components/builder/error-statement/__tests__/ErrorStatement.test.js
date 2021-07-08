import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, userEvent, screen, within } from 'utils/test-utils';
import ErrorStatement from '../ErrorStatement';
import { mockArtifact } from 'mocks/artifacts';

describe('<ErrorStatement />', () => {
  const mockArtifactWithIfCondition = {
    ...mockArtifact,
    errorStatement: {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: { value: '"Recommendation" is null', label: 'Recommendations is null' },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: ''
    }
  };

  const mockArtifactWithElseClause = {
    ...mockArtifact,
    errorStatement: {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: { value: null, label: null },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: 'foo-elseClause'
    }
  };

  const mockArtifactWithNestedStatement = {
    ...mockArtifact,
    errorStatement: {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [
            {
              id: '123',
              ifThenClauses: [
                {
                  ifCondition: {
                    label: null,
                    value: null
                  },
                  statements: [],
                  thenClause: ''
                }
              ],
              elseClause: ''
            }
          ],
          thenClause: ''
        }
      ],
      elseClause: ''
    }
  };

  const mockArtifactWithTwoStatements = {
    ...mockArtifact,
    errorStatement: {
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: ''
        },
        {
          ifCondition: {
            label: "Doesn't Meet Inclusion Criteria",
            value: 'not "MeetsInclusionCriteria"',
            uniqueId: 'default-subpopulation-1'
          },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: ''
    }
  };

  const renderComponent = ({ artifact = mockArtifact, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact } })}>
        <ErrorStatement handleUpdateErrorStatement={jest.fn()} {...props} />
      </Provider>
    );

  it('is able to select an if condition', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ handleUpdateErrorStatement });

    expect(screen.getByRole('button', { name: /choose if condition/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /choose if condition/i }));
    userEvent.click(screen.getAllByRole('option', { name: /recommendations is null/i })[0]);

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: ''
    });
  });

  it('adds a nested if statement when `And also if...` is clicked', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithIfCondition, handleUpdateErrorStatement });

    expect(screen.getByRole('button', { name: /and also if\.\.\./i })).not.toBeDisabled();

    userEvent.click(screen.getByRole('button', { name: /and also if\.\.\./i }));

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [
            {
              elseClause: '',
              id: expect.any(String),
              ifThenClauses: [
                {
                  ifCondition: {
                    label: null,
                    value: null
                  },
                  statements: [],
                  thenClause: ''
                }
              ]
            }
          ],
          thenClause: ''
        }
      ],
      elseClause: ''
    });
  });

  it('adds an if then clause when `Or else if...` is clicked', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithIfCondition, handleUpdateErrorStatement });

    expect(screen.getByRole('button', { name: /or else if\.\.\./i })).not.toBeDisabled();

    userEvent.click(screen.getByRole('button', { name: /or else if\.\.\./i }));

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: ''
        },
        {
          ifCondition: {
            label: null,
            value: null
          },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: ''
    });
  });

  it('shows the then clause warning when a statement has a selected if condition, no nested statements, and no then clause', () => {
    renderComponent({ artifact: mockArtifactWithIfCondition });

    const view = screen.getByText(/you need a statement/i);
    expect(view).toBeInTheDocument();
    expect(within(view).getByText(/then/i)).toBeInTheDocument();
  });

  it('shows the if clause warning when a statement has an else clause but no if condition selected', () => {
    renderComponent({ artifact: mockArtifactWithElseClause });

    const view = screen.getByText(/you need an statement/i);
    expect(view).toBeInTheDocument();
    expect(within(view).getByText(/if/i)).toBeInTheDocument();
  });

  it('can update the then clause', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithIfCondition, handleUpdateErrorStatement });

    fireEvent.change(screen.getByTestId('then-clause-textfield'), { target: { value: 'foo-thenClause' } });

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: 'foo-thenClause'
        }
      ],
      elseClause: ''
    });
  });

  it('can update the else clause', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithIfCondition, handleUpdateErrorStatement });

    fireEvent.change(screen.getByTestId('else-clause-textfield'), { target: { value: 'foo-elseClause' } });

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: 'foo-elseClause'
    });
  });

  it('can remove nested if then clauses when "Remove nested statements" is clicked', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithNestedStatement, handleUpdateErrorStatement });

    expect(screen.getByRole('button', { name: /remove nested statements/i })).not.toBeDisabled();

    userEvent.click(screen.getByRole('button', { name: /remove nested statements/i }));

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      elseClause: '',
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: 'Recommendations is null',
            value: '"Recommendation" is null'
          },
          statements: [],
          thenClause: ''
        }
      ]
    });
  });

  it('can not delete an if then clause if only one exists', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithIfCondition, handleUpdateErrorStatement });

    expect(screen.queryByRole('button', { name: /delete-if-then-clause/i })).not.toBeInTheDocument();
  });

  it('can delete an if then clause if more than one exist', () => {
    const handleUpdateErrorStatement = jest.fn();
    renderComponent({ artifact: mockArtifactWithTwoStatements, handleUpdateErrorStatement });

    expect(screen.getAllByRole('button', { name: /delete-if-then-clause/i })).toHaveLength(2);

    userEvent.click(screen.getAllByRole('button', { name: /delete-if-then-clause/i })[0]);

    expect(handleUpdateErrorStatement).toHaveBeenCalledWith({
      id: 'root',
      ifThenClauses: [
        {
          ifCondition: {
            label: "Doesn't Meet Inclusion Criteria",
            uniqueId: 'default-subpopulation-1',
            value: 'not "MeetsInclusionCriteria"'
          },
          statements: [],
          thenClause: ''
        }
      ],
      elseClause: ''
    });
  });
});
