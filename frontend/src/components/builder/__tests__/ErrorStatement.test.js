import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import ErrorStatement from '../ErrorStatement';

describe('<ErrorStatement />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ErrorStatement
        errorStatement={{
          statements: [
            {
              condition: { label: 'null', value: 'null' },
              thenClause: '',
              child: null,
              useThenClause: true
            }
          ],
          else: 'null'
        }}
        parameters={[]}
        subpopulations={[{ label: 'Recommendations is null', value: '"Recommendation" is null' }]}
        updateErrorStatement={jest.fn()}
        {...props}
      />
    );

  it('adds a nested if when `And Also If` is clicked', () => {
    const updateErrorStatement = jest.fn();
    const { getByText } = renderComponent({ updateErrorStatement });

    fireEvent.click(getByText('And Also If...'));

    expect(updateErrorStatement).toHaveBeenCalled();
  });

  it('ErrorStatement adds an if when `Or Else If...` is clicked', () => {
    const updateErrorStatement = jest.fn();
    const { getByText } = renderComponent({ updateErrorStatement });

    fireEvent.click(getByText('Or Else If...'));

    expect(updateErrorStatement.mock.calls[0][0].statements).toHaveLength(2);
    expect(updateErrorStatement).toHaveBeenCalled();
  });

  it('can select one of the special populations', () => {
    const updateErrorStatement = jest.fn();
    renderComponent({ updateErrorStatement });

    userEvent.click(screen.getByLabelText('Choose if statement'));
    userEvent.click(screen.getByText('Recommendations is null'));

    expect(updateErrorStatement).toHaveBeenCalled();
  });

  it('can change `ThenClause` (on root element) input', () => {
    const updateErrorStatement = jest.fn();
    const { getByLabelText } = renderComponent({ updateErrorStatement });

    fireEvent.change(getByLabelText('ThenClause'), { target: { value: 'foo-thenClause' } });
    expect(updateErrorStatement.mock.calls[0][0].statements[0].thenClause).toBe('foo-thenClause');
  });

  it('can change `Else` (on root element) input', () => {
    const updateErrorStatement = jest.fn();
    const { getByLabelText } = renderComponent({ updateErrorStatement });

    fireEvent.change(getByLabelText('Else'), { target: { value: 'bar-elseClause' } });
    expect(updateErrorStatement.mock.calls[0][0].elseClause).toBe('bar-elseClause');
  });

  it('can delete an if-statement', () => {
    const updateErrorStatement = jest.fn();
    const { getAllByText } = renderComponent({
      errorStatement: {
        statements: [
          {
            condition: { label: null, value: null },
            thenClause: '',
            child: null,
            useThenClause: true
          },
          {
            condition: [{ label: null, value: null }],
            thenClause: '',
            child: null,
            useThenClause: true
          }
        ],
        else: 'null'
      },
      updateErrorStatement
    });

    const deleteButtons = getAllByText('Delete If Clause');
    fireEvent.click(deleteButtons[0]);

    expect(updateErrorStatement.mock.calls[0][0].statements).toHaveLength(1);
  });
});
