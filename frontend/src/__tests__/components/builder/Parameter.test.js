import Select from 'react-select';

import Parameter from '../../../components/builder/Parameter';
import BooleanEditor from '../../../components/builder/parameters/editors/BooleanEditor';
import CodeEditor from '../../../components/builder/parameters/editors/CodeEditor';
import DateTimeEditor from '../../../components/builder/parameters/editors/DateTimeEditor';
import DecimalEditor from '../../../components/builder/parameters/editors/DecimalEditor';
import IntegerEditor from '../../../components/builder/parameters/editors/IntegerEditor';
import QuantityEditor from '../../../components/builder/parameters/editors/QuantityEditor';
import StringEditor from '../../../components/builder/parameters/editors/StringEditor';
import TimeEditor from '../../../components/builder/parameters/editors/TimeEditor';
import IntervalOfIntegerEditor from '../../../components/builder/parameters/editors/IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from '../../../components/builder/parameters/editors/IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from '../../../components/builder/parameters/editors/IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from '../../../components/builder/parameters/editors/IntervalOfQuantityEditor';
import StringParameter from '../../../components/builder/parameters/types/StringParameter';
import { shallowRenderComponent } from '../../../utils/test_helpers';

let component;
let index;
let instanceNames;
let updateInstanceOfParameter;
let deleteParameter;
let vsacFHIRCredentials;
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
  vsacFHIRCredentials = { username: 'username', password: 'password' };
  setVsacAuthStatus = jest.fn();
  isValidatingCode = false;
  resetCodeValidation = jest.fn();

  baseProps = {
    index,
    instanceNames,
    updateInstanceOfParameter,
    deleteParameter,
    vsacFHIRCredentials,
    setVsacAuthStatus,
    isValidatingCode,
    validateCode,
    resetCodeValidation
  };
});

test('has correct base class', () => {
  component = shallowRenderComponent(Parameter, baseProps);
  expect(component.hasClass('parameter'));
});

test('deletes parameter', () => {
  component = shallowRenderComponent(Parameter, baseProps);
  component.find('button.danger-button').simulate('click');
  expect(deleteParameter).toHaveBeenCalledWith(index);
});

test('changes parameter type when edited', () => {
  component = shallowRenderComponent(Parameter, {
    type: 'Boolean',
    ...baseProps
  });
  component.instance().updateParameter = jest.fn();
  component.find(Select).first().props().onChange({ value: 'Integer' });
  expect(component.instance().updateParameter).toHaveBeenCalled();
});

test('displays Boolean editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Boolean',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Boolean');
  expect(component.find(BooleanEditor)).toHaveLength(1);
});

test('renders Boolean editor without crashing', () => {
  component = shallowRenderComponent(BooleanEditor, {
    id: 'test-id',
    type: 'Boolean',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Code editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Code',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Code');
  expect(component.find(CodeEditor)).toHaveLength(1);
});

test('displays Concept editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Concept',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Concept');
  expect(component.find(CodeEditor)).toHaveLength(1);
});

test('renders Code editor without crashing', () => {
  component = shallowRenderComponent(CodeEditor, {
    id: 'test-id',
    type: 'Code',
    vsacFHIRCredentials,
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Integer editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Integer',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Integer');
  expect(component.find(IntegerEditor)).toHaveLength(1);
});

test('renders Integer editor without crashing', () => {
  component = shallowRenderComponent(IntegerEditor, {
    id: 'test-id',
    type: 'Integer',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays DateTime editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'DateTime',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('DateTime');
  expect(component.find(DateTimeEditor)).toHaveLength(1);
});

test('renders DateTime editor without crashing', () => {
  component = shallowRenderComponent(DateTimeEditor, {
    id: 'test-id',
    type: 'DateTime',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Decimal editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Decimal',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Decimal');
  expect(component.find(DecimalEditor)).toHaveLength(1);
});

test('renders Decimal editor without crashing', () => {
  component = shallowRenderComponent(DecimalEditor, {
    id: 'test-id',
    type: 'Decimal',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Quantity editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Quantity',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Quantity');
  expect(component.find(QuantityEditor)).toHaveLength(1);
});

test('renders Quantity editor without crashing', () => {
  component = shallowRenderComponent(QuantityEditor, {
    id: 'test-id',
    type: 'Quantity',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays String editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'String',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('String');
  expect(component.find(StringEditor)).toHaveLength(1);
});

test('renders String editor without crashing', () => {
  component = shallowRenderComponent(StringEditor, {
    id: 'test-id',
    type: 'String',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Time editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Time',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Time');
  expect(component.find(TimeEditor)).toHaveLength(1);
});

test('renders Time editor without crashing', () => {
  component = shallowRenderComponent(TimeEditor, {
    id: 'test-id',
    type: 'Time',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Integer> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Interval<Integer>',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Interval<Integer>');
  expect(component.find(IntervalOfIntegerEditor)).toHaveLength(1);
});

test('renders Interval<Integer> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfIntegerEditor, {
    id: 'test-id',
    type: 'Interval<Integer>',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<DateTime> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Interval<DateTime>',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Interval<DateTime>');
  expect(component.find(IntervalOfDateTimeEditor)).toHaveLength(1);
});

test('renders Interval<DateTime> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfDateTimeEditor, {
    id: 'test-id',
    type: 'Interval<DateTime>',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Decimal> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Interval<Decimal>',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Interval<Decimal>');
  expect(component.find(IntervalOfDecimalEditor)).toHaveLength(1);
});

test('renders Interval<Decimal> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfDecimalEditor, {
    id: 'test-id',
    type: 'Interval<Decimal>',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Quantity> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'Interval<Quantity>',
    ...baseProps
  });
  expect(component.find(StringParameter).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('Interval<Quantity>');
  expect(component.find(IntervalOfQuantityEditor)).toHaveLength(1);
});

test('renders Interval<Quantity> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfQuantityEditor, {
    id: 'test-id',
    type: 'Interval<Quantity>',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});