import Select from 'react-select';

import Parameter from '../components/builder/Parameter';
import Parameters from '../components/builder/Parameters';
import NumberField from '../components/builder/fields/NumberField';
import StaticField from '../components/builder/fields/StaticField';
import StringField from '../components/builder/fields/StringField';
import ValueSetField from '../components/builder/fields/ValueSetField';
import { shallowRenderComponent } from '../utils/test_helpers';

test('Parameter renders without crashing', () => {
  const component = shallowRenderComponent(Parameter, {
    getAllInstancesInAllTrees: jest.fn(),
    updateInstanceOfParameter: jest.fn(),
    deleteParameter: jest.fn(),
    index: '',
    instanceNames: [],
    value: '',
    name: ''
  });
  expect(component).toBeDefined();
});

test('Parameter changes input', () => {
  const updateInstanceOfParameterMock = jest.fn();
  const component = shallowRenderComponent(Parameter, {
    getAllInstancesInAllTrees: jest.fn(),
    updateInstanceOfParameter: updateInstanceOfParameterMock,
    deleteParameter: jest.fn(),
    index: '',
    instanceNames: [],
    value: '',
    name: '',
    id: 'test-id'
  });

  const selectInput = component.find(Select);
  selectInput.simulate('change', { value: '' });
  expect(updateInstanceOfParameterMock).toHaveBeenCalled();
  expect(updateInstanceOfParameterMock.mock.calls[0][0])
    .toEqual({ name: '', type: '', value: null, uniqueId: 'test-id' });

  component.instance().updateParameter = jest.fn();
  selectInput.simulate('change', { value: '' });
  expect(component.instance().updateParameter).toHaveBeenCalled();
});

test('Parameters renders without crashing', () => {
  const component = shallowRenderComponent(Parameters, {
    parameters: [],
    updateParameters: jest.fn()
  });
  expect(component).toBeDefined();
});

test('Parameters adds parameter', () => {
  const updateParameterMock = jest.fn();
  const component = shallowRenderComponent(Parameters, {
    parameters: [],
    updateParameters: updateParameterMock
  });

  component.find('button').simulate('click');

  expect(updateParameterMock).toHaveBeenCalledWith([
    { name: null, type: 'boolean', value: null, uniqueId: 'parameter-1', comment: null }
  ]);
});

test('NumberField renders without crashing', () => {
  const component = shallowRenderComponent(NumberField, {
    value: '',
    typeOfNumber: 'integer',
    updateInstance: jest.fn(),
    field: {
      exclusive: false,
      name: '',
      id: '',
    }
  });
  expect(component).toBeDefined();
});

test('NumberField changes input with type integer', () => {
  const updateInstanceMock = jest.fn();

  const component = shallowRenderComponent(NumberField, {
    value: '',
    typeOfNumber: 'integer',
    updateInstance: updateInstanceMock,
    field: {
      exclusive: false,
      name: '',
      id: '',
    }
  });


  const numberInput = component.find('input[type="number"]');
  const checkboxInput = component.find('input[type="checkbox"]');

  numberInput.value = 10;
  numberInput.simulate('change', { target: { name: numberInput.name, value: numberInput.value } });
  expect(updateInstanceMock).toHaveBeenCalled();
  expect(updateInstanceMock).toBeCalledWith({ [numberInput.name]: numberInput.value });

  checkboxInput.simulate('change', { target: { checked: true } });
  expect(component.state('checked')).toEqual(true);

  component.instance().updateExclusive = jest.fn();
  checkboxInput.simulate('change', { target: { checked: false } });
  expect(component.instance().updateExclusive).toHaveBeenCalled();
});

test('NumberField changes input with type not integer', () => {
  const updateInstanceMock = jest.fn();

  const component = shallowRenderComponent(NumberField, {
    value: '',
    typeOfNumber: 'float',
    updateInstance: updateInstanceMock,
    field: {
      exclusive: false,
      name: '',
      id: '',
    }
  });


  const numberInput = component.find('input[type="number"]');
  const checkboxInput = component.find('input[type="checkbox"]');

  numberInput.value = 10.02345;
  numberInput.simulate('change', { target: { name: numberInput.name, value: numberInput.value } });
  expect(updateInstanceMock).toHaveBeenCalled();
  expect(updateInstanceMock).toBeCalledWith({ [numberInput.name]: numberInput.value });

  checkboxInput.simulate('change', { target: { checked: true } });
  expect(component.state('checked')).toEqual(true);

  component.instance().updateExclusive = jest.fn();
  checkboxInput.simulate('change', { target: { checked: false } });
  expect(component.instance().updateExclusive).toHaveBeenCalled();
});

test('StaticField renders without crashing', () => {
  const component = shallowRenderComponent(StaticField);
  expect(component).toBeDefined();
});

test('StringField renders without crashing', () => {
  const component = shallowRenderComponent(StringField, { updateInstance: jest.fn(), name: '' });
  expect(component).toBeDefined();
});

test('ValueSetField renders without crashing', () => {
  const component = shallowRenderComponent(ValueSetField, {
    loadValueSets: jest.fn(),
    updateInstance: jest.fn(),
    field: {
      id: '',
      value: '',
      select: ''
    }
  });
  expect(component).toBeDefined();
});

test('ValueSetField changes input', () => {
  const updateInstanceMock = jest.fn();

  const component = shallowRenderComponent(ValueSetField, {
    loadValueSets: jest.fn(),
    updateInstance: updateInstanceMock,
    field: {
      id: '',
      value: '',
      select: ''
    }
  });

  const selectInput = component.find(Select);
  selectInput.simulate('change');
  expect(updateInstanceMock).toHaveBeenCalled();
});
