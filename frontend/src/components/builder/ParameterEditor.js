import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

// A component to be used in Parameter.js to provide
// an editor for a parameter of the given type
class ParameterEditor extends Component {
  render() {
    switch (this.props.type) {
      case 'Boolean':
        return <BooleanEditor {...this.props} />
      case 'Code':
        return <CodeEditor {...this.props} />
      case 'Concept':
        return <ConceptEditor {...this.props} />
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

    if (system || code || display) {
      let str = `Code '${code}' from "${system}" display '${display}'`;
      return { system: system, code: code, display: display, str: str };
    } else {
      return null;
    }
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

class ConceptEditor extends Component {
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

    if (system || code || display) {
      let str = `Concept { Code '${code}' from "${system}" } display '${display}'`;
      return { system: system, code: code, display: display, str: str };
    } else {
      return null;
    }
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
  assignValue(evt, name) {
    let date = null;
    let time = null;
    let str = null;

    switch (name) {
      case "date":
        date = evt != null ? evt.format('YYYY-MM-DD') : null;
        time = _.get(this, 'props.value.time', null);
        break;
      case "time":
        date = _.get(this, 'props.value.date', null);
        time = evt != null ? evt.format('HH:mm:ss') : null;
        break;
      default:
        break;
    }

    if (date || time) {
      if (time) {
        str = `@${date}T${time}`;
      } else {
        str = `@${date}`;
      }
      return { date: date, time: time, str: str };
    } else {
      return null;
    }

  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Date: <DatePicker
            id={id}
            selected={moment(_.get(value, 'date', null), 'YYYY-MM-DD').isValid() ? moment(value.date, 'YYYY-MM-DD') : null}
            dateFormat="L"
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'date') })
            }}
          />
          Time: <TimePicker
            id={id}
            defaultValue={moment(_.get(value, 'time', null), 'HH:mm:ss').isValid() ? moment(value.time, 'HH:mm:ss') : null}
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'time') })
            }}
          />
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

    if (quantity || unit) {
      let str = `${quantity} '${unit}'`;
      return { quantity: quantity, unit: unit, str: str };
    } else {
      return null;
    }
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
    let str = _.get(evt, 'target.value', null);
    str = str ? `'${str}'` : null;
    return str;
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
            value={value ? value.replace(/'/g, "") : ''}
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
    let time = evt != null ? evt.format('HH:mm:ss') : null;
    time = time ? `@T${time}` : null;
    return time;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Time: <TimePicker
            id={id}
            defaultValue={moment(value, 'HH:mm:ss').isValid() ? moment(value, 'HH:mm:ss') : null}
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e) })
            }}
          />
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

    if (first_integer || second_integer) {
      let str = `Interval[${first_integer},${second_integer}]`;
      return { first_integer: first_integer, second_integer: second_integer, str: str };
    } else {
      return null;
    }
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
  assignValue(evt, name) {
    let first_date = null;
    let first_time = null;
    let second_date = null;
    let second_time = null;
    let str = null;

    switch (name) {
      case "first_date":
        first_date = evt != null ? evt.format('YYYY-MM-DD') : null;
        first_time = _.get(this, 'props.value.first_time', null);
        second_date = _.get(this, 'props.value.second_date', null);
        second_time = _.get(this, 'props.value.second_time', null);
        break;
      case "first_time":
        first_date = _.get(this, 'props.value.first_date', null);
        first_time = evt != null ? evt.format('HH:mm:ss') : null;
        second_date = _.get(this, 'props.value.second_date', null);
        second_time = _.get(this, 'props.value.second_time', null);
        break;
      case "second_date":
        first_date = _.get(this, 'props.value.first_date', null);
        first_time = _.get(this, 'props.value.first_time', null);
        second_date = evt != null ? evt.format('YYYY-MM-DD') : null;
        second_time = _.get(this, 'props.value.second_time', null);
        break;
      case "second_time":
        first_date = _.get(this, 'props.value.first_date', null);
        first_time = _.get(this, 'props.value.first_time', null);
        second_date = _.get(this, 'props.value.second_date', null);
        second_time = evt != null ? evt.format('HH:mm:ss') : null;
        break;
      default:
        break;
    }

    if (first_date || second_date || first_time || second_time) {
      if (first_time) {
        if (second_time) {
          str = `Interval[@${first_date}T${first_time},@${second_date}T${second_time}]`;
        } else {
          str = `Interval[@${first_date}T${first_time},@${second_date}]`;
        }
      } else {
        if (second_time) {
          str = `Interval[@${first_date},@${second_date}T${second_time}]`;
        } else {
          str = `Interval[@${first_date},@${second_date}]`;
        }
      }
      return { first_date: first_date, first_time: first_time, second_date: second_date, second_time: second_time, str: str };
    } else {
      return null;
    }
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <label>First Date:</label>
          <DatePicker
            id={id}
            selected={moment(_.get(value, 'first_date', null), 'YYYY-MM-DD').isValid() ? moment(value.first_date, 'YYYY-MM-DD') : null}
            dateFormat="L"
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'first_date') })
            }}
          />
          <label>First Time:</label>
          <TimePicker
            id={id}
            defaultValue={moment(_.get(value, 'first_time', null), 'HH:mm:ss').isValid() ? moment(value.first_time, 'HH:mm:ss') : null}
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'first_time') })
            }}
          />
          <br/>
          <label>Second Date:</label>
          <DatePicker
            id={id}
            selected={moment(_.get(value, 'second_date', null), 'YYYY-MM-DD').isValid() ? moment(value.second_date, 'YYYY-MM-DD') : null}
            dateFormat="L"
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'second_date') })
            }}
          />
          <label>Second Time:</label>
          <TimePicker
            id={id}
            defaultValue={moment(_.get(value, 'second_time', null), 'HH:mm:ss').isValid() ? moment(value.second_time, 'HH:mm:ss') : null}
            onChange={ e =>
              {updateInstance({ name: name, type: type, value: this.assignValue(e, 'second_time') })
            }}
          />
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

    if (first_decimal || second_decimal) {
      let str = `Interval[${first_decimal},${second_decimal}]`;
      return { first_decimal: first_decimal, second_decimal: second_decimal, str: str };
    } else {
      return null;
    }
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

    if (first_quantity || second_quantity || unit) {
      let str = `Interval[${first_quantity} '${unit}',${second_quantity} '${unit}']`;
      return { first_quantity: first_quantity, second_quantity: second_quantity, unit: unit, str: str };
    } else {
      return null;
    }
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
