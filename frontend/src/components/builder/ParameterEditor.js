import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

class ParameterEditor extends Component {
  render() {
    switch (this.props.type) {
      case 'Boolean':
        return <BooleanEditor {...this.props} />
      case 'Code':
        return <CodeEditor {...this.props} />
      case 'Integer':
        return <IntegerEditor {...this.props} />
      case 'DateTime':
        return <DateTimeEditor {...this.props} />
      case 'Decimal':
        return <DecimalEditor {...this.props} />
      case 'Quantity':
        return <QuantityEditor {...this.props} />
      case 'String':
        return <StringEditor {...this.props} />
      case 'Time':
        return <TimeEditor {...this.props} />
      case 'Interval<Integer>':
        return <IntervalOfIntegerEditor {...this.props} />
      case 'Interval<DateTime>':
        return <IntervalOfDateTimeEditor {...this.props} />
      case 'Interval<Decimal>':
        return <IntervalOfDecimalEditor {...this.props} />
      case 'Interval<Quantity>':
        return <IntervalOfQuantityEditor {...this.props} />
      default:
        return null;
    }
  }
}

class BooleanEditor extends Component {
  assignValue(evt) {
    return _.get(evt, 'value', null);
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Boolean:
          <Select
            id={id}
            aria-label={'Select True or False'}
            inputProps={{ title: 'Select True or False' }}
            clearable={true}
            options={[{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]}
            value={value}
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e) })
            }}
          />
        </label>
      </div>
    );
  }
}

