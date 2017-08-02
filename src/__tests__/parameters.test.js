import Select from 'react-select';
import Parameter from '../components/builder/Parameter';
import Parameters from '../components/builder/Parameters';
import NumberParameter from '../components/builder/parameters/NumberParameter';
import StaticParameter from '../components/builder/parameters/StaticParameter';
import StringParameter from '../components/builder/parameters/StringParameter';
import ValueSetParameter from '../components/builder/parameters/ValueSetParameter';
import { shallowRenderComponent } from '../helpers/test_helpers';

test('Parameter renders without crashing', () => {
  const component = shallowRenderComponent(Parameter);
  expect(component).toBeDefined();
});

test('Parameters renders without crashing', () => {
  const component = shallowRenderComponent(Parameters);
  expect(component).toBeDefined();
});

test('NumberParameter renders without crashing', () => {
  const component = shallowRenderComponent(NumberParameter, {
    value: '',
    typeOfNumber: 'integer',
    updateInstance: jest.fn(),
    param: {
      exclusive: false,
      name: '',
      id: '',
    }
  });
  expect(component).toBeDefined();
});

test('NumberParameter changes input', () => {
  const updateInstanceMock = jest.fn();

  const component = shallowRenderComponent(NumberParameter, {
    value: '',
    typeOfNumber: 'integer',
    updateInstance: updateInstanceMock,
    param: {
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

  checkboxInput.simulate('change', { target: { checked: false } });
  expect(component.state('checked')).toEqual(false);
});

test('StaticParameter renders without crashing', () => {
  const component = shallowRenderComponent(StaticParameter);
  expect(component).toBeDefined();
});

test('StringParameter renders without crashing', () => {
  const component = shallowRenderComponent(StringParameter);
  expect(component).toBeDefined();
});

test('ValueSetParameter renders without crashing', () => {
  const component = shallowRenderComponent(ValueSetParameter, {
    updateInstance:  jest.fn(),
    param: {
      id: '',
      value: '',
      select: ''
    }
  });
  expect(component).toBeDefined();
});

test('ValueSetParameter changes input', () => {
  const updateInstanceMock = jest.fn();

  const component = shallowRenderComponent(ValueSetParameter, {
    updateInstance: updateInstanceMock,
    param: {
      id: '',
      value: '',
      select: ''
    }
  });

  const selectInput = component.find(Select);
  selectInput.simulate('change');
  expect(updateInstanceMock).toHaveBeenCalled();
});
