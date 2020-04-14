import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import { reduxState } from '../../utils/test_fixtures';
import { render, fireEvent } from '../../utils/test-utils';
import Artifact from '../Artifact';

jest.mock('../../components/artifact/ArtifactTable', () => () => <div>ArtifactTable Component</div>);

describe('<Artifact />', () => {
  const renderComponent = ({ store = reduxState, ...props } = {}) =>
    render(
      <Provider store={createMockStore(store)}>
        <Artifact {...props} />
      </Provider>
    );

  it('shows form and no table when there is no data', () => {
    const { getByText } = renderComponent();

    expect(getByText('No artifacts to show.')).toBeDefined();

    fireEvent.click(getByText('Create New Artifact'));
  });

  it('shows a table when there is data', () => {
    const { queryByText, getByText } = renderComponent({
      store: {
        ...reduxState,
        artifacts: {
          ...reduxState.artifacts,
          artifacts: [
            {
              _id: 'blah',
              name: 'My CDS Artifact',
              version: 'Alpha',
              updatedAt: '2012-10-15T21:26:17Z'
            },
            {
              _id: 'blah2',
              name: 'My Second CDS Artifact',
              version: 'Alpha',
              updatedAt: '2012-11-15T21:26:17Z'
            }
          ]
        }
      }
    });

    expect(queryByText('No artifacts to show')).toBeNull();
    expect(getByText('ArtifactTable Component')).toBeDefined();
  });
});
