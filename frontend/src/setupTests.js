import '@testing-library/jest-dom/extend-expect'; // eslint-disable-line import/no-extraneous-dependencies
import ReactModal from 'react-modal';

// disable modal root in tests
ReactModal.setAppElement('body');
