import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, userEvent, fireEvent, screen } from 'utils/test-utils';
import CodeEditor from '../CodeEditor';

describe('<CodeEditor />', () => {
  const renderUnauthenticatedComponent = (props = {}) =>
    render(<CodeEditor handleUpdateEditor={jest.fn()} isConcept={false} value={null} {...props} />);

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore(x => x, { vsac: { apiKey: 'abcd-1234' } })}>
        <CodeEditor handleUpdateEditor={jest.fn()} isConcept={false} value={null} {...props} />
      </Provider>
    );

  describe('Code Editor', () => {
    it('shows Authenticate VSAC button if unauthenticated', () => {
      const { getByText } = renderUnauthenticatedComponent();

      expect(getByText('Authenticate VSAC')).toBeInTheDocument();
    });

    it('calls handleUpdateEditor with code', () => {
      const handleUpdateEditor = jest.fn();
      const { getByText } = renderComponent({ handleUpdateEditor });

      expect(getByText('Add Code')).toBeInTheDocument();

      userEvent.click(screen.getByRole('button'));
      fireEvent.change(screen.getByRole('textbox', { name: 'Code' }), { target: { value: '123' } });
      userEvent.click(screen.getByRole('button', { name: 'Code system ​' }));
      userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
      userEvent.click(screen.getByRole('button', { name: 'Select' }));

      expect(handleUpdateEditor).toBeCalledWith({
        system: 'SNOMED',
        uri: 'http://snomed.info/sct',
        code: '123',
        display: '',
        str: `Code '123' from "SNOMED"`
      });
    });
  });

  describe('Concept Editor', () => {
    it('shows Authenticate VSAC button if unauthenticated', () => {
      const { getByText } = renderUnauthenticatedComponent({ isConcept: true });

      expect(getByText('Authenticate VSAC')).toBeInTheDocument();
    });

    it('calls handleUpdateEditor with code', () => {
      const handleUpdateEditor = jest.fn();
      const { getByText } = renderComponent({ handleUpdateEditor, isConcept: true });

      expect(getByText('Add Code')).toBeInTheDocument();

      userEvent.click(screen.getByRole('button'));
      fireEvent.change(screen.getByRole('textbox', { name: 'Code' }), { target: { value: '123' } });
      userEvent.click(screen.getByRole('button', { name: 'Code system ​' }));
      userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
      userEvent.click(screen.getByRole('button', { name: 'Select' }));

      expect(handleUpdateEditor).toBeCalledWith({
        system: 'SNOMED',
        uri: 'http://snomed.info/sct',
        code: '123',
        display: '',
        str: `Concept { Code '123' from "SNOMED" }`
      });
    });
  });
});
