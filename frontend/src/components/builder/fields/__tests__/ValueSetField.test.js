import React from 'react';
import moxios from 'moxios';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import ValueSetField from '../ValueSetField';

describe('<ValueSetField />', () => {
  const renderComponent = ({ queryCache, ...props } = {}) =>
    render(
      <ValueSetField
        field={{
          id: 'unit_of_time',
          name: 'Unit of Time',
          select: 'demographics/units_of_time',
          type: 'valueset',
          value: null
        }}
        updateInstance={jest.fn()}
        {...props}
      />
    );

  beforeEach(() => {
    moxios.install();

    moxios.stubs.track({
      url: `/authoring/api/config/valuesets/demographics/units_of_time`,
      method: 'GET',
      response: {
        status: 200,
        response: {
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
        }
      }
    });
  });
  afterEach(() => {
    moxios.uninstall();
  });

  it('loads the value sets from the api', async () => {
    renderComponent();

    userEvent.click(screen.getByLabelText('Unit of Time'));

    await waitFor(() => {
      expect(screen.getByText('months')).toBeInTheDocument();
    });
  });

  it('calls updateInstance when an option is selected', async () => {
    const updateInstance = jest.fn();
    renderComponent({updateInstance});

    userEvent.click(screen.getByLabelText('Unit of Time'));
    userEvent.click(await screen.findByText('hours'));

    expect(updateInstance).toBeCalledWith({
      unit_of_time: {
        id: 'h',
        name: 'hours',
        value: 'AgeInHours()'
      }
    });
  });
});
