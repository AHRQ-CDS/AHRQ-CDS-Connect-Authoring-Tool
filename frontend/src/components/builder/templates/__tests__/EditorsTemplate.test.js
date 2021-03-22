import React from 'react';
import EditorsTemplate from '../EditorsTemplate';
import { render } from 'utils/test-utils';

jest.mock('components/builder/editors', () => ({
  BooleanEditor: () => <div>BooleanEditor</div>,
  CodeEditor: () => <div>CodeEditor</div>,
  DateTimeEditor: () => <div>DateTimeEditor</div>,
  NumberEditor: () => <div>NumberEditor</div>,
  QuantityEditor: () => <div>QuantityEditor</div>,
  StringEditor: () => <div>StringEditor</div>
}));

describe('<Editor />', () => {
  const renderComponent = (props = {}) =>
    render(<EditorsTemplate handleUpdateEditor={jest.fn()} label="" type="" value={null} {...props} />);

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

  it('displays the NumberEditor editor when the type is integer', () => {
    const { getByText } = renderComponent({ type: 'integer' });

    expect(getByText('NumberEditor')).not.toBeNull();
  });

  it('displays the DateTime editor when the type is datetime', () => {
    const { getByText } = renderComponent({ type: 'datetime' });

    expect(getByText('DateTimeEditor')).not.toBeNull();
  });

  it('displays the NumberEditor editor when the type is decimal', () => {
    const { getByText } = renderComponent({ type: 'decimal' });

    expect(getByText('NumberEditor')).not.toBeNull();
  });

  it('displays the Quantity editor when the type is system_quantity', () => {
    const { getByText } = renderComponent({ type: 'system_quantity' });

    expect(getByText('QuantityEditor')).not.toBeNull();
  });

  it('displays the String editor when the type is string', () => {
    const { getByText } = renderComponent({ type: 'string' });

    expect(getByText('StringEditor')).not.toBeNull();
  });

  it('displays the DateTimeEditor editor when the type is time', () => {
    const { getByText } = renderComponent({ type: 'time' });

    expect(getByText('DateTimeEditor')).not.toBeNull();
  });

  it('displays the NumberEditor editor when the type is interval_of_integer', () => {
    const { getByText } = renderComponent({ type: 'interval_of_integer' });

    expect(getByText('NumberEditor')).not.toBeNull();
  });

  it('displays the DateTimeEditor editor when the type is interval_of_datetime', () => {
    const { getByText } = renderComponent({ type: 'interval_of_datetime' });

    expect(getByText('DateTimeEditor')).not.toBeNull();
  });

  it('displays the NumberEditor editor when the type is interval_of_decimal', () => {
    const { getByText } = renderComponent({ type: 'interval_of_decimal' });

    expect(getByText('NumberEditor')).not.toBeNull();
  });

  it('displays the QuantityEditor editor when the type is interval_of_quantity', () => {
    const { getByText } = renderComponent({ type: 'interval_of_quantity' });

    expect(getByText('QuantityEditor')).not.toBeNull();
  });
});
