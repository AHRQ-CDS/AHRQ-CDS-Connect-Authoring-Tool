import React from 'react';
import LabelModifier from '../LabelModifier';
import { render } from '../../../../utils/test-utils';

describe('<LabelModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <LabelModifier
        name="label"
        {...props}
      />
    );

  it('renders the name', () => {
    const { container } = renderComponent({ name: 'label modifier test' });

    expect(container).toHaveTextContent('label modifier test');
  });
});
