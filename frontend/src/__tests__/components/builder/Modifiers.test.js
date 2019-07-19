import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import BooleanComparison from '../../../components/builder/modifiers/BooleanComparison';
import CheckExistence from '../../../components/builder/modifiers/CheckExistence';
import LabelModifier from '../../../components/builder/modifiers/LabelModifier';
import LookBack from '../../../components/builder/modifiers/LookBack';
import SelectModifier from '../../../components/builder/modifiers/SelectModifier';
import StringModifier from '../../../components/builder/modifiers/StringModifier';
import NumberModifier from '../../../components/builder/modifiers/NumberModifier';
import QuantityModifier from '../../../components/builder/modifiers/QuantityModifier';
import DateTimeModifier from '../../../components/builder/modifiers/DateTimeModifier';
import DateTimePrecisionModifier from '../../../components/builder/modifiers/DateTimePrecisionModifier';
import TimePrecisionModifier from '../../../components/builder/modifiers/TimePrecisionModifier';
import Qualifier from '../../../components/builder/modifiers/Qualifier';
import ValueComparisonObservation from '../../../components/builder/modifiers/ValueComparisonObservation';
import ValueComparisonNumber from '../../../components/builder/modifiers/ValueComparisonNumber';
import WithUnit from '../../../components/builder/modifiers/WithUnit';

import { shallowRenderComponent, fullRenderComponent } from '../../../utils/test_helpers';

test('BooleanComparison renders without crashing', () => {
  const component = shallowRenderComponent(BooleanComparison, {
    updateAppliedModifier: jest.fn(),
    index: '',
    value: ''
  });
  expect(component).toBeDefined();
});

test('BooleanComparison changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(BooleanComparison, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 80,
    value: ''
  });

  component.find('.Select input').simulate('change', { target: { value: 'is not true' } });
  component.find('.Select input').simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(80, { value: 'is not true' });
});

test('CheckExistence renders without crashing', () => {
  const component = shallowRenderComponent(CheckExistence, {
    updateAppliedModifier: jest.fn(),
    index: '',
    value: ''
  });
  expect(component).toBeDefined();
});

test('CheckExistence changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(CheckExistence, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 7,
    value: ''
  });

  component.find('.Select input').simulate('change', { target: { value: 'is null' } });
  component.find('.Select input').simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(7, { value: 'is null' });
});

test('LabelModifier renders without crashing', () => {
  const component = shallowRenderComponent(LabelModifier, {
    name: ''
  });
  expect(component).toBeDefined();
});

test('LookBack renders without crashing', () => {
  const component = shallowRenderComponent(LookBack, {
    updateAppliedModifier: jest.fn(),
    index: '',
    value: '',
    unit: ''
  });
  expect(component).toBeDefined();
});

test('LookBack changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(LookBack, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    value: '',
    unit: 'days'
  });

  component.find('input').at(0).simulate('change', { target: { value: 13 } });
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { value: 13 });

  const unitSelect = component.find('.Select input [aria-label="Unit Select"]');
  unitSelect.simulate('change', { target: { value: 'years' } });
  unitSelect.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toBeCalledWith(5, { unit: 'years' });
});

test('ValueComparisonObservation renders without crashing', () => {
  const component = shallowRenderComponent(ValueComparisonObservation, {
    updateAppliedModifier: jest.fn(),
    index: '',
    minValue: '',
    minOperator: '',
    maxValue: '',
    maxOperator: ''
  });
  expect(component).toBeDefined();
});

test('ValueComparisonObservation changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(ValueComparisonObservation, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 303,
    minValue: '',
    minOperator: '',
    maxValue: '',
    maxOperator: ''
  });

  const minInput = component.find('input[name="Min value"]');
  const minSelect = component.find('.Select input [aria-label="Min Operator"]');
  const maxInput = component.find('input[name="Max value"]');
  const maxSelect = component.find('.Select input [aria-label="Max Operator"]');

  minInput.simulate('change', { target: { value: 21 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minValue: 21 });
  minSelect.simulate('change', { target: { value: '<' } });
  minSelect.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minOperator: '<' });
  maxInput.simulate('change', { target: { value: 189 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxValue: 189 });
  maxSelect.simulate('change', { target: { value: '!=' } });
  maxSelect.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxOperator: '!=' });
});

test('ValueComparisonNumber renders without crashing', () => {
  const component = shallowRenderComponent(ValueComparisonNumber, {
    updateAppliedModifier: jest.fn(),
    index: '',
    minValue: '',
    minOperator: '',
    maxValue: '',
    maxOperator: ''
  });
  expect(component).toBeDefined();
});

test('ValueComparisonNumber changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(ValueComparisonNumber, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 303,
    minValue: '',
    minOperator: '',
    maxValue: '',
    maxOperator: ''
  });

  const minInput = component.find('input[name="Min value"]');
  const minSelect = component.find('.Select input [aria-label="Min Operator"]');
  const maxInput = component.find('input[name="Max value"]');
  const maxSelect = component.find('.Select input [aria-label="Max Operator"]');

  minInput.simulate('change', { target: { value: 21 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minValue: 21 });
  minSelect.simulate('change', { target: { value: '<' } });
  minSelect.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minOperator: '<' });
  maxInput.simulate('change', { target: { value: 189 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxValue: 189 });
  maxSelect.simulate('change', { target: { value: '!=' } });
  maxSelect.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxOperator: '!=' });
});

test('WithUnit renders without crashing', () => {
  const component = shallowRenderComponent(WithUnit, {
    updateAppliedModifier: jest.fn(),
    index: '',
    unit: ''
  });
  expect(component).toBeDefined();
});

