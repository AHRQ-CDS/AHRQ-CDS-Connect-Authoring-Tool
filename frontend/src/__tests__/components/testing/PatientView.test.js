import PatientView from '../../../components/testing/PatientView';
import { shallowRenderComponent } from '../../../utils/test_helpers';
import mockPatientDstu2 from '../../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../../mocks/mockPatientStu3';

let component;

test('PatientView renders DSTU2 without crashing', () => {
  const props = {
    patient: mockPatientDstu2
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component).toBeDefined();
});

test('PatientView header renders DSTU2 correctly', () => {
  const props = {
    patient: mockPatientDstu2
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component.find('.patient-view__patient')).toHaveLength(1);
  expect(component.find('.patient-data-name').text()).toEqual('Robin67 Baumbach677');
  expect(component.find('.patient-data-details-gender').text()).toEqual('female');
  expect(component.find('.patient-data-details-age').text()).toEqual('33 yrs');
});

test('PatientView renders the DSTU2 resources', () => {
  const props = {
    patient: mockPatientDstu2
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component.find('.patient-view__resources')).toHaveLength(1);
});

test('PatientView renders STU3 without crashing', () => {
  const props = {
    patient: mockPatientStu3
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component).toBeDefined();
});

test('PatientView header renders STU3 correctly', () => {
  const props = {
    patient: mockPatientStu3
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component.find('.patient-view__patient')).toHaveLength(1);
  expect(component.find('.patient-data-name').text()).toEqual('Arnulfo253 McClure239');
  expect(component.find('.patient-data-details-gender').text()).toEqual('male');
  expect(component.find('.patient-data-details-age').text()).toEqual('32 yrs');
});

test('PatientView renders the STU3 resources', () => {
  const props = {
    patient: mockPatientStu3
  };

  component = shallowRenderComponent(PatientView, props);

  expect(component.find('.patient-view__resources')).toHaveLength(1);
});
