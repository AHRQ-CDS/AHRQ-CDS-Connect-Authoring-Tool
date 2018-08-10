import PatientDataSection from '../../../components/testing/PatientDataSection';
import { shallowRenderComponent, fullRenderComponent } from '../../../utils/test_helpers';
// import mockPatient from '../../../mocks/mockPatient';

let component;
let fullComponent;

beforeEach(() => {
  const props = {
    title: 'My Section',
    data: [
      {
        Substance: 'Allergy to mould',
        Category: 'food',
        Criticality: 'CRITL',
        'Date onset': '1985-12-10T13:51:10-05:00',
        Status: 'active'
      },
      {
        Substance: 'Allergy to peanuts',
        Category: 'food',
        Criticality: 'CRITL',
        'Date onset': '1985-12-10T13:51:10-05:00',
        Status: 'active'
      }
    ]
  };

  component = shallowRenderComponent(PatientDataSection, props);
  fullComponent = fullRenderComponent(PatientDataSection, props);
});

test('PatientDataSection renders without crashing', () => {
  expect(component).toBeDefined();
});

test('PatientDataSection renders section header correctly', () => {
  expect(component.find('.patient-data-section')).toHaveLength(1);
  expect(component.find('.patient-data-section__header')).toHaveLength(1);
  expect(component.find('.header-title').text()).toEqual('My Section (2)');
});

test('PatientDataSection renders the Reactstrap components correctly', () => {
  expect(component.find('Table')).toHaveLength(1);
  expect(component.find('Collapse')).toHaveLength(1);
  expect(component.find('Button')).toHaveLength(1);
});

test('PatientView renders section table correctly', () => {
  const table = fullComponent.find('.patient-data-section__table.table');
  expect(table).toHaveLength(1);
  expect(table.find('thead')).toHaveLength(1);
  expect(table.find('thead > tr > th')).toHaveLength(5);
  expect(table.find('thead > tr > th').first().text()).toEqual('Substance');
  expect(table.find('tbody > tr')).toHaveLength(2);
  expect(table.find('tbody > tr > td')).toHaveLength(10);
  expect(table.find('tbody > tr > td').first().text()).toEqual('Allergy to mould');
});
