import Select from 'react-select';

import Parameter from '../../../components/builder/Parameter';
import StringParameter from '../../../components/builder/parameters/types/StringParameter';
import { fullRenderComponent } from '../../../utils/test_helpers';

let component;
let index;
let instanceNames;
let updateInstanceOfParameter;
let deleteParameter;
let setVsacAuthStatus;
let isValidatingCode;
let validateCode;
let resetCodeValidation;
let baseProps;

beforeEach(() => {
  index = 0;
  instanceNames = [];
  updateInstanceOfParameter = jest.fn();
  deleteParameter = jest.fn();
  setVsacAuthStatus = jest.fn();
  isValidatingCode = false;
  resetCodeValidation = jest.fn();

  baseProps = {
    index,
    instanceNames,
    updateInstanceOfParameter,
    deleteParameter,
    setVsacAuthStatus,
    isValidatingCode,
    validateCode,
    resetCodeValidation
  };
});

test('has correct base class', () => {
  component = fullRenderComponent(Parameter, baseProps);
  component.hasClass('parameter');
});

test('deletes parameter', () => {
  component = fullRenderComponent(Parameter, baseProps);
  component.find('button.danger-button').simulate('click');
  expect(deleteParameter).toHaveBeenCalledWith(index);
});

test('displays parameter name and type when passed in as prop', () => {
  component = fullRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Boolean',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Boolean');
});

test('changes parameter type when edited', () => {
  component = fullRenderComponent(Parameter, {
    type: 'Boolean',
    ...baseProps
  });
  component.instance().updateParameter = jest.fn();
  component.find(Select).first().props().onChange({ value: 'Integer' });
  expect(component.instance().updateParameter).toHaveBeenCalled();
});