class CodeEditor extends Component {
  assignValue(evt) {
    let system = null;
    let code = null;
    let display = null;

    switch (evt.target.name) {
      case "system":
        system = _.get(evt, 'target.value', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case "code":
        system = _.get(this, 'props.value.system', null);
        code = _.get(evt, 'target.value', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case "display":
        system = _.get(this, 'props.value.system', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return { system: system, code: code, display: display };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>System:</label>
            <input
              id={id}
              name="system"
              type="text"
              value={ _.get(value, 'system', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Code:</label>
            <input
              id={id}
              name="code"
              type="text"
              value={ _.get(value, 'code', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Display:</label>
            <input
              id={id}
              name="display"
              type="text"
              value={ _.get(value, 'display', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class IntegerEditor extends Component {
  assignValue(evt) {
    let value = _.get(evt, 'target.value', null);
    if (value != null) { value = parseInt(value, 10); }
    return value;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Integer:
          <input
            id={id}
            type="number"
            value={value || ''}
            onChange={ e => {
              updateInstance({ name: name, type: type, value: this.assignValue(e) })
            }}
          />
        </label>
      </div>
    );
  }
}

class DateTimeEditor extends Component {
  assignValue(evt) {
    let month = null;
    let day = null;
    let year = null;

    switch (evt.target.name) {
      case "month":
        month = _.get(evt, 'target.value', null);
        day = _.get(this, 'props.value.day', null);
        year = _.get(this, 'props.value.year', null);
        break;
      case "day":
        month = _.get(this, 'props.value.month', null);
        day = _.get(evt, 'target.value', null);
        year = _.get(this, 'props.value.year', null);
        break;
      case "year":
        month = _.get(this, 'props.value.month', null);
        day = _.get(this, 'props.value.day', null);
        year = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return { month: month, day: day, year: year };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>Month:</label>
            <input
              id={id}
              name="month"
              type="number"
              value={ _.get(value, 'month', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Day:</label>
            <input
              id={id}
              name="day"
              type="number"
              value={ _.get(value, 'day', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Year:</label>
            <input
              id={id}
              name="year"
              type="number"
              value={ _.get(value, 'year', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class DecimalEditor extends Component {
  assignValue(evt) {
    let value = _.get(evt, 'target.value', null);
    if (value != null) { value = parseFloat(value, 10); }
    return value;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Decimal:
          <input
            id={id}
            type="number"
            value={value || ''}
            onChange={ e => {
              updateInstance({ name: name, type: type, value: this.assignValue(e) })
            }}
          />
        </label>
      </div>
    );
  }
}

class QuantityEditor extends Component {
  assignValue(evt) {
    let quantity = null;
    let unit = null;

    switch (evt.target.name) {
      case "quantity":
        quantity = _.get(evt, 'target.value', null);
        if (quantity != null) { quantity = parseFloat(quantity, 10); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case "unit":
        quantity = _.get(this, 'props.value.quantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return { quantity: quantity, unit: unit };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>Quantity:</label>
            <input
              id={id}
              name="quantity"
              type="number"
              value={ _.get(value, 'quantity', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Unit:</label>
            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class StringEditor extends Component {
  assignValue(evt) {
    return _.get(evt, 'target.value', null);
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          String:
          <input
            id={id}
            type="text"
            value={value || ''}
            onChange={ e => {
              updateInstance({ name: name, type: type, value: this.assignValue(e) })
            }}
          />
        </label>
      </div>
    );
  }
}

class TimeEditor extends Component {
  assignValue(evt) {
    let hour = null;
    let minute = null;
    let second = null;

    switch (evt.target.name) {
      case "hour":
        hour = _.get(evt, 'target.value', null);
        minute = _.get(this, 'props.value.minute', null);
        second = _.get(this, 'props.value.second', null);
        break;
      case "minute":
        hour = _.get(this, 'props.value.hour', null);
        minute = _.get(evt, 'target.value', null);
        second = _.get(this, 'props.value.second', null);
        break;
      case "second":
        hour = _.get(this, 'props.value.hour', null);
        minute = _.get(this, 'props.value.minute', null);
        second = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return { hour: hour, minute: minute, second: second };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>Hour:</label>
            <input
              id={id}
              name="hour"
              type="number"
              value={ _.get(value, 'hour', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Minute:</label>
            <input
              id={id}
              name="minute"
              type="number"
              value={ _.get(value, 'minute', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second:</label>
            <input
              id={id}
              name="second"
              type="number"
              value={ _.get(value, 'second', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class IntervalOfIntegerEditor extends Component {
  assignValue(evt) {
    let first_integer = null;
    let second_integer = null;

    switch (evt.target.name) {
      case "first_integer":
        first_integer = _.get(evt, 'target.value', null);
        if (first_integer != null) { first_integer = parseInt(first_integer, 10); }
        second_integer = _.get(this, 'props.value.second_integer', null);
        break;
      case "second_integer":
        first_integer = _.get(this, 'props.value.first_integer', null);
        second_integer = _.get(evt, 'target.value', null);
        if (second_integer != null) { second_integer = parseInt(second_integer, 10); }
        break;
      default:
        break;
    }

    return { first_integer: first_integer, second_integer: second_integer };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>First Integer:</label>
            <input
              id={id}
              name="first_integer"
              type="number"
              value={ _.get(value, 'first_integer', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Integer:</label>
            <input
              id={id}
              name="second_integer"
              type="number"
              value={ _.get(value, 'second_integer', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class IntervalOfDateTimeEditor extends Component {
  assignValue(evt) {
    let first_month = null;
    let first_day = null;
    let first_year = null;
    let second_month = null;
    let second_day = null;
    let second_year = null;

    switch (evt.target.name) {
      case "first_month":
        first_month = _.get(evt, 'target.value', null);
        first_day = _.get(this, 'props.value.first_day', null);
        first_year = _.get(this, 'props.value.first_year', null);
        second_month = _.get(this, 'props.value.second_month', null);
        second_day = _.get(this, 'props.value.second_day', null);
        second_year = _.get(this, 'props.value.second_year', null);
        break;
      case "first_day":
        first_month = _.get(this, 'props.value.first_month', null);
        first_day = _.get(evt, 'target.value', null);
        first_year = _.get(this, 'props.value.first_year', null);
        second_month = _.get(this, 'props.value.second_month', null);
        second_day = _.get(this, 'props.value.second_day', null);
        second_year = _.get(this, 'props.value.second_year', null);
        break;
      case "first_year":
        first_month = _.get(this, 'props.value.first_month', null);
        first_day = _.get(this, 'props.value.first_day', null);
        first_year = _.get(evt, 'target.value', null);
        second_month = _.get(this, 'props.value.second_month', null);
        second_day = _.get(this, 'props.value.second_day', null);
        second_year = _.get(this, 'props.value.second_year', null);
        break;
      case "second_month":
        first_month = _.get(this, 'props.value.first_month', null);
        first_day = _.get(this, 'props.value.first_day', null);
        first_year = _.get(this, 'props.value.first_year', null);
        second_month = _.get(evt, 'target.value', null);
        second_day = _.get(this, 'props.value.second_day', null);
        second_year = _.get(this, 'props.value.second_year', null);
        break;
      case "second_day":
        first_month = _.get(this, 'props.value.first_month', null);
        first_day = _.get(this, 'props.value.first_day', null);
        first_year = _.get(this, 'props.value.first_year', null);
        second_month = _.get(this, 'props.value.second_month', null);
        second_day = _.get(evt, 'target.value', null);
        second_year = _.get(this, 'props.value.second_year', null);
        break;
      case "second_year":
        first_month = _.get(this, 'props.value.first_month', null);
        first_day = _.get(this, 'props.value.first_day', null);
        first_year = _.get(this, 'props.value.first_year', null);
        second_month = _.get(this, 'props.value.second_month', null);
        second_day = _.get(this, 'props.value.second_day', null);
        second_year = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return {
      first_month: first_month,
      first_day: first_day,
      first_year: first_year,
      second_month: second_month,
      second_day: second_day,
      second_year: second_year
    };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>First Month:</label>
            <input
              id={id}
              name="first_month"
              type="number"
              value={ _.get(value, 'first_month', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>First Day:</label>
            <input
              id={id}
              name="first_day"
              type="number"
              value={ _.get(value, 'first_day', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>First Year:</label>
            <input
              id={id}
              name="first_year"
              type="number"
              value={ _.get(value, 'first_year', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Month:</label>
            <input
              id={id}
              name="second_month"
              type="number"
              value={ _.get(value, 'second_month', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Day:</label>
            <input
              id={id}
              name="second_day"
              type="number"
              value={ _.get(value, 'second_day', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Year:</label>
            <input
              id={id}
              name="second_year"
              type="number"
              value={ _.get(value, 'second_year', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class IntervalOfDecimalEditor extends Component {
  assignValue(evt) {
    let first_decimal = null;
    let second_decimal = null;

    switch (evt.target.name) {
      case "first_decimal":
        first_decimal = _.get(evt, 'target.value', null);
        if (first_decimal != null) { first_decimal = parseFloat(first_decimal, 10); }
        second_decimal = _.get(this, 'props.value.second_decimal', null);
        break;
      case "second_decimal":
        first_decimal = _.get(this, 'props.value.first_decimal', null);
        second_decimal = _.get(evt, 'target.value', null);
        if (second_decimal != null) { second_decimal = parseFloat(second_decimal, 10); }
        break;
      default:
        break;
    }

    return { first_decimal: first_decimal, second_decimal: second_decimal };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>First Decimal:</label>
            <input
              id={id}
              name="first_decimal"
              type="number"
              value={ _.get(value, 'first_decimal', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Decimal:</label>
            <input
              id={id}
              name="second_decimal"
              type="number"
              value={ _.get(value, 'second_decimal', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

class IntervalOfQuantityEditor extends Component {
  assignValue(evt) {
    let first_quantity = null;
    let second_quantity = null;
    let unit = null;

    switch (evt.target.name) {
      case "first_quantity":
        first_quantity = _.get(evt, 'target.value', null);
        if (first_quantity != null) { first_quantity = parseFloat(first_quantity, 10); }
        second_quantity = _.get(this, 'props.value.second_quantity', null);
        unit = _.get(this, 'props.value.unit', null);
        break;
      case "second_quantity":
        first_quantity = _.get(this, 'props.value.first_quantity', null);
        second_quantity = _.get(evt, 'target.value', null);
        if (second_quantity != null) { second_quantity = parseFloat(second_quantity, 10); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case "unit":
        first_quantity = _.get(this, 'props.value.first_quantity', null);
        second_quantity = _.get(this, 'props.value.second_quantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    return { first_quantity: first_quantity, second_quantity: second_quantity, unit: unit };
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label>First Quantity:</label>
            <input
              id={id}
              name="first_quantity"
              type="number"
              value={ _.get(value, 'first_quantity', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Second Quantity:</label>
            <input
              id={id}
              name="second_quantity"
              type="number"
              value={ _.get(value, 'second_quantity', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
            <label>Unit:</label>
            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
              onChange={ e => {
                updateInstance({ name: name, type: type, value: this.assignValue(e) })
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

export default ParameterEditor;
