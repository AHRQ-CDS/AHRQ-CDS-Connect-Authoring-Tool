import React from 'react';
import Editor from '../Editor';
import { render } from '../../../../utils/test-utils';

jest.mock('../CodeEditor', () => () => <div>CodeEditor</div>);
jest.mock('../BooleanEditor', () => () => <div>BooleanEditor</div>);
jest.mock('../IntegerEditor', () => () => <div>IntegerEditor</div>);
jest.mock('../DateTimeEditor', () => () => <div>DateTimeEditor</div>);
jest.mock('../DecimalEditor', () => () => <div>DecimalEditor</div>);
jest.mock('../QuantityEditor', () => () => <div>QuantityEditor</div>);
jest.mock('../StringEditor', () => () => <div>StringEditor</div>);
jest.mock('../TimeEditor', () => () => <div>TimeEditor</div>);
jest.mock('../IntervalOfIntegerEditor', () => () => <div>IntervalOfIntegerEditor</div>);
jest.mock('../IntervalOfDateTimeEditor', () => () => <div>IntervalOfDateTimeEditor</div>);
jest.mock('../IntervalOfDecimalEditor', () => () => <div>IntervalOfDecimalEditor</div>);
jest.mock('../IntervalOfQuantityEditor', () => () => <div>IntervalOfQuantityEditor</div>);

describe('<Editor />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Editor
        id="test-id"
        name=""
        type=""
        label=""
        value={null}
        updateInstance={jest.fn()}
        vsacApiKey={'key'}
        loginVSACUser={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        vsacStatus=""
        vsacStatusText=""
        isValidatingCode={false}
        validateCode={jest.fn()}
        resetCodeValidation={jest.fn()}
        {...props}
      />
    );

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
