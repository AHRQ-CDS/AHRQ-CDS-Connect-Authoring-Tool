import ExternalCQL from '../../../components/builder/ExternalCQL';
import ExternalCQLTable from '../../../components/builder/ExternalCqlTable';
import { shallowRenderComponent } from '../../../utils/test_helpers';

test('ExternalCQL renders without crashing', () => {
  const props = {
    artifact: {},
    loadExternalCqlList: jest.fn()
  };
  const component = shallowRenderComponent(ExternalCQL, props);
  expect(component).toBeDefined();
});

test('Testing shows form and no table when there is no data', () => {
  const props = {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: []
  };
  const component = shallowRenderComponent(ExternalCQL, props);
  expect(component.text()).toContain('No external CQL libraries to show');
  expect(component.find(ExternalCQLTable)).toHaveLength(0);
});

test('Testing shows a table when there is data', () => {
  const props = {
    artifact: {},
    loadExternalCqlList: jest.fn(),
    externalCqlList: [{
      name: 'My external lib',
      details: {}
    }]
  };
  const component = shallowRenderComponent(ExternalCQL, props);
  expect(component.text()).not.toContain('No external CQL libraries to show');
  expect(component.find(ExternalCQLTable)).toHaveLength(1);
});
