import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import DateTimeEditor from '../DateTimeEditor';

describe('<DateTimeEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<DateTimeEditor handleUpdateEditor={jest.fn()} isTime={false} isInterval={false} value={null} {...props} />);

  describe('Time Editor', () => {
    it('calls handleUpdateEditor with time', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isTime: true });

      userEvent.click(screen.getByRole('button', { name: 'change time' }));
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        time: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        str: expect.stringMatching(/^@T\d{2}:\d{2}:\d{2}$/)
      });
    });
  });

  describe('DateTime Editor', () => {
    it('calls handleUpdateEditor with date', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor });

      userEvent.click(screen.getByRole('button', { name: 'change date' }));
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        time: null,
        str: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}$/)
      });
    });

    it('calls handleUpdateEditor with date and time', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        value: { date: '2020-01-01', time: null, str: '@2020-01-01' }
      });

      userEvent.click(screen.getByRole('button', { name: 'change time' }));
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        time: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        str: expect.stringMatching(/^@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
      });
    });

    it('shows warning with only time', async () => {
      renderComponent({ errors: { incompleteInput: true } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interval of DateTime Editor', () => {
    it('calls handleUpdateEditor with first date', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      userEvent.click(screen.getAllByRole('button', { name: 'change date' })[0]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        firstTime: null,
        secondDate: null,
        secondTime: null,
        str: expect.stringMatching(/^Interval\[@\d{4}-\d{2}-\d{2},null\]$/)
      });
    });

    it('calls handleUpdateEditor with first date and time', () => {
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

      userEvent.click(screen.getAllByRole('button', { name: 'change time' })[0]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        firstTime: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        secondDate: null,
        secondTime: null,
        str: expect.stringMatching(/^Interval\[@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2},null\]$/)
      });
    });

    it('calls handleUpdateEditor with second date', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      userEvent.click(screen.getAllByRole('button', { name: 'change date' })[1]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: null,
        firstTime: null,
        secondDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        secondTime: null,
        str: expect.stringMatching(/^Interval\[null,@\d{4}-\d{2}-\d{2}\]$/)
      });
    });

    it('calls handleUpdateEditor with second date and time', () => {
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

      userEvent.click(screen.getAllByRole('button', { name: 'change time' })[1]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: null,
        firstTime: null,
        secondDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        secondTime: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        str: expect.stringMatching(/^Interval\[null,@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\]$/)
      });
    });

    it('calls handleUpdateEditor with both dates', () => {
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

      userEvent.click(screen.getAllByRole('button', { name: 'change date' })[1]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        firstTime: null,
        secondDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        secondTime: null,
        str: expect.stringMatching(/^Interval\[@\d{4}-\d{2}-\d{2},@\d{4}-\d{2}-\d{2}\]$/)
      });
    });

    it('calls handleUpdateEditor with both dates and times', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: {
          firstDate: '2020-01-01',
          firstTime: '12:00:00',
          secondDate: '2020-02-01',
          secondTime: null,
          str: 'Interval[@2020-01-01T12:00:00,@2020-02-01]'
        }
      });

      userEvent.click(screen.getAllByRole('button', { name: 'change time' })[1]);
      userEvent.click(screen.getByRole('button', { name: 'OK' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        firstTime: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        secondDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        secondTime: expect.stringMatching(/^\d{2}:\d{2}:\d{2}$/),
        str: expect.stringMatching(
          /^Interval\[@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2},@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\]$/
        )
      });
    });

    it('shows warning with only time', () => {
      renderComponent({ errors: { incompleteInput: true }, isInterval: true });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
