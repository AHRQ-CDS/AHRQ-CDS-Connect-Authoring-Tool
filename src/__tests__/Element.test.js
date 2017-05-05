import Element from '../components/builder/Element';
import { wrapInTestContext, shallowRenderComponent, fullRenderComponent, decoratedDeepState } from '../helpers/test_helpers';

let component;
let draggableComponent;

beforeEach(() => {
  // Obtain the reference to the component before React DnD wrapping
  // Stub the React DnD connector functions with an identity function
  component = shallowRenderComponent(
    Element.DecoratedComponent,
    {
      connectDragSource: el => el,
      connectDragPreview: el => el,
      name: 'Age Range'
    }
  );

  // mock the actual draggable component
  draggableComponent = fullRenderComponent(
    wrapInTestContext(Element),
    { name: 'Age Range' }
  );
});

test('renders Element with name and initial state', () => {
  expect(component.text()).toContain('Age Range');
  expect(component.hasClass('element')).toBe(true);
  expect(component.find('button').hasClass('element__dragger')).toBe(true);
  expect(component.hasClass('is-active')).toBe(false);
  expect(component.state('isActive')).toBe(false);
});

test('makes Element active or inactive with mouse events', () => {
  ['click', 'focus', 'mouseover'].forEach((event) => {
    component.find('button').simulate(event);
    expect(component.hasClass('is-active')).toBe(true);
    expect(component.state('isActive')).toBe(true);
    component.setState({ isActive: false }); // reset
  });

  ['blur', 'mouseout'].forEach((event) => {
    component.find('button').simulate(event);
    expect(component.hasClass('is-active')).toBe(false);
    expect(component.state('isActive')).toBe(false);
    component.setState({ isActive: true }); // reset
  });
});

test('sets Element classes in response to state change', () => {
  [false, true].forEach((bool) => {
    component.setState({ isActive: bool });
    expect(component.hasClass('is-active')).toBe(bool);
    expect(component.state('isActive')).toBe(bool);
  });
});


test.skip('Element can drag', () => {
  expect(decoratedDeepState(draggableComponent, Element).isActive).toBe(false);
  expect(draggableComponent.hasClass('is-active')).toBe(false);

  const backend = draggableComponent.instance().getManager().getBackend();
  const sourceId = draggableComponent.find(Element).get(0).getHandlerId();
  backend.simulateBeginDrag([sourceId]);

  expect(decoratedDeepState(draggableComponent, Element).isActive).toBe(true);
  expect(draggableComponent.hasClass('is-active')).toBe(true);

  backend.simulateEndDrag([sourceId]);
  expect(decoratedDeepState(draggableComponent, Element).isActive).toBe(false);
  expect(draggableComponent.hasClass('is-active')).toBe(false);
});
