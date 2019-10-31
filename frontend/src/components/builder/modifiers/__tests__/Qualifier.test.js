import React from 'react';
import Qualifier from '../Qualifier';
import { render, fireEvent, openSelect } from '../../../../utils/test-utils';
import { genericInstance } from '../../../../utils/test_fixtures';

describe('<Qualifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Qualifier
        codeData={{}}
        getVSDetails={jest.fn()}
        index={5}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        isValidCode={false}
        loginVSACUser={jest.fn()}
        name="qualifier-test"
        qualifier=""
        resetCodeValidation={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        template={{
          ...genericInstance,
          modifiers: [{
            id: 'Qualifier',
            values: {}
          }]
        }}
        updateAppliedModifier={jest.fn()}
        updateInstance={jest.fn()}
        validateCode={jest.fn()}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacFHIRCredentials={{ username: 'username', password: 'password' }}
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('selects type of qualifier', () => {
    const updateAppliedModifier = jest.fn();

    const { getByText, getByLabelText } = renderComponent({ updateAppliedModifier });

    openSelect(getByLabelText('Qualifier'));
    fireEvent.click(getByText('value is a code from'));

    expect(updateAppliedModifier).toBeCalledWith(5, {
      qualifier: 'value is a code from',
      valueSet: null,
      code: null
    });
  });
});
