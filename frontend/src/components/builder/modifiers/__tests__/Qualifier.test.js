import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import { genericInstance } from 'utils/test_fixtures';
import Qualifier from '../Qualifier';

describe('<Qualifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Qualifier
        index={5}
        name="qualifier-test"
        qualifier=""
        template={{
          ...genericInstance,
          modifiers: [{
            id: 'Qualifier',
            values: {}
          }]
        }}
        updateAppliedModifier={jest.fn()}
        vsacApiKey="key"
        {...props}
      />
    );

  it('selects type of qualifier', () => {
    const updateAppliedModifier = jest.fn();

    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByLabelText('Qualifier'));
    userEvent.click(screen.getByText('value is a code from'));

    expect(updateAppliedModifier).toBeCalledWith(5, {
      qualifier: 'value is a code from',
      valueSet: null,
      code: null
    });
  });
});
