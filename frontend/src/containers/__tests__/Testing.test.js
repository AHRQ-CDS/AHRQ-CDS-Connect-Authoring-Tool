import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import mockPatientDstu2 from '../../mocks/mockPatientDstu2';
import mockPatientStu3 from '../../mocks/mockPatientStu3';
import { reduxState } from '../../utils/test_fixtures';
import { render } from '../../utils/test-utils';
import Testing from '../Testing';

describe('<Testing />', () => {
  const renderComponent = ({ store = reduxState, ...props } = {}) =>
    render(
      <Provider store={createMockStore(store)}>
        <Testing {...props} />
      </Provider>
    );

  it('shows form and no table when there is no data', () => {
    const { container, getByText } = renderComponent();

    expect(getByText('No patients to show.')).toBeDefined();
    expect(container.querySelectorAll('.patient-table')).toHaveLength(0);
  });

  it('shows a table when there is data', () => {
    const { container, queryByText } = renderComponent({
      store: {
        ...reduxState,
        testing: {
          ...reduxState.testing,
          patients: [mockPatientDstu2, mockPatientStu3]
        }
      }
    });

    expect(queryByText('No patients to show.')).toBeNull();
    expect(container.querySelectorAll('.patient-table')).toHaveLength(1);
  });
});