test('WithUnit changes select', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(WithUnit, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    unit: ''
  });

  component.find('.with-unit-ucum').simulate('change', { target: { value: 'mg/dL' } });
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { unit: 'mg/dL' });
});

test('SelectModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(SelectModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    name: '',
    options: []
  });
  expect(component).toBeDefined();
});

test('SelectModifier changes select', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(SelectModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    name: '',
    options: [{ name: 'Convert.to_mg_per_dL', description: 'mmol/L to mg/dL' }],
    value: ''
  });

  component.find('.Select input').simulate('change', { target: { value: 'mmol/L to mg/dL' } });
  component.find('.Select input').simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(6, {
    value: 'Convert.to_mg_per_dL', templateName: 'Convert.to_mg_per_dL', description: 'mmol/L to mg/dL'
  });
});

test('StringModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(StringModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: ''
  });
  expect(component).toBeDefined();
});

test('StringModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(StringModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: ''
  });

  const input = component.find('input');

  input.simulate('change', { target: { value: 'test' } });
  expect(updateAppliedModifierMock).toBeCalledWith(6, { value: 'test' });
});

test('NumberModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(NumberModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: ''
  });
  expect(component).toBeDefined();
});

test('NumberModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(NumberModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: ''
  });

  const input = component.find('input');

  input.simulate('change', { target: { value: 3 } });
  expect(updateAppliedModifierMock).toBeCalledWith(6, { value: 3 });
});

test('QuantityModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(QuantityModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: '',
    unit: ''
  });
  expect(component).toBeDefined();
});

test('QuantityModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(QuantityModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    value: '',
    unit: ''
  });

  const valueInput = component.find('.quantity-modifier-value');
  const unitInput = component.find('.quantity-modifier-unit');

  valueInput.simulate('change', { target: { value: 3 } });
  expect(updateAppliedModifierMock).toBeCalledWith(6, { value: 3 });
  unitInput.simulate('change', { target: { value: 'mg/dL' } });
  expect(updateAppliedModifierMock).lastCalledWith(6, { unit: 'mg/dL' });
});

test('DateTimeModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(DateTimeModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    date: '',
    time: ''
  });
  expect(component).toBeDefined();
});

test('DateTimeModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(DateTimeModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    date: '',
    time: ''
  });

  const datePicker = component.find(DatePicker);
  const timePicker = component.find(TimePicker);

  datePicker.simulate('change', moment('2000-03-02'));
  expect(updateAppliedModifierMock).toBeCalledWith(6, { date: '@2000-03-02', time: '' });
  timePicker.simulate('change', moment('2000-03-02 12:00:01'));
  expect(updateAppliedModifierMock).lastCalledWith(6, { date: '', time: 'T12:00:01' });
});

test('DateTimePrecisionModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(DateTimePrecisionModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    date: '',
    time: '',
    precision: ''
  });
  expect(component).toBeDefined();
});

test('DateTimePrecisionModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(DateTimePrecisionModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    date: '',
    time: '',
    precision: ''
  });

  const datePicker = component.find(DatePicker);
  const timePicker = component.find(TimePicker);
  const select = component.find('Select');

  datePicker.simulate('change', moment('2000-03-02'));
  expect(updateAppliedModifierMock).toBeCalledWith(6, { date: '@2000-03-02', time: '', precision: '' });
  timePicker.simulate('change', moment('2000-03-02 12:00:01'));
  expect(updateAppliedModifierMock).lastCalledWith(6, { date: '', time: 'T12:00:01', precision: '' });
  select.simulate('change', { value: 'year', label: 'year' });
  expect(updateAppliedModifierMock).lastCalledWith(6, { date: '', time: '', precision: 'year' });
});

test('TimePrecisionModifier renders without crashing', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(TimePrecisionModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    time: '',
    precision: ''
  });
  expect(component).toBeDefined();
});

test('TimePrecisionModifier changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(TimePrecisionModifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 6,
    time: '',
    precision: ''
  });

  const timePicker = component.find(TimePicker);
  const select = component.find('Select');

  timePicker.simulate('change', moment('2000-03-02 12:00:01'));
  expect(updateAppliedModifierMock).lastCalledWith(6, { time: '@T12:00:01', precision: '' });
  select.simulate('change', { value: 'year', label: 'year' });
  expect(updateAppliedModifierMock).lastCalledWith(6, { time: '', precision: 'year' });
});

test('Qualifier renders without crashing', () => {
  const component = shallowRenderComponent(Qualifier, {
    updateAppliedModifier: jest.fn(),
    index: '',
    qualifier: ''
  });
  expect(component).toBeDefined();
});

test('Qualifier selects type of qualifier', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = fullRenderComponent(Qualifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    qualifier: ''
  });

  component.find('.Select input').simulate('change', { target: { value: 'value is a code from' } });
  component.find('.Select input').simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validate the selection
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, {
    qualifier: 'value is a code from',
    valueSet: null,
    code: null
  });
});

test('Qualifier allows value set selection', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(Qualifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    qualifier: 'value is a code from'
  });

  const valueSet = { name: 'Test', oid: 'test' };

  component.instance().handleVSAdded(valueSet);
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { valueSet });
});

test('Qualifier allows code selection', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(Qualifier, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    qualifier: 'value is the code'
  });

  const code = { name: 'Test', oid: 'test' };

  component.instance().handleCodeAdded(code);
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { code });
});
