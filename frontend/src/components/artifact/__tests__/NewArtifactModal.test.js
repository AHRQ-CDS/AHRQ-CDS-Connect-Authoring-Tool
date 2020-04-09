import React from 'react';
import NewArtifactModal from '../NewArtifactModal';
import { render, fireEvent } from '../../../utils/test-utils';

describe('<NewArtifactModal />', () => {
  it('does not render the modal if it is not opened', () => {
    const { container } = render(
      <NewArtifactModal
        addArtifact={jest.fn()}
        showModal={false}
        closeModal={jest.fn()}
      />
    );

    expect(container.querySelector('.element-modal')).toBeEmpty();
    expect(document.body.querySelector('.ReactModalPortal')).toBeEmpty();
  });

  it('allows submission and calls addArtifact and closeModal', () => {
    const addArtifact = jest.fn();
    const closeModal = jest.fn();

    render(
      <NewArtifactModal
        addArtifact={addArtifact}
        showModal={true}
        closeModal={closeModal}
      />
    );

    const nameInput = document.body.querySelector('input[name="name"]');
    const versionInput = document.body.querySelector('input[name="version"]');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'NewArtifactName' } });
    fireEvent.change(versionInput, { target: { name: 'version', value: 'NewArtifactVersion' } });

    fireEvent.click(document.body.querySelector('.modal__footer button[type="submit"]'));
    expect(addArtifact).toBeCalledWith({ name: 'NewArtifactName', version: 'NewArtifactVersion' });
    expect(closeModal).toBeCalled();
  });
});