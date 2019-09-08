import React from 'react';
import NewArtifactForm from '../../../components/artifact/NewArtifactForm';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<NewArtifactForm />', () => {
  it('allows submission and calls addArtifact', () => {
    const afterAddArtifact = jest.fn();
    const addArtifact = jest.fn();

    const { container } = render(
      <NewArtifactForm
        addArtifact={addArtifact}
        afterAddArtifact={afterAddArtifact}
        buttonLabel="Submit"
      />
    );

    const form = container.querySelector('form');
    const nameInput = container.querySelector('input[name="name"]');
    const versionInput = container.querySelector('input[name="version"]');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'NewArtifactName' } });
    fireEvent.change(versionInput, { target: { name: 'version', value: 'NewArtifactVersion' } });
    fireEvent.submit(form);

    expect(addArtifact).toBeCalledWith({ name: 'NewArtifactName', version: 'NewArtifactVersion' });
  });
});
