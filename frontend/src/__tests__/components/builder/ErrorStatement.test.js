import ErrorStatement from '../../../components/builder/ErrorStatement';
import { fullRenderComponent } from '../../../utils/test_helpers';

const updateErrorStatementMock = jest.fn();

let component;
let componentWithNest;
beforeEach(() => {
  component = fullRenderComponent(ErrorStatement, {
    parameters: [],
    subpopulations: [
      { label: 'Recommendations is null', value: '"Recommendation" is null' }
    ],
    errorStatement: {
      statements: [
        {
          condition: { label: 'null', value: 'null' },
          thenClause: '',
          child: null,
          useThenClause: true
        }
      ],
      else: 'null'
    },
    updateErrorStatement: updateErrorStatementMock,
  });

  componentWithNest = fullRenderComponent(ErrorStatement, {
    parameters: [],
    subpopulations: [
      { label: 'Recommendations is null', value: '"Recommendation" is null' }
    ],
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
    updateErrorStatement: updateErrorStatementMock,
  });
});

test('ErrorStatement renders without Crashing', () => {
  expect(component).toBeDefined();
});

test('ErrorStatement adds a nested if when `And Also If` is clicked', () => {
  component.find('button').findWhere(button => button.text() === 'And Also If...').simulate('click');
  expect(updateErrorStatementMock.mock.calls[0][0].statements[0].child).not.toBeNull();
  expect(updateErrorStatementMock).toHaveBeenCalled();
});

test('ErrorStatement adds an if when `Or Else If...` is clicked', () => {
  updateErrorStatementMock.mockClear();
  component.find('button').findWhere(button => button.text() === 'Or Else If...').simulate('click');
  expect(updateErrorStatementMock.mock.calls[0][0].statements).toHaveLength(2);
  expect(updateErrorStatementMock).toHaveBeenCalled();
});

test('ErrorStatement can select one of the special populations', () => {
  component.find('Select').simulate('change', { target: { value: 'Recommendations is null' } });
  expect(updateErrorStatementMock).toHaveBeenCalled();
});

test('ErrorStatement can change `ThenClause` (on root element) input', () => {
  updateErrorStatementMock.mockClear();
  component.find('textarea[title="ThenClause"]').simulate('change', { target: { value: 'foo-thenClause' } });
  expect(updateErrorStatementMock.mock.calls[0][0].statements[0].thenClause).toBe('foo-thenClause');
});

test('ErrorStatement can change `Else` (on root element) input', () => {
  updateErrorStatementMock.mockClear();
  component.find('textarea[title="Else"]').simulate('change', { target: { value: 'bar-elseClause' } });
  expect(updateErrorStatementMock.mock.calls[0][0].elseClause).toBe('bar-elseClause');
});

test('ErrorStatement can delete an if-statement', () => {
  updateErrorStatementMock.mockClear();
  componentWithNest.find('button').findWhere(button => button.text() === 'Delete If Clause').at(0).simulate('click');
  expect(updateErrorStatementMock.mock.calls[0][0].statements).toHaveLength(1);
  expect(updateErrorStatementMock).toHaveBeenCalled();
});
