import PatientView from '../../../components/testing/PatientView';
import { shallowRenderComponent } from '../../../utils/test_helpers';
import mockPatient from '../../../mocks/mockPatient';

let component;

beforeEach(() => {
  const props = {
    patient: mockPatient
  };

  component = shallowRenderComponent(PatientView, props);
});

test('PatientView renders without crashing', () => {
  expect(component).toBeDefined();
});

test('PatientView header renders correctly', () => {
  expect(component.find('.patient-view__patient')).toHaveLength(1);
  expect(component.find('.patient-data-name').text()).toEqual('Robin67 Baumbach677');
  expect(component.find('.patient-data-details-gender').text()).toEqual('female');
  expect(component.find('.patient-data-details-age').text()).toEqual('33 yrs');
});

test('PatientView renders the resources', () => {
  expect(component.find('.patient-view__resources')).toHaveLength(1);
});
