import { Helmet } from 'react-helmet';
import Analytics from '../../components/Analytics';
import { shallowRenderComponent, fullRenderComponent } from '../../utils/test_helpers';

test('Analytics renders GTM iframe when GTM/DAP is configured', () => {
  const component = shallowRenderComponent(Analytics, {
    gtmKey: 'TEST-GTM-KEY',
    dapURL: 'http://example.org/dap'
  });
  expect(component).toBeDefined();
  const iframe = component.find('noscript > iframe').first();
  expect(iframe).toBeDefined();
  expect(iframe.node.props.src).toEqual('https://www.googletagmanager.com/ns.html?id=TEST-GTM-KEY');
  component.unmount();
});

test('Analytics renders GTM and DAP script tags in HEAD when GTM/DAP is configured', () => {
  const component = fullRenderComponent(Analytics, {
    gtmKey: 'TEST-GTM-KEY',
    dapURL: 'http://example.org/dap'
  });
  const helmet = Helmet.peek();
  expect(helmet.scriptTags).toHaveLength(2);
  // First check inlined GTM script
  expect(helmet.scriptTags[0].innerHTML).toMatch(/TEST-GTM-KEY/);
  // Then check DAP script
  expect(helmet.scriptTags[1].src).toEqual('http://example.org/dap');
  component.unmount();
});

test('Analytics does not render GTM iframe when GTM/DAP is not configured', () => {
  const component = shallowRenderComponent(Analytics, {});
  expect(component).toBeDefined();
  expect(component.node).toBeNull();
  component.unmount();
});

test('Analytics does not render GTM and DAP script tags in HEAD when GTM/DAP is not configured', () => {
  const component = fullRenderComponent(Analytics, {});
  const helmet = Helmet.peek();
  expect(helmet.scriptTags).toHaveLength(0);
  component.unmount();
});
