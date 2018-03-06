import ELMErrorModal from '../../components/builder/ELMErrorModal';
import { fullRenderComponent } from '../../utils/test_helpers';

const closeModal = () => {};

test('renders modal hidden', () => {
  const component = fullRenderComponent(ELMErrorModal, { isOpen: false, closeModal, errors: [] });
  expect(component.children().length).toEqual(1);
});

test('renders modal displayed', () => {
  const component = fullRenderComponent(ELMErrorModal, { isOpen: false, closeModal, errors: [] });
  expect(component.find('li')).toHaveLength(0);
});
