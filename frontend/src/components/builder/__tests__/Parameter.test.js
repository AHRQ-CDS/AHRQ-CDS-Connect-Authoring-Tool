import React from 'react';
import Parameter from '../Parameter';
import { render, fireEvent, openSelect } from '../../../utils/test-utils';

jest.mock('../editors/CodeEditor', () => () => <div>CodeEditor</div>);
jest.mock('../editors/BooleanEditor', () => () => <div>BooleanEditor</div>);
jest.mock('../editors/IntegerEditor', () => () => <div>IntegerEditor</div>);
jest.mock('../editors/DateTimeEditor', () => () => <div>DateTimeEditor</div>);
jest.mock('../editors/DecimalEditor', () => () => <div>DecimalEditor</div>);
jest.mock('../editors/QuantityEditor', () => () => <div>QuantityEditor</div>);
jest.mock('../editors/StringEditor', () => () => <div>StringEditor</div>);
jest.mock('../editors/TimeEditor', () => () => <div>TimeEditor</div>);
jest.mock('../editors/IntervalOfIntegerEditor', () => () => <div>IntervalOfIntegerEditor</div>);
jest.mock('../editors/IntervalOfDateTimeEditor', () => () => <div>IntervalOfDateTimeEditor</div>);
jest.mock('../editors/IntervalOfDecimalEditor', () => () => <div>IntervalOfDecimalEditor</div>);
jest.mock('../editors/IntervalOfQuantityEditor', () => () => <div>IntervalOfQuantityEditor</div>);

describe('<Parameter />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Parameter
        comment=""
        deleteParameter={jest.fn()}
        getAllInstancesInAllTrees={jest.fn()}
        id="test-id"
        index={0}
        instanceNames={[]}
        isValidatingCode={false}
        isValidCode={false}
        name=""
        resetCodeValidation={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        type=""
        updateInstanceOfParameter={jest.fn()}
        validateCode={jest.fn()}
        value={null}
        vsacFHIRCredentials={{ username: 'username', password: 'password' }}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('can be named', () => {
    const updateInstanceOfParameter = jest.fn();

    const { getByLabelText } = renderComponent({
      type: 'boolean',
      updateInstanceOfParameter
    });

    fireEvent.change(getByLabelText('Parameter Name'), { target: { value: 'Parameter 007' } });

    expect(updateInstanceOfParameter).toBeCalledWith(
      {
        comment: '',
        name: 'Parameter 007',
        type: 'boolean',
        uniqueId: 'test-id',
        value: null
      },
      0
    );
  });

  it('can be deleted', () => {
    const deleteParameter = jest.fn();
    const index = 5;
    const { getByLabelText } = renderComponent({
      type: 'boolean',
      deleteParameter,
      index
    });

    fireEvent.click(getByLabelText('Delete Parameter'));

    expect(deleteParameter).toBeCalledWith(index);
  });

  it('changes parameter type when edited', () => {
    const updateInstanceOfParameter = jest.fn();
    const { getByText, getByLabelText } = renderComponent({ type: 'boolean', updateInstanceOfParameter });

    openSelect(getByLabelText('Select Parameter Type'));
    fireEvent.click(getByText('Integer'));

    expect(updateInstanceOfParameter).toBeCalledWith(
      {
        comment: '',
        name: '',
        type: 'integer',
        uniqueId: 'test-id',
        value: null
      },
      0
    );
  });

  it('can be collapsed and expanded', () => {
    const collapseParameter = jest.fn();
    const { getByLabelText } = renderComponent({
      type: 'boolean',
      collapseParameter,
    });
    //collapse the parameter
    fireEvent.click(getByLabelText('hide-'));
    expect(getByLabelText('Type')).not.toBeNull();
    //expand the parameter
    fireEvent.click(getByLabelText('hide-'));
    expect(getByLabelText('Select Parameter Type')).not.toBeNull();
  });

  describe('parameter component rendering', () => {
    it('displays the Boolean editor when the type is boolean', () => {
      const { getByText } = renderComponent({ type: 'boolean' });

      expect(getByText('BooleanEditor')).not.toBeNull();
    });

    it('displays the Code editor when the type is system_code', () => {
      const { getByText } = renderComponent({ type: 'system_code' });

      expect(getByText('CodeEditor')).not.toBeNull();
    });

    it('displays the Code editor when the type is system_concept', () => {
      const { getByText } = renderComponent({ type: 'system_concept' });

      expect(getByText('CodeEditor')).not.toBeNull();
    });

    it('displays the Integer editor when the type is integer', () => {
      const { getByText } = renderComponent({ type: 'integer' });

      expect(getByText('IntegerEditor')).not.toBeNull();
    });

    it('displays the DateTime editor when the type is datetime', () => {
      const { getByText } = renderComponent({ type: 'datetime' });

      expect(getByText('DateTimeEditor')).not.toBeNull();
    });

    it('displays the Decimal editor when the type is decimal', () => {
      const { getByText } = renderComponent({ type: 'decimal' });

      expect(getByText('DecimalEditor')).not.toBeNull();
    });

    it('displays the Quantity editor when the type is system_quantity', () => {
      const { getByText } = renderComponent({ type: 'system_quantity' });

      expect(getByText('QuantityEditor')).not.toBeNull();
    });

    it('displays the String editor when the type is string', () => {
      const { getByText } = renderComponent({ type: 'string' });

      expect(getByText('StringEditor')).not.toBeNull();
    });

    it('displays the Time editor when the type is time', () => {
      const { getByText } = renderComponent({ type: 'time' });

      expect(getByText('TimeEditor')).not.toBeNull();
    });

    it('displays the Interval<Integer> editor when the type is interval_of_integer', () => {
      const { getByText } = renderComponent({ type: 'interval_of_integer' });

      expect(getByText('IntervalOfIntegerEditor')).not.toBeNull();
    });

    it('displays the Interval<DateTime> editor when the type is interval_of_datetime', () => {
      const { getByText } = renderComponent({ type: 'interval_of_datetime' });

      expect(getByText('IntervalOfDateTimeEditor')).not.toBeNull();
    });

    it('displays the Interval<Decimal> editor when the type is interval_of_decimal', () => {
      const { getByText } = renderComponent({ type: 'interval_of_decimal' });

      expect(getByText('IntervalOfDecimalEditor')).not.toBeNull();
    });

    it('displays the Interval<Quantity> editor when the type is interval_of_quantity', () => {
      const { getByText } = renderComponent({ type: 'interval_of_quantity' });

      expect(getByText('IntervalOfQuantityEditor')).not.toBeNull();
    });
  });
});
