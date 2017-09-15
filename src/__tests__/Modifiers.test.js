import BooleanComparison from '../components/builder/modifiers/BooleanComparison';
import CheckExistence from '../components/builder/modifiers/CheckExistence';
import LabelModifier from '../components/builder/modifiers/LabelModifier';
import LookBack from '../components/builder/modifiers/LookBack';
import ValueComparisonObservation from '../components/builder/modifiers/ValueComparisonObservation';
import ValueComparison from '../components/builder/modifiers/ValueComparison';
import WithUnit from '../components/builder/modifiers/WithUnit';

import { shallowRenderComponent } from '../helpers/test_helpers';

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
  const component = shallowRenderComponent(BooleanComparison, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 80,
    value: ''
  });

  component.find('select').simulate('blur', { target: { value: 'is not true' } });
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
  const component = shallowRenderComponent(CheckExistence, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 7,
    value: ''
  });

  component.find('select').simulate('blur', { target: { value: 'is null' } });
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
  const component = shallowRenderComponent(LookBack, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 5,
    value: '',
    unit: 'days'
  });

  component.find('input').simulate('change', { target: { value: 13 } });
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { value: 13 });

  component.find('select').simulate('blur', { target: { value: 'years' } });
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
  const component = shallowRenderComponent(ValueComparisonObservation, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 303,
    minValue: '',
    minOperator: '',
    maxValue: '',
    maxOperator: ''
  });

  const minInput = component.find('input[name="Min value"]');
  const minSelect = component.find('select[name="Min Operator"]');
  const maxInput = component.find('input[name="Max value"]');
  const maxSelect = component.find('select[name="Max Operator"]');

  minInput.simulate('change', { target: { value: 21 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minValue: 21 });
  minSelect.simulate('blur', { target: { value: '<' } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { minOperator: '<' });
  maxInput.simulate('change', { target: { value: 189 } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxValue: 189 });
  maxSelect.simulate('blur', { target: { value: '!=' } });
  expect(updateAppliedModifierMock).toBeCalledWith(303, { maxOperator: '!=' });
});

test('ValueComparison renders without crashing', () => {
  const component = shallowRenderComponent(ValueComparison, {
    updateAppliedModifier: jest.fn(),
    index: '',
    min: '',
    minInclusive: '',
    max: '',
    maxInclusive: ''
  });
  expect(component).toBeDefined();
});

test('ValueComparison changes input', () => {
  const updateAppliedModifierMock = jest.fn();
  const component = shallowRenderComponent(ValueComparison, {
    updateAppliedModifier: updateAppliedModifierMock,
    index: 271,
    min: '',
    minInclusive: '',
    max: '',
    maxInclusive: ''
  });

  const minInput = component.find('input[name="min"]');
  const minCheckbox = component.find('input[name="minInclusive"]');
  const maxInput = component.find('input[name="max"]');
  const maxCheckbox = component.find('input[name="maxInclusive"]');

  minInput.simulate('change', { target: { value: 3 } });
  expect(updateAppliedModifierMock).toBeCalledWith(271, { min: 3 });
  minCheckbox.simulate('change', { target: { checked: false } });
  expect(updateAppliedModifierMock).toBeCalledWith(271, { minInclusive: false });
  maxInput.simulate('change', { target: { value: 89 } });
  expect(updateAppliedModifierMock).toBeCalledWith(271, { max: 89 });
  maxCheckbox.simulate('change', { target: { checked: true } });
  expect(updateAppliedModifierMock).toBeCalledWith(271, { maxInclusive: true });
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

  component.find('select').simulate('blur', { target: { value: 'mg/dL' } });
  expect(updateAppliedModifierMock).toHaveBeenCalled();
  expect(updateAppliedModifierMock).toBeCalledWith(5, { unit: 'mg/dL' });
});
