import React from 'react';
import { Helmet } from 'react-helmet';
import { render } from 'utils/test-utils';
import { Analytics } from 'components/base';

describe('<Analytics />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Analytics
        gtmKey="TEST-GTM-KEY"
        dapURL="http://example.org/dap"
        {...props}
      />
    );

  it('renders a noscript tag when GTM/DAP is configured', () => {
    const { container } = renderComponent();
    const noscript = container.querySelector('noscript');

    expect(noscript).not.toBeNull();
  });

  it('renders GTM and DAP script tags in HEAD when GTM/DAP is configured', () => {
    renderComponent();
    const helmet = Helmet.peek();

    expect(helmet.scriptTags).toHaveLength(2);
    // First check inlined GTM script
    expect(helmet.scriptTags[0].innerHTML).toMatch(/TEST-GTM-KEY/);
    // Then check DAP script
    expect(helmet.scriptTags[1].src).toEqual('http://example.org/dap');
  });

  it('does not render GTM iframe when GTM/DAP is not configured', () => {
    const { container } = renderComponent({ gtmKey: null, dapURL: null });

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render GTM and DAP script tags in HEAD when GTM/DAP is not configured', () => {
    renderComponent({ gtmKey: null, dapURL: null });

    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
});
