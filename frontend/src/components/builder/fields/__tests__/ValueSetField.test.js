import React from 'react';
import nock from 'nock';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import ValueSetField from '../ValueSetField';

describe('<ValueSetField />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ValueSetField
        field={{
          id: 'unit_of_time',
          name: 'Unit of Time',
          select: 'demographics/units_of_time',
          type: 'valueset',
          value: null
        }}
        handleUpdateField={jest.fn()}
        {...props}
      />
    );

  beforeEach(() => {
    nock('http://localhost')
      .get('/authoring/api/config/valuesets/demographics/units_of_time')
      .reply(200, {
        id: 'units_of_time',
        name: 'Units of Time',
        oid: 'oid',
        expansion: [
          {
            id: 's',
            name: 'seconds',
            value: 'AgeInSeconds()'
          },
          {
            id: 'min',
            name: 'minutes',
            value: 'AgeInMinutes()'
          },
          {
            id: 'h',
            name: 'hours',
            value: 'AgeInHours()'
          },
          {
            id: 'd',
            name: 'days',
            value: 'AgeInDays()'
          },
          {
            id: 'wk',
            name: 'weeks',
            value: 'AgeInWeeks()'
          },
          {
            id: 'mo',
            name: 'months',
            value: 'AgeInMonths()'
          },
          {
            id: 'a',
            name: 'years',
            value: 'AgeInYears()'
          }
        ]
      });
  });

  afterAll(() => nock.restore());

  it('loads the value sets from the api', async () => {
    renderComponent();

    await waitFor(() => userEvent.click(screen.getByLabelText('Unit of Time')));

    await waitFor(() => {
      expect(screen.getByText('months')).toBeInTheDocument();
    });
  });

  it('calls handleUpdateField when an option is selected', async () => {
    const handleUpdateField = jest.fn();
    renderComponent({ handleUpdateField });

    await waitFor(() => userEvent.click(screen.getByLabelText('Unit of Time')));
    await waitFor(() => userEvent.click(screen.getByText('hours')));

    expect(handleUpdateField).toBeCalledWith({
      unit_of_time: {
        id: 'h',
        name: 'hours',
        value: 'AgeInHours()'
      }
    });
  });
});
