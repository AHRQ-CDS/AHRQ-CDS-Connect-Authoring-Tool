import ELMErrorModal from '../../components/builder/ELMErrorModal';
import { fullRenderComponent, ReactWrapper } from '../../utils/test_helpers';

const closeModal = () => {};

test('renders modal hidden', () => {
  let component = fullRenderComponent(ELMErrorModal, {isOpen: false, closeModal, errors:[]});
  expect(component.children().length).toEqual(1);
})

test('renders modal displayed', () => {
  let component = fullRenderComponent(ELMErrorModal, {isOpen: false, closeModal, errors:[]});
  expect(component.find('li')).toHaveLength(0);
})
