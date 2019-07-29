import ExternalCQL from '../../../components/builder/ExternalCQL';
import ExternalCQLTable from '../../../components/builder/ExternalCqlTable';
import { shallowRenderComponent } from '../../../utils/test_helpers';

const externalCQLProps = {
  artifact: {},
  externalCqlList: [],
  loadExternalCqlList: jest.fn(),
  externalCQLLibraryParents: {},
  deleteExternalCqlLibrary: jest.fn(),
  addExternalLibrary: jest.fn(),
  clearExternalCqlValidationWarnings: jest.fn(),
  loadExternalCqlLibraryDetails: jest.fn(),
  isLoadingExternalCqlDetails: false
};

test('ExternalCQL renders without crashing', () => {
  const component = shallowRenderComponent(ExternalCQL, externalCQLProps);
  expect(component).toBeDefined();
});

test('ExternalCQL shows form and no table when there is no data', () => {
  const component = shallowRenderComponent(ExternalCQL, externalCQLProps);
  expect(component.text()).toContain('No external CQL libraries to show');
  expect(component.find(ExternalCQLTable)).toHaveLength(0);
});

test('ExternalCQL shows a table when there is data', () => {
  const newProps = {
    externalCqlList: [{
      name: 'My external lib',
      details: {}
    }]
  };
  const props = Object.assign({}, externalCQLProps, newProps);
  const component = shallowRenderComponent(ExternalCQL, props);
  expect(component.text()).not.toContain('No external CQL libraries to show');
  expect(component.find(ExternalCQLTable)).toHaveLength(1);
});
