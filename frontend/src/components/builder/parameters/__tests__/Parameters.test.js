import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';
import { fireEvent, render, userEvent, screen } from 'utils/test-utils';
import Parameters from '../Parameters';
import { mockArtifact } from 'mocks/artifacts';

const parameters = [
  {
    comment: null,
    name: 'isTrue',
    type: 'boolean',
    uniqueId: 'parameter-0',
    usedBy: [],
    value: 'true'
  },
  {
    comment: null,
    name: 'isNow',
    type: 'interval_of_datetime',
    uniqueId: 'parameter-1',
    usedBy: [],
    value: {
      firstDate: '2021-07-15',
      firstTime: '15:56:48',
      secondDate: '2021-07-15',
      secondTime: '15:56:48',
      str: 'Interval[@2021-07-15T15:56:48,@2021-07-15T15:56:48]'
    }
  },
  {
    comment: null,
    name: null,
    type: 'boolean',
    uniqueId: 'parameter-2',
    usedBy: [],
    value: null
  }
];

const mockArtifactWithParameters = { ...mockArtifact, parameters };

const mockArtifactWithParameterUsed = {
  ...mockArtifact,
  parameters: [
    {
      comment: null,
      name: 'isTrue',
      type: 'boolean',
      uniqueId: 'parameter-0',
      value: 'true',
      usedBy: ['use-id-123'],
      tab: 'parameters'
    }
  ],
  expTreeInclude: {
    ...mockArtifact.expTreeInclude,
    childInstances: [
      {
        fields: [{ id: 'element_name', value: 'isTrue' }],
        uniqueId: 'use-id-123',
        tab: 'expTreeInclude'
      }
    ]
  }
};

const mockArtifactWithDuplicateParameters = {
  ...mockArtifact,
  parameters: [
    {
      comment: null,
      name: 'isTrue',
      type: 'boolean',
      uniqueId: 'parameter-0',
      value: 'true',
      usedBy: [],
      tab: 'parameters'
    },
    {
      comment: null,
      name: 'isTrue',
      type: 'boolean',
      uniqueId: 'parameter-1',
      value: 'true',
      usedBy: [],
      tab: 'parameters'
    }
  ]
};

describe('<Parameters />', () => {
  const renderComponent = ({ artifact = mockArtifactWithParameters, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact } })}>
        <Parameters handleUpdateParameters={jest.fn()} {...props} />
      </Provider>
    );

  it('renders a list of parameters', () => {
    renderComponent();

    expect(screen.getAllByText(/parameter:/i)).toHaveLength(3);
  });

  it('can add a new parameter with the New Parameter button', () => {
    const handleUpdateParameters = jest.fn();
    const newParameters = _.cloneDeep(parameters);
    renderComponent({ handleUpdateParameters });

    userEvent.click(screen.getByRole('button', { name: /new parameter/i }));

    expect(handleUpdateParameters).toBeCalledWith(
      newParameters.concat([
        {
          name: null,
          uniqueId: expect.any(String),
          type: 'boolean',
          comment: null,
          value: null
        }
      ])
    );
  });

  it('can update a parameter', () => {
    const handleUpdateParameters = jest.fn();
    const newParameters = _.cloneDeep(parameters);
    renderComponent({ handleUpdateParameters });

    userEvent.click(screen.getByRole('button', { name: 'True' }));
    userEvent.click(screen.getByRole('option', { name: 'False' }));

    newParameters[0].value = 'false';
    expect(handleUpdateParameters).toBeCalledWith(newParameters);
  });

  it('can delete a parameter', () => {
    const handleUpdateParameters = jest.fn();
    const newParameters = _.cloneDeep(parameters);
    renderComponent({ handleUpdateParameters });

    userEvent.click(screen.queryAllByRole('button', { name: 'delete' })[0]);
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(handleUpdateParameters).toBeCalledWith(newParameters.slice(1));
  });

  it('can name a parameter', async () => {
    const handleUpdateParameters = jest.fn();
    const newParameters = _.cloneDeep(parameters);
    renderComponent({ handleUpdateParameters });

    fireEvent.change(screen.queryAllByRole('textbox')[0], { target: { value: 'New Name' } });
    newParameters[0].name = 'New Name';

    expect(handleUpdateParameters).toBeCalledWith(newParameters);
  });

  it('can change a parameter type', () => {
    const handleUpdateParameters = jest.fn();
    const newParameters = _.cloneDeep(parameters);
    renderComponent({ handleUpdateParameters });

    userEvent.click(screen.queryAllByRole('button', { name: 'Boolean' })[0]);
    userEvent.click(screen.getByRole('option', { name: 'Integer' }));
    newParameters[0].type = 'integer';
    newParameters[0].value = null;

    expect(handleUpdateParameters).toBeCalledWith(newParameters);
  });

  it('can collapse and expand a parameter', () => {
    renderComponent();

    expect(screen.queryByText(/istrue:/i)).not.toBeInTheDocument();

    userEvent.click(screen.queryAllByRole('button', { name: /collapse/i })[0]);
    expect(screen.getByText(/istrue:/i)).toBeInTheDocument();

    userEvent.click(screen.queryAllByRole('button', { name: /expand/i })[0]);
    expect(screen.queryByText(/istrue:/i)).not.toBeInTheDocument();
  });

  it('can collapse and expand all parameters', () => {
    renderComponent();

    expect(screen.queryByText(/istrue:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/isnow:/i)).not.toBeInTheDocument();

    userEvent.click(screen.queryAllByRole('button', { name: /collapse/i })[0]);
    expect(screen.getByText(/istrue:/i)).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /expand all/i }));
    expect(screen.queryByText(/istrue:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/isnow:/i)).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /collapse all/i }));
    expect(screen.getByText(/istrue:/i)).toBeInTheDocument();
    expect(screen.getByText(/isnow:/i)).toBeInTheDocument();
  });

  it('displays the editor when passed a valid parameter type', () => {
    renderComponent();

    expect(screen.queryAllByText('Default Value:')).toHaveLength(3);
  });

  it('displays the correct information alert when a parameter is used', () => {
    renderComponent({ artifact: mockArtifactWithParameterUsed });

    expect(
      screen.getByText("Parameter name and type can't be changed while it is being referenced.")
    ).toBeInTheDocument();
  });

  it('displays the correct error alerts when a parameters have duplicate names', () => {
    renderComponent({ artifact: mockArtifactWithDuplicateParameters });

    expect(screen.getAllByText('Name already in use. Choose another name.')).toHaveLength(2);
  });
});
