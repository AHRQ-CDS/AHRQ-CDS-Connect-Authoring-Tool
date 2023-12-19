import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import { genericInstance } from 'utils/test_fixtures';
import QualifierModifier from '../QualifierModifier';

describe('<QualifierModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <QualifierModifier
        handleSelectValueSet={jest.fn()}
        qualifier=""
        template={{
          ...genericInstance,
          modifiers: [
            {
              id: 'Qualifier',
              values: {}
            }
          ]
        }}
        handleUpdateModifier={jest.fn()}
        {...props}
      />
    );

  it('selects type of qualifier', async () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    await waitFor(() => userEvent.click(screen.getByLabelText('Qualifier')));
    await waitFor(() => userEvent.click(screen.getByText('value is a code from')));

    expect(handleUpdateModifier).toBeCalledWith({
      qualifier: 'value is a code from',
      valueSet: null,
      code: null
    });
  });
});
