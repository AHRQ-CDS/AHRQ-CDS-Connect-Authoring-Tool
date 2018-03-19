import Modal from 'react-modal';
import CodeSelectModal from '../../components/builder/CodeSelectModal';
import { fullRenderComponent, ReactWrapper } from '../../utils/test_helpers';

let component;
let codeInput;
let codeSystemSelect;
let getCodeInput;
let getCodeSystemSelect;
let setInputValue;
let internalModal;
const onElementSelected = jest.fn();

const testTemplate = {
  id: 'GenericObservation',
  name: 'Observation',
  returnType: 'list_of_observations',
  suppress: true,
  extends: 'Base',
  parameters: [
    { id: 'element_name', type: 'string', name: 'Element Name' },
    { id: 'observation', type: 'observation', name: 'Observation' }
  ],
};

beforeEach(() => {
  component = fullRenderComponent(
    CodeSelectModal,
    {
      onElementSelected,
      template: testTemplate
    }
  );

  internalModal = new ReactWrapper(component.find(Modal).node.portal, true);

  getCodeInput = () => internalModal.find('.element-modal__search input #code-input');
  getCodeSystemSelect = () => internalModal.find('.element-modal__search .Select');
});

test('renders the component with proper elements', () => {
  expect(component.hasClass('element-modal')).toBeTruthy();
  expect(component.find(Modal)).toHaveLength(1);
  expect(component.find('button').first().text()).toEqual(' Choose Code');
});

test('can set open and close state', () => {
  expect(component.state().showCodeSelectModal).toEqual(false);
  component.instance().openCodeSelectModal();
  expect(component.state().showCodeSelectModal).toEqual(true);
  component.instance().closeCodeSelectModal();
  expect(component.state().showCodeSelectModal).toEqual(false);
});

test('renders the proper children', () => {
  component.instance().openCodeSelectModal();

  expect(internalModal.find('.element-modal__container')).toHaveLength(1);
  expect(internalModal.find('.element-modal__search')).toHaveLength(1);
  expect(internalModal.find('.element-modal__search input #code-input')).toHaveLength(1);
  expect(internalModal.find('.element-modal__search div .Select')).toHaveLength(1);
});

test('can open modal with "Choose Code" button', () => {
  expect(component.state().showCodeSelectModal).toEqual(false);
  component.find('button').first().simulate('click');
  expect(component.state().showCodeSelectModal).toEqual(true);
});

describe('with modal open', () => {
  beforeEach(() => {
    component.instance().openCodeSelectModal();

    codeInput = getCodeInput();
    codeSystemSelect = getCodeSystemSelect();

    setInputValue = (input, value) => {
      input.simulate('focus');
      input.node.value = value;
      input.simulate('change');
    };
  });

  test('can close modal with "Close" button', () => {
    internalModal.find('.modal__footer button').first().simulate('click');
    expect(component.state().showCodeSelectModal).toEqual(false);
  });

  // JULIA TO test: - rerun linting

  test('can input a code and code system and apply to an element', () => {
    const code = '123-4';
    const selectButton = internalModal.find('.element-modal__search .element-modal__searchbutton');

    // Enter code
    setInputValue(codeInput, code);
    expect(codeInput.node.value).toEqual(code);

    // Choose first code system from dropdown
    codeSystemSelect.find('input').simulate('change');
    expect(codeSystemSelect.hasClass('is-open')).toBeTruthy();
    const allOptions = codeSystemSelect.find('.Select-option');
    const firstOption = allOptions.at(0);
    firstOption.simulate('mouseDown');
    expect(component.state().selectedCS.value).toEqual(firstOption.text());

    // Selecting options calls onElementSelected to add to workspace
    selectButton.simulate('click');
    expect(component.state().showCodeSelectModal).toEqual(false);
    expect(component.props().onElementSelected).toBeCalled();
  });

  test('choosing "Other" code system adds second input box to enter URI', () => {
    const otherCS = 'www.example.org';

    codeSystemSelect.find('input').simulate('change');
    expect(codeSystemSelect.hasClass('is-open')).toBeTruthy();
    const allOptions = codeSystemSelect.find('.Select-option');
    const lastOption = allOptions.at(allOptions.length - 1); // Other will be the last option

    // Choosing 'Other' option sets state and opens second input box
    lastOption.simulate('mouseDown');
    expect(component.state().selectedCS.value).toEqual(lastOption.text());
    expect(component.state().displayOtherInput).toEqual(true);

    // Typing in second input box updates state
    const otherCSInput = internalModal.find('#other-code-system');
    otherCSInput.simulate('focus');
    otherCSInput.node.value = otherCS;
    otherCSInput.simulate('change');
    expect(component.state().codeSystemText).toEqual(otherCS);
  });

  test('resets code and code system when closing modal', () => {
    const code = 'testing';
    setInputValue(codeInput, code);
    expect(codeInput.node.value).toEqual(code);

    codeSystemSelect.find('input').simulate('change');
    const allOptions = codeSystemSelect.find('.Select-option');
    const firstOption = allOptions.at(0);
    firstOption.simulate('mouseDown');
    expect(component.state().selectedCS.value).toEqual(firstOption.text());

    component.instance().closeCodeSelectModal();

    expect(codeInput.node.value).toEqual('');
    expect(component.state().codeText).toEqual('');
    expect(component.state().codeSystemText).toEqual('');
    expect(component.state().selectedCS).toEqual(null);
  });
});
