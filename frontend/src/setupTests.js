import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactModal from 'react-modal';

// configure enzyme
Enzyme.configure({ adapter: new Adapter() });

// disable modal root in tests
ReactModal.setAppElement(null);
