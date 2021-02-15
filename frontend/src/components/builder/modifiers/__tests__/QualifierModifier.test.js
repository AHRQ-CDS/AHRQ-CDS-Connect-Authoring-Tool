import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import { genericInstance } from 'utils/test_fixtures';
import QualifierModifier from '../QualifierModifier';

describe('<QualifierModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <QualifierModifier
        qualifier=""
        template={{
          ...genericInstance,
          modifiers: [{
            id: 'Qualifier',
            values: {}
          }]
        }}
        handleUpdateModifier={jest.fn()}
        {...props}
      />
    );

  it('selects type of qualifier', () => {
    const handleUpdateModifier = jest.fn();
    renderComponent({ handleUpdateModifier });

    userEvent.click(screen.getByLabelText('Qualifier'));
    userEvent.click(screen.getByText('value is a code from'));

    expect(handleUpdateModifier).toBeCalledWith({
      qualifier: 'value is a code from',
      valueSet: null,
      code: null
    });
  });
});
