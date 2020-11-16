import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import { genericInstance } from 'utils/test_fixtures';
import Qualifier from '../Qualifier';

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
        vsacApiKey={'key'}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('selects type of qualifier', () => {
    const updateAppliedModifier = jest.fn();

    renderComponent({ updateAppliedModifier });

    userEvent.click(screen.getByLabelText('Qualifier'));
    userEvent.click(screen.getByText('value is a code from'));

    expect(updateAppliedModifier).toBeCalledWith(5, {
      qualifier: 'value is a code from',
      valueSet: null,
      code: null
    });
  });
});
