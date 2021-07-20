import React from 'react';
import nock from 'nock';
import { render, userEvent, fireEvent, screen } from 'utils/test-utils';
import QuantityEditor from '../QuantityEditor';

describe('<QuantityEditor />', () => {
  const renderComponent = (props = {}) =>
    render(<QuantityEditor errors={{}} handleUpdateEditor={jest.fn()} isInterval={false} value={null} {...props} />);

  describe('Quantity Editor', () => {
    it('calls handleUpdateEditor with valid decimal and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0.1' } });

      expect(handleUpdateEditor).toBeCalledWith({ quantity: '0.1', unit: '', str: `0.1 '1'` });
    });

    it('calls handleUpdateEditor with valid integer and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({ quantity: '0', unit: '', str: `0.0 '1'` });
    });

    it('calls handleUpdateEditor with valid value and unit', async () => {
      const scope = nock('https://clin-table-search.lhc.nlm.nih.gov')
        .get('/api/ucum/v3/search?terms=mg/dL')
        .reply(200, [1, ['mg/dL'], null, [['mg/dL', 'milligram per deciliter']]]);

      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        value: { quantity: '1.0', unit: '', str: `1.0 '1'` }
      });

      const unitAutocomplete = screen.getByRole('textbox', { name: 'Unit' });
      userEvent.click(unitAutocomplete);
      fireEvent.change(unitAutocomplete, { target: { value: 'mg/dL' } });
      userEvent.click(await screen.findByRole('option', { name: 'mg/dL (milligram per deciliter)' }));

      expect(handleUpdateEditor).toBeCalledWith({ quantity: '1.0', unit: 'mg/dL', str: `1.0 'mg/dL'` });

      scope.done();
    }, 30000);

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        value: { quantity: '1.0', unit: '', str: `1.0 '1'` }
      });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid value', () => {
      renderComponent({ errors: { invalidInput: true } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows warning with only unit', () => {
      renderComponent({ errors: { incompleteInput: true } });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Interval of Quantity Editor', () => {
    it('calls handleUpdateEditor with valid first decimal and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0.1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: '0.1',
        secondQuantity: null,
        unit: '',
        str: `Interval[0.1 '1',null]`
      });
    });

    it('calls handleUpdateEditor with valid first integer and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: '0',
        secondQuantity: null,
        unit: '',
        str: `Interval[0.0 '1',null]`
      });
    });

    it('calls handleUpdateEditor with valid first value and unit', async () => {
      const scope = nock('https://clin-table-search.lhc.nlm.nih.gov')
        .get('/api/ucum/v3/search?terms=mg/dL')
        .reply(200, [1, ['mg/dL'], null, [['mg/dL', 'milligram per deciliter']]]);

      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstQuantity: '1.0', secondQuantity: null, unit: '', str: `Interval[1.0 '1',null]` }
      });

      const unitAutocomplete = screen.getByRole('textbox', { name: 'Unit' });
      userEvent.click(unitAutocomplete);
      fireEvent.change(unitAutocomplete, { target: { value: 'mg/dL' } });
      userEvent.click(await screen.findByRole('option', { name: 'mg/dL (milligram per deciliter)' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: '1.0',
        secondQuantity: null,
        unit: 'mg/dL',
        str: `Interval[1.0 'mg/dL',null]`
      });

      scope.done();
    }, 30000);

    it('calls handleUpdateEditor with valid second decimal and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '0.1' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: null,
        secondQuantity: '0.1',
        unit: '',
        str: `Interval[null,0.1 '1']`
      });
    });

    it('calls handleUpdateEditor with valid second integer and no unit', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({ handleUpdateEditor, isInterval: true });

      fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '0' } });

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: null,
        secondQuantity: '0',
        unit: '',
        str: `Interval[null,0.0 '1']`
      });
    });

    it('calls handleUpdateEditor with valid second value and unit', async () => {
      const scope = nock('https://clin-table-search.lhc.nlm.nih.gov')
        .get('/api/ucum/v3/search?terms=mg/dL')
        .reply(200, [1, ['mg/dL'], null, [['mg/dL', 'milligram per deciliter']]]);

      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstQuantity: null, secondQuantity: '1.0', unit: '', str: `Interval[null,1.0 '1']` }
      });

      const unitAutocomplete = screen.getByRole('textbox', { name: 'Unit' });
      userEvent.click(unitAutocomplete);
      fireEvent.change(unitAutocomplete, { target: { value: 'mg/dL' } });
      userEvent.click(await screen.findByRole('option', { name: 'mg/dL (milligram per deciliter)' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: null,
        secondQuantity: '1.0',
        unit: 'mg/dL',
        str: `Interval[null,1.0 'mg/dL']`
      });

      scope.done();
    }, 30000);

    it('calls handleUpdateEditor with both valid values and unit', async () => {
      const scope = nock('https://clin-table-search.lhc.nlm.nih.gov')
        .get('/api/ucum/v3/search?terms=mg/dL')
        .reply(200, [1, ['mg/dL'], null, [['mg/dL', 'milligram per deciliter']]]);

      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstQuantity: '0.0', secondQuantity: '1.0', unit: '', str: `Interval[0.0 '1',1.0 '1']` }
      });

      const unitAutocomplete = screen.getByRole('textbox', { name: 'Unit' });
      userEvent.click(unitAutocomplete);
      fireEvent.change(unitAutocomplete, { target: { value: 'mg/dL' } });
      userEvent.click(await screen.findByRole('option', { name: 'mg/dL (milligram per deciliter)' }));

      expect(handleUpdateEditor).toBeCalledWith({
        firstQuantity: '0.0',
        secondQuantity: '1.0',
        unit: 'mg/dL',
        str: `Interval[0.0 'mg/dL',1.0 'mg/dL']`
      });

      scope.done();
    }, 30000);

    it('calls handleUpdateEditor with empty', () => {
      const handleUpdateEditor = jest.fn();
      renderComponent({
        handleUpdateEditor,
        isInterval: true,
        value: { firstQuantity: '0.0', secondQuantity: null, unit: '', str: `Interval[0.0 '1',null]` }
      });

      fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '' } });

      expect(handleUpdateEditor).toBeCalledWith(null);
    });

    it('shows warning with invalid value', () => {
      renderComponent({ errors: { invalidInput: true }, isInterval: true });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows warning with only unit', () => {
      renderComponent({ errors: { incompleteInput: true }, isInterval: true });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
