import React from 'react';
import { changeDate, changeTime, render, screen } from 'utils/test-utils';
import DateTimeEditor from '../DateTimeEditor';

describe('<DateTimeEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<DateTimeEditor handleUpdateEditor={jest.fn()} isTime={false} isInterval={false} value={null} {...props} />);

  describe('Time Editor', () => {
    it('calls handleUpdateEditor with time', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isTime: true });

      await changeTime('10:00:00');
      expect(handleUpdateEditor).toBeCalledWith({
        str: '@T10:00:00',
        time: '10:00:00'
      });
    });
  });

  describe('DateTime Editor', () => {
    it('calls handleUpdateEditor with date', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor });

      await changeDate('01/01/2020');
      expect(handleUpdateEditor).toBeCalledWith({
        date: '2020-01-01',
        time: null,
        str: '@2020-01-01'
      });
    });

    it('calls handleUpdateEditor with date and time', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        value: { date: '2020-01-01', time: null, str: '@2020-01-01' }
      });

      await changeTime('10:00:00');
      expect(handleUpdateEditor).toBeCalledWith({
        date: '2020-01-01',
        time: '10:00:00',
        str: '@2020-01-01T10:00:00'
      });
    });

    it('shows warning with only time', () => {
      renderComponent({ errors: { incompleteInput: true } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interval of DateTime Editor', () => {
    it('calls handleUpdateEditor with first date', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      await changeDate('01/01/2020');
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: '2020-01-01',
        firstTime: null,
        secondDate: null,
        secondTime: null,
        str: 'Interval[@2020-01-01,null]'
      });
    });

    it('calls handleUpdateEditor with first date and time', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: {
          firstDate: '2020-01-01',
          firstTime: null,
          secondDate: null,
          secondTime: null,
          str: 'Interval[@2020-01-01,null]'
        }
      });

      await changeTime('10:00:00');
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: '2020-01-01',
        firstTime: '10:00:00',
        secondDate: null,
        secondTime: null,
        str: 'Interval[@2020-01-01T10:00:00,null]'
      });
    });

    it('calls handleUpdateEditor with second date', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      await changeDate('01/01/2020', 1);
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: null,
        firstTime: null,
        secondDate: '2020-01-01',
        secondTime: null,
        str: 'Interval[null,@2020-01-01]'
      });
    });

    it('calls handleUpdateEditor with second date and time', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: {
          firstDate: null,
          firstTime: null,
          secondDate: '2020-01-01',
          secondTime: null,
          str: 'Interval[@2020-01-01,null]'
        }
      });

      await changeTime('10:00:00', 1);
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: null,
        firstTime: null,
        secondDate: '2020-01-01',
        secondTime: '10:00:00',
        str: 'Interval[null,@2020-01-01T10:00:00]'
      });
    });

    it('calls handleUpdateEditor with both dates', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: {
          firstDate: '2020-01-01',
          firstTime: null,
          secondDate: null,
          secondTime: null,
          str: 'Interval[@2020-01-01,null]'
        }
      });

      await changeDate('02/01/2020', 1);
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: '2020-01-01',
        firstTime: null,
        secondDate: '2020-02-01',
        secondTime: null,
        str: 'Interval[@2020-01-01,@2020-02-01]'
      });
    });

    it('calls handleUpdateEditor with both dates and times', async () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: {
          firstDate: '2020-01-01',
          firstTime: '10:00:00',
          secondDate: '2020-02-01',
          secondTime: null,
          str: 'Interval[@2020-01-01T12:00:00,@2020-02-01]'
        }
      });

      await changeTime('11:00:00', 1);
      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: '2020-01-01',
        firstTime: '10:00:00',
        secondDate: '2020-02-01',
        secondTime: '11:00:00',
        str: 'Interval[@2020-01-01T10:00:00,@2020-02-01T11:00:00]'
      });
    });

    it('shows warning with only time', () => {
      renderComponent({ errors: { incompleteInput: true }, isInterval: true });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
