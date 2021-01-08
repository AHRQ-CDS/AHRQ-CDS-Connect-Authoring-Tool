import React from 'react';
import { render, fireEvent, userEvent, screen, within } from 'utils/test-utils';
import { createTemplateInstance } from 'utils/test_helpers';
import { instanceTree, elementGroups } from 'utils/test_fixtures';
import ConjunctionGroup from '../ConjunctionGroup';

describe('<ConjunctionGroup />', () => {
  const operations = elementGroups.find(g => g.name === 'Operations');
  const orTemplate = operations.entries.find(e => e.id === 'Or');
  const andTemplate = operations.entries.find(e => e.id === 'And');
  const orInstance = createTemplateInstance(orTemplate);
  const instance = {
    ...instanceTree,
    path: '',
    childInstances: [...instanceTree.childInstances, orInstance]
  };

  const renderComponent = (props = {}) =>
    render(
      <ConjunctionGroup
        addInstance={jest.fn()}
        artifact={{ MeetsInclusionCriteria: { id: 'Or' } }}
        baseElements={[]}
        deleteInstance={jest.fn()}
        editInstance={jest.fn()}
        externalCqlList={[]}
        getAllInstances={() => instance.childInstances}
        getAllInstancesInAllTrees={jest.fn().mockReturnValue([])}
        getVSDetails={jest.fn()}
        instance={instance}
        instanceNames={[]}
        isLoadingModifiers={false}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        loadExternalCqlList={jest.fn()}
        loginVSACUser={jest.fn()}
        modifierMap={{}}
        modifiersByInputType={{}}
        parameters={[]}
        resetCodeValidation={jest.fn()}
        root={true}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        templates={elementGroups}
        treeName="MeetsInclusionCriteria"
        updateInstanceModifiers={jest.fn()}
        validateCode={jest.fn()}
        vsacApiKey={'key'}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacIsAuthenticating={false}
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('has correct base class', () => {
    const { container } = renderComponent();
    expect(container.firstChild).toHaveClass('card-group');
  });

  it('applies correct nesting classes', () => {
    const { container } = renderComponent();

    const cardGroups = container.querySelectorAll('.card-group');
    expect(cardGroups[0]).toHaveClass('card-group__top');
    expect(cardGroups[2]).toHaveClass('card-group__odd');
  });

  it('can delete group', () => {
    const deleteInstance = jest.fn();
    renderComponent({ deleteInstance });

    userEvent.click(screen.getByRole('button', { name: 'remove Or' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.2');
  });

  it('edits own type', () => {
    const editInstance = jest.fn();
    renderComponent({ editInstance });

    userEvent.click(screen.getAllByRole('button', { name: 'And' })[0]);
    userEvent.click(screen.getByRole('option', { name: 'Or' }));

    const orType = operations.entries.find(({ id }) => id === 'Or');

    expect(editInstance).toBeCalledWith('MeetsInclusionCriteria', orType, '', true);
  });

  it('edits own name', () => {
    const newName = 'new name';
    const editInstance = jest.fn();

    const { container } = renderComponent({ editInstance });

    const childConjunction = container.querySelector('.card-group__odd');
    const nameField = childConjunction.querySelector('input[type="text"]');

    fireEvent.change(nameField, { target: { value: newName } });

    expect(editInstance).toBeCalledWith(
      'MeetsInclusionCriteria',
      { element_name: newName },
      '.childInstances.2',
      false
    );
  });

  it("can't indent or outdent root group", () => {
    const { container } = renderComponent();

    expect(container.querySelector('.card-group__top > .card-group__top .indent-outdent-container')).toBeNull();
  });

  it('can indent a child group', () => {
    const deleteInstance = jest.fn();
    const { container } = renderComponent({ deleteInstance });

    const childConjunction = container.querySelector('.card-group__odd');
    fireEvent.click(childConjunction.querySelector('button[aria-label="indent"]'));

    const expectedInstance = {
      ...createTemplateInstance(andTemplate, [orInstance]),
      uniqueId: expect.any(String)
    };

    expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.2', [
      {
        instance: expectedInstance,
        path: '',
        index: 2
      }
    ]);
  });

  it('can outdent a child group', () => {
    const deleteInstance = jest.fn();
    const { container } = renderComponent({ deleteInstance });

    const childConjunction = container.querySelector('.card-group__odd');
    fireEvent.click(childConjunction.querySelector('button[aria-label="outdent"]'));

    expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.2', []);
  });

  it('has an expression phrase', () => {
    const childGroupInstance = {
      ...instanceTree,
      path: '',
      childInstances: [...instanceTree.childInstances, orInstance, instanceTree]
    };

    const { container } = renderComponent({ instance: childGroupInstance });
    expect(container.querySelectorAll('.expression__group')).toHaveLength(1);
  });

  describe('for deeper nested conjunction groups', () => {
    const ageInstance = createTemplateInstance(elementGroups[0].entries[0]);
    const deeperOr = {
      ...orInstance,
      childInstances: [ageInstance]
    };
    const deeperInstance = {
      ...instanceTree,
      childInstances: [deeperOr]
    };

    // TODO: All the following should really verify what they were called with as well

    it('can indent a child group', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      const childConjunction = container.querySelector('.card-group__odd');
      fireEvent.click(childConjunction.querySelector('button[aria-label="indent"]'));

      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.0', expect.anything());
    });

    it('can outdent a child group', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      const childConjunction = container.querySelector('.card-group__odd');
      fireEvent.click(childConjunction.querySelector('button[aria-label="outdent"]'));

      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.0', expect.anything());
    });

    it('can indent a child TemplateInstance', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      fireEvent.click(container.querySelector('.card-element__header button[aria-label="indent"]'));

      expect(deleteInstance).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        '.childInstances.0.childInstances.0',
        expect.anything()
      );
    });

    it('can outdent a child TemplateInstance', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      fireEvent.click(container.querySelector('.card-element__header button[aria-label="outdent"]'));

      expect(deleteInstance).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        '.childInstances.0.childInstances.0',
        expect.anything()
      );
    });
  });

  describe('conjunctions that are in base elements in use', () => {
    it('cannot delete main or nested conjunctions', () => {
      const { container } = renderComponent({ disableAddElement: true });
      const disabledConjunction = within(container.querySelector('.card-group__odd'));

      expect(disabledConjunction.getByRole('button', { name: 'remove Or' })).toBeDisabled();
    });

    it('cannot indent or outdent nested conjunctions', () => {
      const { container } = renderComponent({ disableAddElement: true });
      const disabledConjunction = within(container.querySelector('.card-group__odd'));

      const indentButton = disabledConjunction.getByRole('button', { name: 'indent' });
      const outdentButton = disabledConjunction.getByRole('button', { name: 'outdent' });

      expect(indentButton).toBeDisabled();
      expect(outdentButton).toBeDisabled();
    });
  });
});
