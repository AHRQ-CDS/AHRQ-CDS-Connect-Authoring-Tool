import React from 'react';
import EditArtifactModal from '../EditArtifactModal';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<EditArtifactModal />', () => {
  it('does not render the modal if it is not opened', () => {
    const { container } = render(
      <EditArtifactModal
        artifactEditing={{}}
        showModal={false}
        closeModal={jest.fn()}
        saveModal={jest.fn()}
      />
    );

    expect(container.querySelector('.element-modal')).toBeEmpty();
    expect(document.body.querySelector('.ReactModalPortal')).toBeEmpty();
  });

  it('allows submission and calls saveModal', () => {
    const saveModal = jest.fn();

    render(
      <EditArtifactModal
        artifactEditing={{}}
        showModal={true}
        closeModal={jest.fn()}
        saveModal={saveModal}
      />
    );

    const nameInput = document.body.querySelector('input[name="name"]');
    const versionInput = document.body.querySelector('input[name="version"]');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'UpdatedArtifactName' } });
    fireEvent.change(versionInput, { target: { name: 'version', value: 'UpdatedArtifactVersion' } });

    fireEvent.click(document.body.querySelector('.modal__footer button[type="submit"]'));
    expect(saveModal).toBeCalledWith({ name: 'UpdatedArtifactName', version: 'UpdatedArtifactVersion' });
  });
});