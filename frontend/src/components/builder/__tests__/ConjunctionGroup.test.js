import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import _ from 'lodash';
import { render, fireEvent, userEvent, screen, within } from 'utils/test-utils';
import { createTemplateInstance } from 'utils/test_helpers';
import { instanceTree, elementGroups } from 'utils/test_fixtures';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';
import ConjunctionGroup from '../ConjunctionGroup';

describe('<ConjunctionGroup />', () => {
  const operations = elementGroups.find(g => g.name === 'Operations');
  const orTemplate = operations.entries.find(e => e.id === 'Or');
  const andTemplate = operations.entries.find(e => e.id === 'And');
  const orInstance = createTemplateInstance(orTemplate);
  const instance = { ...instanceTree, path: '', childInstances: [...instanceTree.childInstances, orInstance] };

  const renderComponent = ({ groupInstance = instance, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact: mockArtifact } })}>
        <ConjunctionGroup
          addInstance={jest.fn()}
          baseElements={[]}
          deleteInstance={jest.fn()}
          disableAddElement={false}
          disableIndent={false}
          editInstance={jest.fn()}
          elementUniqueId=""
          getAllInstancesInAllTrees={jest.fn().mockReturnValue([])}
          getPath={jest.fn()}
          instance={groupInstance}
          instanceNames={[]}
          isLoadingModifiers={false}
          modifiersByInputType={{}}
          options=""
          parameters={[]}
          root={true}
          subpopulationUniqueId={null}
          templates={elementGroups}
          treeName="MeetsInclusionCriteria"
          updateInstanceModifiers={jest.fn()}
          validateReturnType={false}
          vsacApiKey="key"
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get('/authoring/api/config/valuesets/demographics/units_of_time')
      .reply(200, { expansion: [] })
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });

  afterEach(() => nock.cleanAll());

  it('applies correct nesting classes', () => {
    const { container } = renderComponent();

    expect(screen.getByTestId('root')).toBeInTheDocument();

    const cardGroups = container.querySelectorAll('.card-group');
    expect(cardGroups).toHaveLength(1); // One group within Inclusions

    expect(cardGroups[0].firstChild.className).toMatch(/ElementCard-odd/); // Group has the correct class applied
  });

  it('can delete group', () => {
    const deleteInstance = jest.fn();
    renderComponent({ deleteInstance });

    userEvent.click(screen.getByLabelText('delete Group'));
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

    const childConjunction = container.querySelector('.card-group, [class^="ElementCard-odd"]');
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
    const { queryByLabelText, getAllByLabelText } = renderComponent({
      // same as instance defined above but no group
      groupInstance: { ...instanceTree, path: '', childInstances: [...instanceTree.childInstances] }
    });

    // Inclusions without any groups should have no outdent buttons available
    expect(queryByLabelText('Outdent')).toBeNull();
    // Top level inclusions group shouldn't have indent button and two elements in childInstances should each have an indent button.
    expect(getAllByLabelText('Indent')).toHaveLength(2);
  });

  it('can indent a child group', () => {
    const deleteInstance = jest.fn();
    const { container } = renderComponent({ deleteInstance });

    const childConjunction = container.querySelector('.card-group');
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

    const childConjunction = container.querySelector('.card-group');
    fireEvent.click(childConjunction.querySelector('button[aria-label="outdent"]'));

    expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.2', []);
  });

  it('has an expression phrase', () => {
    const topLevelChildInstances = _.cloneDeep(instanceTree.childInstances);
    topLevelChildInstances[0].fields.find(f => f.id === 'element_name').value = 'Top Level Age';
    topLevelChildInstances[1].fields.find(f => f.id === 'element_name').value = 'Top Level LDL_Test';
    const childGroupInstance = {
      ...instanceTree,
      path: '',
      childInstances: [...topLevelChildInstances, orInstance, instanceTree]
    };

    const { container } = renderComponent({ instance: childGroupInstance });
    expect(container.querySelectorAll('[class^="ElementCard-expressionPhrase"]')).toHaveLength(3);
    expect(container.querySelectorAll('[class^="ElementCard-expressionPhrase"]')[1]).toHaveTextContent(
      'AgeandLDL_Test'
    );
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

    it('can indent a child group', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      const childConjunction = container.querySelector('.card-group');
      fireEvent.click(childConjunction.querySelector('button[aria-label="indent"]'));

      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.0', expect.anything());
    });

    it('can outdent a child group', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      const childConjunction = container.querySelector('.card-group');
      fireEvent.click(childConjunction.querySelector('button[aria-label="outdent"]'));

      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', '.childInstances.0', expect.anything());
    });

    it('can indent a child TemplateInstance', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      fireEvent.click(
        within(
          container.querySelector('.card-group .card-group-section [class^="MuiCardHeader-action"]')
        ).getByLabelText('indent')
      );

      expect(deleteInstance).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        '.childInstances.0.childInstances.0',
        expect.anything()
      );
    });

    it('can outdent a child TemplateInstance', () => {
      const deleteInstance = jest.fn();
      const { container } = renderComponent({ instance: deeperInstance, deleteInstance });

      fireEvent.click(
        within(
          container.querySelector('.card-group .card-group-section [class^="MuiCardHeader-action"]')
        ).getByLabelText('outdent')
      );

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
      const disabledConjunction = within(container.querySelector('.card-group'));

      expect(disabledConjunction.getByRole('button', { name: 'delete Group' })).toBeDisabled();
    });

    it('cannot indent or outdent nested conjunctions', () => {
      const { container } = renderComponent({ disableAddElement: true });
      const disabledConjunction = within(container.querySelector('.card-group'));

      const indentButton = disabledConjunction.getByRole('button', { name: 'indent' });
      const outdentButton = disabledConjunction.getByRole('button', { name: 'outdent' });

      expect(indentButton).toBeDisabled();
      expect(outdentButton).toBeDisabled();
    });
  });
});
