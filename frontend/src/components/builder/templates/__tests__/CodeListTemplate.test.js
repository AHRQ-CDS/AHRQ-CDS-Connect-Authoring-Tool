import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import CodeListTemplate from '../CodeListTemplate';

const code1 = {
  display: 'code-1',
  code: '001',
  codeSystem: { name: 'ICD-9-CM', id: 'http://hl7.org/fhir/sid/icd-9-cm' }
};

const code2 = {
  display: 'code-2',
  code: '002',
  codeSystem: { name: 'ICD-9-CM', id: 'http://hl7.org/fhir/sid/icd-9-cm' }
};

describe('<CodeListTemplate />', () => {
  const renderComponent = (props = {}) =>
    render(<CodeListTemplate codes={[]} handleDeleteCode={jest.fn()} {...props} />);

  it('renders a single code correctly', () => {
    const { container } = renderComponent({ codes: [code1] });
    const codeLabels = container.querySelectorAll('#code-label');

    expect(codeLabels).toHaveLength(1);
    expect(codeLabels[0]).toHaveTextContent('Code');
  });

  it('renders more than one code correctly', () => {
    const { container } = renderComponent({ codes: [code1, code2] });
    const codeLabels = container.querySelectorAll('#code-label');

    expect(codeLabels).toHaveLength(2);
    expect(codeLabels[0]).toHaveTextContent('Code 1');
    expect(codeLabels[1]).toHaveTextContent('Code 2');
  });

  it('calls handleDeleteCode on code delete', () => {
    const handleDeleteCode = jest.fn();
    renderComponent({ codes: [code1], handleDeleteCode });

    userEvent.click(screen.getByRole('button', { name: /delete code/ }));

    expect(handleDeleteCode).toBeCalledWith(code1);
  });
});
