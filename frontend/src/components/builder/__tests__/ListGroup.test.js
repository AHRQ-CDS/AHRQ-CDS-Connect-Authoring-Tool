import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import _ from 'lodash';
import { createTemplateInstance } from 'utils/test_helpers';
import { render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import {
  genericBaseElementUseInstance,
  genericBaseElementListInstance,
  genericInstance,
  genericBaseElementListAndInstance
} from 'utils/test_fixtures';
import { getFieldWithId } from 'utils/instances';
import ListGroup from '../ListGroup';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';
import mockModifiers from 'mocks/modifiers/mockModifiers';

describe('<ListGroup />', () => {
  const genericBaseElementListTemplateInstance = createTemplateInstance(genericBaseElementListInstance);
  const genericBaseElementUseTemplateInstance = createTemplateInstance(genericBaseElementUseInstance);

  const renderComponent = ({ baseElements = [], expTreeInclude = mockArtifact.expTreeInclude, ...props } = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: { artifact: { ...mockArtifact, expTreeInclude, baseElements } },
          vsac: { apiKey: '1234' }
        })}
      >
        <ListGroup
          addInstance={jest.fn()}
          deleteInstance={jest.fn()}
          deleteLists={jest.fn()}
          editInstance={jest.fn()}
          listInstance={genericBaseElementListTemplateInstance}
          updateInstanceModifiers={jest.fn()}
          updateLists={jest.fn()}
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get(`/authoring/api/modifiers/${mockArtifact._id}`)
      .reply(200, mockModifiers)
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });

  afterEach(() => nock.cleanAll());

  afterAll(() => nock.restore());

  it('renders List Group element name', () => {
    const { container } = renderComponent({});
    expect(container).toHaveTextContent('List Group:');
  });

  it('cannot be deleted when in use', () => {
    const updateLists = jest.fn();
    renderComponent({ updateLists });

    expect(screen.getByRole('button', { name: 'delete List Group' })).toBeDisabled();
  });

  it('can be deleted when not in use', async () => {
    const deleteLists = jest.fn();
    const templateInstance = {
      ...genericBaseElementListTemplateInstance,
      usedBy: []
    };

    renderComponent({
      baseElements: [templateInstance],
      listInstance: templateInstance,
      deleteLists
    });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'delete List Group' })));
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Delete' })));

    expect(deleteLists).toBeCalled();
  });

  it('should not have indent button on children when the list is an intersect/union type', async () => {
    const unionElement = _.cloneDeep(genericBaseElementListTemplateInstance);
    unionElement.childInstances = [createTemplateInstance(genericInstance)];
    const { container } = renderComponent({
      baseElements: [unionElement],
      listInstance: unionElement
    });

    await waitFor(() => {
      const indentButton = within(container).queryByLabelText('indent');
      expect(indentButton).not.toBeInTheDocument();
    });
  });

  it('should have indent button on children when the list is an and/or type', async () => {
    const andElement = createTemplateInstance(genericBaseElementListAndInstance);
    andElement.childInstances = [createTemplateInstance(genericInstance)];
    const { container } = renderComponent({
      baseElements: [andElement],
      listInstance: andElement
    });

    await waitFor(() => {
      const indentButton = within(container).getByLabelText('indent');
      expect(indentButton).toBeInTheDocument();
    });
  });

  it('should call updateLists when list name is updated', async () => {
    const updateLists = jest.fn();
    const listInstance = _.cloneDeep(genericBaseElementListTemplateInstance);
    const { container } = renderComponent({ listInstance, updateLists });
    const nameInput = within(container).getByLabelText('Group Name');
    await userEvent.type(nameInput, 'new list name');
    expect(updateLists).toBeCalled();
  });

  it('should call updateLists when list comment is updated', async () => {
    const updateLists = jest.fn();
    const listInstance = _.cloneDeep(genericBaseElementListTemplateInstance);
    const { container } = renderComponent({ listInstance, updateLists });
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'show comment' })));
    const commentInput = within(container).getByLabelText('Comment');
    await userEvent.type(commentInput, 'new list comment');
    expect(updateLists).toBeCalled();
  });

  it('should render return type with a check for intersect/union lists', () => {
    const { container } = renderComponent({});
    const returnType = within(container).getByTestId('return-type-template');
    expect(returnType).toHaveTextContent('List Of Observations');
    const checkIcon = within(returnType).getByTestId('CheckIcon');
    expect(checkIcon).toBeDefined();
  });

  it('should render return type without a check for and/or lists with invalid return type', () => {
    const listInstance = createTemplateInstance(genericBaseElementListAndInstance);
    listInstance.returnType = 'invalid'; // calculated elsewhere, so set it here
    const { container } = renderComponent({ listInstance });
    const returnType = within(container).getByTestId('return-type-template');
    expect(returnType).toHaveTextContent('Invalid');
    const checkIcon = within(returnType).queryByTestId('CheckIcon');
    expect(checkIcon).not.toBeInTheDocument();
  });

  it('should render return type with a check for and/or lists with valid return type', () => {
    const listInstance = createTemplateInstance(genericBaseElementListAndInstance);
    listInstance.returnType = 'boolean'; // calculated elsewhere, so set it here
    const { container } = renderComponent({ listInstance });
    const returnType = within(container).getByTestId('return-type-template');
    expect(returnType).toHaveTextContent('Boolean');
    const checkIcon = within(returnType).getByTestId('CheckIcon');
    expect(checkIcon).toBeDefined();
  });

  it('should give Intersect/Union conjunction options for intersect/union lists', async () => {
    const listInstance = _.cloneDeep(genericBaseElementListTemplateInstance);
    listInstance.childInstances = [genericInstance]; // a child needs to be present for conjunction types to render
    const { container } = renderComponent({ listInstance });
    await waitFor(() => {
      const dropdown = within(container).getAllByRole('combobox', { name: '' })[0];
      return userEvent.click(dropdown);
    });
    expect(await screen.findByRole('option', { name: 'Union' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Intersect' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'And' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Or' })).not.toBeInTheDocument();
  });

  it('should give And/Or conjunction options for and/or lists', async () => {
    const listInstance = createTemplateInstance(genericBaseElementListAndInstance);
    listInstance.childInstances = [genericInstance]; // a child needs to be present for conjunction types to render
    const { container } = renderComponent({ listInstance });
    await waitFor(() => {
      const dropdown = within(container).getAllByRole('combobox', { name: '' })[0];
      return userEvent.click(dropdown);
    });
    expect(await screen.findByRole('option', { name: 'And' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Or' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Union' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Intersect' })).not.toBeInTheDocument();
  });

  describe('alerts and warnings', () => {
    it('should have no warnings on base element lists when in use and unmodified', () => {
      const list = _.cloneDeep(genericBaseElementListTemplateInstance);
      const list2 = _.cloneDeep(genericBaseElementListTemplateInstance);

      const { container } = renderComponent({
        baseElements: [list, list2]
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('should have a warning on base element list when in use and the use is modified', () => {
      const modifiedUse = _.cloneDeep(genericBaseElementUseTemplateInstance);
      const nameField = getFieldWithId(modifiedUse.fields, 'element_name');

      modifiedUse.uniqueId = 'testId1';
      nameField.value = 'UnionListName';
      modifiedUse.fields.push({
        id: 'comment',
        value: 'foo'
      });

      const { container, getByText } = renderComponent({
        baseElements: [genericBaseElementListTemplateInstance],
        expTreeInclude: { childInstances: [modifiedUse] },
        listInstance: genericBaseElementListTemplateInstance
      });

      expect(within(container).queryAllByRole('alert')).toHaveLength(1);
      expect(
        getByText('Warning: One or more uses of this Base Element have changed. Choose another name.')
      ).toBeInTheDocument();
    });

    it('should have a duplicate name warning when a different element (non use) has the same name', () => {
      const instanceWithSameName = createTemplateInstance(genericInstance);
      const nameField = getFieldWithId(instanceWithSameName.fields, 'element_name');

      instanceWithSameName.uniqueId = 'id-for-instance-1';
      nameField.value = 'UnionListName'; // Same name as Base Element List

      const { container, getByText } = renderComponent({
        baseElements: [genericBaseElementListTemplateInstance],
        expTreeInclude: { childInstances: [instanceWithSameName] },
        listInstance: genericBaseElementListTemplateInstance
      });

      expect(within(container).queryAllByRole('alert')).toHaveLength(1);
      expect(getByText('Warning: Name already in use. Choose another name.')).toBeInTheDocument();
    });

    it('should have an intersection warning when different types are intersected', () => {
      const observationList = createTemplateInstance(genericInstance);
      const procedureList = createTemplateInstance(genericInstance);
      procedureList.uniqueId = 'procedure-1';
      procedureList.returnType = 'list_of_procedures';

      // Create the Intersect List Element and add two different types as children
      const intersectionListInstance = _.cloneDeep(genericBaseElementListTemplateInstance);
      intersectionListInstance.id = 'Intersect';
      intersectionListInstance.name = 'Intersect';
      intersectionListInstance.returnType = 'list_of_any';
      intersectionListInstance.fields[0].value = 'IntersectionListName';
      intersectionListInstance.childInstances = [observationList, procedureList];

      const { container, getByText } = renderComponent({
        baseElements: [intersectionListInstance],
        listInstance: intersectionListInstance
      });

      expect(within(container).queryAllByRole('alert')).toHaveLength(1);
      expect(
        getByText('Warning: Intersecting different types will always result in an empty list.')
      ).toBeInTheDocument();
    });

    it('should have a boolean return type warning when different types are combined in an and/or list', async () => {
      const observationList1 = _.cloneDeep(createTemplateInstance(genericInstance));
      const observationList2 = _.cloneDeep(observationList1);
      observationList2.uniqueId = 'obs2';
      observationList2.fields[0].value = 'obs2 name';

      // Create the Or List Element and add two different types as children
      const orListInstance = _.cloneDeep(genericBaseElementListTemplateInstance);
      orListInstance.id = 'Or';
      orListInstance.name = 'Or';
      orListInstance.returnType = 'invalid'; // this is calculated when adding the child elements and assigned in Builder
      orListInstance.fields[0].value = 'OrListName';
      orListInstance.childInstances = [observationList1, observationList2];

      const { container, getByText } = renderComponent({
        baseElements: [orListInstance],
        listInstance: orListInstance
      });

      await waitFor(() => {
        expect(within(container).queryAllByRole('alert')).toHaveLength(3); // One intersection warning, one return type warnings on both children
      });
      expect(
        getByText("Warning: Elements in groups combined with and/or must all have return type 'boolean'.")
      ).toBeInTheDocument();
    });

    it('should render a simple "Has Errors" warning when collapsed if List has errors', async () => {
      const instanceWithSameName = createTemplateInstance(genericInstance);
      const nameField = getFieldWithId(instanceWithSameName.fields, 'element_name');
      instanceWithSameName.uniqueId = 'id-for-instance-1';
      nameField.value = 'UnionListName'; // Same name as Base Element List

      const { container, getByText, getByLabelText, findByText } = renderComponent({
        baseElements: [genericBaseElementListTemplateInstance],
        expTreeInclude: { childInstances: [instanceWithSameName] },
        listInstance: genericBaseElementListTemplateInstance
      });

      expect(within(container).queryAllByRole('alert')).toHaveLength(1);
      expect(getByText(/Warning: Name already in use/)).toBeInTheDocument();

      // Collapse to element to get condensed warning
      await waitFor(() => userEvent.click(getByLabelText('collapse')));

      expect(await findByText('Has errors.')).toBeInTheDocument();
    });

    it('should render a simple "Has Errors" warning when collapsed if child has errors', async () => {
      const listInstance = createTemplateInstance(genericBaseElementListAndInstance);
      const nonBooleanChild = _.cloneDeep(createTemplateInstance(genericInstance));
      listInstance.childInstances = [nonBooleanChild];
      const { container, getByText, getAllByLabelText, findByText } = renderComponent({
        listInstance,
        baseElements: [listInstance]
      });

      await waitFor(() => {
        expect(within(container).queryAllByRole('alert')).toHaveLength(1);
      });
      expect(getByText(/Element must have return type 'boolean' \(true\/false\)/)).toBeInTheDocument();

      // Collapse to element to get condensed warning
      await waitFor(() => userEvent.click(getAllByLabelText('collapse')[0]));

      expect(await findByText('Has errors.')).toBeInTheDocument();
    });
  });
});
