import Parameters from '../../../components/builder/Parameters';
import Parameter from '../../../components/builder/Parameter';
import { fullRenderComponent } from '../../../utils/test_helpers';

let component;
let componentWithParams;
let instanceNames;
let updateParameters;
let existingParam;
const existingParamUid = 'parameter-100';
let baseProps;

beforeEach(() => {
  updateParameters = jest.fn();
  instanceNames = [];
  existingParam = {
    id: existingParamUid,
    name: 'boolParam',
    type: 'Boolean',
    value: true
  };

  baseProps = {
    updateParameters,
    instanceNames
  };

  component = fullRenderComponent(Parameters, {
    parameters: [],
    ...baseProps
  });

  componentWithParams = fullRenderComponent(Parameters, {
    parameters: [existingParam],
    ...baseProps
  });
});

test('has correct base class', () => {
  component.hasClass('parameters');
});

test('renders a list of parameters', () => {
  expect(componentWithParams.find(Parameter)).toHaveLength(1);
});

test('can add a new parameter with button', () => {
  component.find('button').at(0).simulate('click');

  expect(updateParameters).toHaveBeenLastCalledWith([
    expect.objectContaining({ name: null, type: null, value: null })
  ]);
});

test('updates a parameter', () => {
  const newParam = { name: 'boolParam', type: 'Boolean', value: false };
  componentWithParams.instance().updateInstanceOfParameter(newParam, 0);

  existingParam = newParam;

  expect(updateParameters).toHaveBeenCalledWith([existingParam]);
});

test('deletes a parameter', () => {
  componentWithParams.instance().deleteParameter(0);

  expect(updateParameters).toHaveBeenCalledWith([]);
});
