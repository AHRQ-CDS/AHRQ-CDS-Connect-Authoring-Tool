import NewArtifactForm from '../../../../components/artifact/NewArtifactForm';
import { shallowRenderComponent, fullRenderComponent } from '../../../../utils/test_helpers';

test('NewArtifactForm renders without crashing', () => {
  const afterAddArtifactMock = jest.fn();
  const onSubmitMock = jest.fn();
  const component = shallowRenderComponent(NewArtifactForm, {
    afterAddArtifact: afterAddArtifactMock,
    onSubmitFunction: onSubmitMock,
    buttonLabel: 'Submit'
  });

  expect(component).toBeDefined();
});

test('NewArtifactForm allows submission and calls addArtifact', () => {
  const afterAddArtifactMock = jest.fn();
  const addArtifactMock = jest.fn();
  const component = fullRenderComponent(NewArtifactForm, {
    addArtifact: addArtifactMock,
    afterAddArtifact: afterAddArtifactMock,
    buttonLabel: 'Submit'
  });

  const form = component.find('form');
  const nameInput = form.find('input[name="name"]');
  const versionInput = form.find('input[name="version"]');

  expect(component.state('name')).toEqual('');
  expect(component.state('version')).toEqual('');
  nameInput.simulate('change', { target: { name: 'name', value: 'NewArtifactName' } });
  versionInput.simulate('change', { target: { name: 'version', value: 'NewArtifactVersion' } });

  expect(component.state('name')).toEqual('NewArtifactName');
  expect(component.state('version')).toEqual('NewArtifactVersion');

  component.update();
  form.simulate('submit', { preventDefault: jest.fn() });
  expect(addArtifactMock).toHaveBeenCalled();
});
