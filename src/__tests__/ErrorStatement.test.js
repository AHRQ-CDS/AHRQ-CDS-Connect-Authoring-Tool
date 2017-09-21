import ErrorStatement from '../components/builder/ErrorStatement';
import { fullRenderComponent } from '../helpers/test_helpers';

const updateParentStateMock = jest.fn();

let component;
let componentWithNest;
beforeEach(() => {
  component = fullRenderComponent(ErrorStatement, {
    booleanParameters: [],
    subpopulations: [
      { label: 'Recommendations is null', value: '"Recommendation" is null' }
    ],
    errorStatement: {
      statements: [
        { condition: { label: null, value: null },
          thenClause: '',
          child: null,
          useThenClause: true },
      ],
      else: 'null'
    },
    updateParentState: updateParentStateMock,
  });

  componentWithNest = fullRenderComponent(ErrorStatement, {
    booleanParameters: [],
    subpopulations: [
      { label: 'Recommendations is null', value: '"Recommendation" is null' }
    ],
    errorStatement: {
      statements: [
        { condition: { label: null, value: null },
          thenClause: '',
          child: null,
          useThenClause: true },
        { condition: [{ label: null, value: null }],
          thenClause: '',
          child: null,
          useThenClause: true }
      ],
      else: 'null'
    },
    updateParentState: updateParentStateMock,
  });
});

test('ErrorStatement renders without Crashing', () => {
  expect(component).toBeDefined();
});

test('ErrorStatement adds a nested if when `And Also If` is clicked', () => {
  component.find('button').findWhere(button => button.text() === 'And Also If...').simulate('click');
  expect(updateParentStateMock.mock.calls[0][0].errorStatement.statements[0].child).not.toBeNull();
  expect(updateParentStateMock).toHaveBeenCalled();
});

test('ErrorStatement adds an if when `Or Else If...` is clicked', () => {
  updateParentStateMock.mockClear();
  component.find('button').findWhere(button => button.text() === ' Or Else If... ').simulate('click');
  expect(updateParentStateMock.mock.calls[0][0].errorStatement.statements).toHaveLength(2);
  expect(updateParentStateMock).toHaveBeenCalled();
});

test('ErrorStatement can select one of the special populations', () => {
  component.find('Select').simulate('change', { target: { value: 'Recommendations is null' } });
  expect(updateParentStateMock).toHaveBeenCalled();
});

test('ErrorStatement can change `ThenClause` (on root element) input', () => {
  updateParentStateMock.mockClear();
  component.find('textarea[title="ThenClause"]').simulate('change', { target: { value: 'foo-thenClause' } });
  expect(updateParentStateMock.mock.calls[0][0].errorStatement.statements[0].thenClause).toBe('foo-thenClause');
});

test('ErrorStatement can change `Else` (on root element) input', () => {
  updateParentStateMock.mockClear();
  component.find('textarea[title="Else"]').simulate('change', { target: { value: 'bar-elseClause' } });
  expect(updateParentStateMock.mock.calls[0][0].errorStatement.elseClause).toBe('bar-elseClause');
});

test('ErrorStatement can delete an if-statement', () => {
  updateParentStateMock.mockClear();
  componentWithNest.find('button').findWhere(button => button.text() === ' Delete If Clause ').at(0).simulate('click');
  expect(updateParentStateMock.mock.calls[0][0].errorStatement.statements).toHaveLength(1);
  expect(updateParentStateMock).toHaveBeenCalled();
});
