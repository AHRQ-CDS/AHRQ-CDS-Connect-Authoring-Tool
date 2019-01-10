import { createMockStore } from 'redux-test-utils';
import Testing from '../../containers/Testing';
import PatientTable from '../../components/testing/PatientTable';
import mockPatientDstu2 from '../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../mocks/mockPatientStu3';
import { shallowRenderContainer } from '../../utils/test_helpers';

const match = {
  path: ''
};

test('Testing renders without crashing', () => {
  const state = {
    artifacts: {
      artifacts: [],
      downloadArtifact: {
        elmErrors: []
      },
      executeArtifact: {
        results: null,
        isExecuting: false
      }
    },
    testing: {
      patients: [],
      addPatient: {
        isAdding: false
      }
    },
    vsac: {
      authStatus: '',
      isAuthenticating: false
    }
  };
  const component = shallowRenderContainer(Testing, { match }, createMockStore(state)).dive();
  expect(component).toBeDefined();
});

test('Testing shows form and no table when there is no data', () => {
  const state = {
    artifacts: {
      artifacts: [],
      downloadArtifact: {
        elmErrors: []
      },
      executeArtifact: {
        results: null,
        isExecuting: false
      }
    },
    testing: {
      patients: [],
      addPatient: {
        isAdding: false
      }
    },
    vsac: {
      authStatus: '',
      isAuthenticating: false
    }
  };
  const component = shallowRenderContainer(Testing, { match }, createMockStore(state)).dive();
  expect(component.text()).toContain('No patients to show');
  expect(component.find(PatientTable)).toHaveLength(0);
});

test('Testing shows a table when there is data', () => {
  const state = {
    artifacts: {
      artifacts: [],
      downloadArtifact: {
        elmErrors: []
      },
      executeArtifact: {
        results: null,
        isExecuting: false
      }
    },
    testing: {
      patients: [mockPatientDstu2, mockPatientStu3],
      addPatient: {
        isAdding: false
      }
    },
    vsac: {
      authStatus: '',
      isAuthenticating: false
    }
  };
  const component = shallowRenderContainer(Testing, { match }, createMockStore(state)).dive();
  expect(component.text()).not.toContain('No patients to show');
  expect(component.find(PatientTable)).toHaveLength(1);
});
