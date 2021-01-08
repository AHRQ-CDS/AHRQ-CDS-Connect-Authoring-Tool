import React from 'react';
import nock from 'nock';
import { render, screen, fireEvent, userEvent } from 'utils/test-utils';
import QuantityModifier from '../QuantityModifier';

describe('<QuantityModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <QuantityModifier
        index={6}
        name="quantity-modifier-test"
        value={0}
        updateAppliedModifier={jest.fn()}
        unit=""
        uniqueId="uniqueId"
        {...props}
      />
    );

  it('can change the quantity', () => {
    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    fireEvent.change(screen.getByRole('textbox', { name: 'Value' }), { target: { value: '3' } });

    expect(updateAppliedModifier).toBeCalledWith(6, { unit: '', value: 3 });
  });

  it('can search for and change the unit', async () => {
    const scope = nock('https://clin-table-search.lhc.nlm.nih.gov')
      .get('/api/ucum/v3/search?terms=mg/dL')
      .reply(200, [1, ['mg/dL'], null, [['mg/dL', 'milligram per deciliter']]]);

    const updateAppliedModifier = jest.fn();
    renderComponent({ updateAppliedModifier });

    const unitAutocomplete = screen.getByRole('textbox', { name: 'Unit' });
    userEvent.click(unitAutocomplete);
    fireEvent.change(unitAutocomplete, { target: { value: 'mg/dL' } });
    userEvent.click(await screen.findByRole('option', { name: 'mg/dL (milligram per deciliter)' }));

    expect(updateAppliedModifier).toBeCalledWith(6, { unit: 'mg/dL', value: '' });

    scope.done();
  }, 30000);
});
