import Select from 'react-select';

import Parameter from '../../../components/builder/Parameter';
import BooleanEditor from '../../../components/builder/parameters/BooleanEditor';
import CodeEditor from '../../../components/builder/parameters/CodeEditor';
import DateTimeEditor from '../../../components/builder/parameters/DateTimeEditor';
import DecimalEditor from '../../../components/builder/parameters/DecimalEditor';
import IntegerEditor from '../../../components/builder/parameters/IntegerEditor';
import QuantityEditor from '../../../components/builder/parameters/QuantityEditor';
import StringEditor from '../../../components/builder/parameters/StringEditor';
import TimeEditor from '../../../components/builder/parameters/TimeEditor';
import IntervalOfIntegerEditor from '../../../components/builder/parameters/IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from '../../../components/builder/parameters/IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from '../../../components/builder/parameters/IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from '../../../components/builder/parameters/IntervalOfQuantityEditor';
import StringField from '../../../components/builder/fields/StringField';
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
let getAllInstancesInAllTrees;
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
  getAllInstancesInAllTrees = jest.fn();

  baseProps = {
    index,
    instanceNames,
    updateInstanceOfParameter,
    deleteParameter,
    vsacFHIRCredentials,
    setVsacAuthStatus,
    isValidatingCode,
    validateCode,
    resetCodeValidation,
    getAllInstancesInAllTrees
  };
});

test('has correct base class', () => {
  component = shallowRenderComponent(Parameter, baseProps);
  expect(component.hasClass('parameter'));
});

test('deletes parameter', () => {
  component = shallowRenderComponent(Parameter, baseProps);
  component.find('button.delete-button').simulate('click');
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
    type: 'boolean',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('boolean');
  expect(component.find(BooleanEditor)).toHaveLength(1);
});

test('renders Boolean editor without crashing', () => {
  component = shallowRenderComponent(BooleanEditor, {
    id: 'test-id',
    type: 'boolean',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Code editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'system_code',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('system_code');
  expect(component.find(CodeEditor)).toHaveLength(1);
});

test('displays Concept editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'system_concept',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('system_concept');
  expect(component.find(CodeEditor)).toHaveLength(1);
});

test('renders Code editor without crashing', () => {
  component = shallowRenderComponent(CodeEditor, {
    id: 'test-id',
    type: 'system_code',
    vsacFHIRCredentials,
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Integer editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'integer',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('integer');
  expect(component.find(IntegerEditor)).toHaveLength(1);
});

test('renders Integer editor without crashing', () => {
  component = shallowRenderComponent(IntegerEditor, {
    id: 'test-id',
    type: 'integer',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays DateTime editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'datetime',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('datetime');
  expect(component.find(DateTimeEditor)).toHaveLength(1);
});

test('renders DateTime editor without crashing', () => {
  component = shallowRenderComponent(DateTimeEditor, {
    id: 'test-id',
    type: 'datetime',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Decimal editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'decimal',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('decimal');
  expect(component.find(DecimalEditor)).toHaveLength(1);
});

test('renders Decimal editor without crashing', () => {
  component = shallowRenderComponent(DecimalEditor, {
    id: 'test-id',
    type: 'decimal',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Quantity editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'system_quantity',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('system_quantity');
  expect(component.find(QuantityEditor)).toHaveLength(1);
});

test('renders Quantity editor without crashing', () => {
  component = shallowRenderComponent(QuantityEditor, {
    id: 'test-id',
    type: 'system_quantity',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays String editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'string',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('string');
  expect(component.find(StringEditor)).toHaveLength(1);
});

test('renders String editor without crashing', () => {
  component = shallowRenderComponent(StringEditor, {
    id: 'test-id',
    type: 'string',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Time editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'time',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('time');
  expect(component.find(TimeEditor)).toHaveLength(1);
});

test('renders Time editor without crashing', () => {
  component = shallowRenderComponent(TimeEditor, {
    id: 'test-id',
    type: 'time',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Integer> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'interval_of_integer',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('interval_of_integer');
  expect(component.find(IntervalOfIntegerEditor)).toHaveLength(1);
});

test('renders Interval<Integer> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfIntegerEditor, {
    id: 'test-id',
    type: 'interval_of_integer',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<DateTime> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'interval_of_datetime',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('interval_of_datetime');
  expect(component.find(IntervalOfDateTimeEditor)).toHaveLength(1);
});

test('renders Interval<DateTime> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfDateTimeEditor, {
    id: 'test-id',
    type: 'interval_of_datetime',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Decimal> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'interval_of_decimal',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('interval_of_decimal');
  expect(component.find(IntervalOfDecimalEditor)).toHaveLength(1);
});

test('renders Interval<Decimal> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfDecimalEditor, {
    id: 'test-id',
    type: 'interval_of_decimal',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});

test('displays Interval<Quantity> editor', () => {
  component = shallowRenderComponent(Parameter, {
    name: 'testParam',
    type: 'interval_of_quantity',
    ...baseProps
  });
  expect(component.find(StringField).props().value).toEqual('testParam');
  expect(component.find(Select).first().props().value).toEqual('interval_of_quantity');
  expect(component.find(IntervalOfQuantityEditor)).toHaveLength(1);
});

test('renders Interval<Quantity> editor without crashing', () => {
  component = shallowRenderComponent(IntervalOfQuantityEditor, {
    id: 'test-id',
    type: 'interval_of_quantity',
    updateInstance: jest.fn()
  });
  expect(component).toBeDefined();
});
