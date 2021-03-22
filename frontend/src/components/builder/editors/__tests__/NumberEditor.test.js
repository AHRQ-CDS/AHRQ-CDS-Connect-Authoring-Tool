import React from 'react';
import { render, fireEvent, screen } from 'utils/test-utils';
import NumberEditor from '../NumberEditor';

describe('<NumberEditor />', () => {
  const renderComponent = (props = {}) =>
    render(
      <NumberEditor handleUpdateEditor={jest.fn()} isDecimal={false} isInterval={false} value={null} {...props} />
    );

  describe('Integer Editor', () => {
    it('calls handleUpdateEditor with valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith('0');
    });

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, value: '1' });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid integer', () => {
      renderComponent();

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Decimal Editor', () => {
    it('calls handleUpdateEditor with valid decimal', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isDecimal: true });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0.1' } });

      expect(handleUpdateEditor).toBeCalledWith({ decimal: '0.1', str: '0.1' });
    });

    it('calls handleUpdateEditor with valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isDecimal: true });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({ decimal: '0', str: '0.0' });
    });

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isDecimal: true, value: { decimal: '1.0', str: '1.0' } });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid decimal', () => {
      renderComponent({ isDecimal: true });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interval of Integer Editor', () => {
    it('calls handleUpdateEditor with first valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstInteger: '0',
        secondInteger: null,
        str: 'Interval[0,null]'
      });
    });

    it('calls handleUpdateEditor with second valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstInteger: null,
        secondInteger: '1',
        str: 'Interval[null,1]'
      });
    });

    it('calls handleUpdateEditor with both valid integers', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstInteger: '0', secondInteger: null, str: 'Interval[0,null]' }
      });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstInteger: '0',
        secondInteger: '1',
        str: 'Interval[0,1]'
      });
    });

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstInteger: '0', secondInteger: null, str: 'Interval[0,null]' }
      });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid first integer', () => {
      renderComponent({ isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows warning with invalid second integer', () => {
      renderComponent({ isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interval of Decimal Editor', () => {
    it('calls handleUpdateEditor with first valid decimal', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0.0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: '0.0',
        secondDecimal: null,
        str: 'Interval[0.0,null]'
      });
    });

    it('calls handleUpdateEditor with first valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: '0',
        secondDecimal: null,
        str: 'Interval[0.0,null]'
      });
    });

    it('calls handleUpdateEditor with second valid decimal', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1.0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: null,
        secondDecimal: '1.0',
        str: 'Interval[null,1.0]'
      });
    });

    it('calls handleUpdateEditor with second valid integer', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: null,
        secondDecimal: '1',
        str: 'Interval[null,1.0]'
      });
    });

    it('calls handleUpdateEditor with both valid decimals', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        isDecimal: true,
        value: { firstDecimal: '0.0', secondDecimal: null, str: 'Interval[0.0,null]' }
      });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1.0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: '0.0',
        secondDecimal: '1.0',
        str: 'Interval[0.0,1.0]'
      });
    });

    it('calls handleUpdateEditor with both valid integers', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        isDecimal: true,
        value: { firstDecimal: '0', secondDecimal: null, str: 'Interval[0.0,null]' }
      });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstDecimal: '0',
        secondDecimal: '1',
        str: 'Interval[0.0,1.0]'
      });
    });

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        isDecimal: true,
        value: { firstDecimal: '0.0', secondDecimal: null, str: 'Interval[0.0,null]' }
      });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid first decimal', () => {
      renderComponent({ isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows warning with invalid second decimal', () => {
      renderComponent({ isInterval: true, isDecimal: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: 'foo' } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
