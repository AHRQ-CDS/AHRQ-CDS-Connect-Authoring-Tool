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
  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return null;
  }
}

class IntervalOfDateTimeEditor extends Component {
  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return null;
  }
}

class IntervalOfDecimalEditor extends Component {
  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return null;
  }
}

class IntervalOfQuantityEditor extends Component {
  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return null;
  }
}

export default ParameterEditor;
