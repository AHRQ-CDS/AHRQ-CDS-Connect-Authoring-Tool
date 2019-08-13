import Select from 'react-select';

import NumberField from '../components/builder/fields/NumberField';
import StaticField from '../components/builder/fields/StaticField';
import StringField from '../components/builder/fields/StringField';
import ValueSetField from '../components/builder/fields/ValueSetField';
import { shallowRenderComponent } from '../utils/test_helpers';

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
