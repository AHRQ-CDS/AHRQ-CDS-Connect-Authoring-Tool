import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

/* eslint-disable class-methods-use-this */

// A component to be used in Parameter.js to provide
// an editor for a parameter of the given type
class ParameterEditor extends Component {
  render() {
    switch (this.props.type) {
      case 'Boolean':
        return <BooleanEditor {...this.props} />;
      case 'Code':
        return <CodeEditor {...this.props} />;
      case 'Concept':
        return <ConceptEditor {...this.props} />;
      case 'Integer':
        return <IntegerEditor {...this.props} />;
      case 'DateTime':
        return <DateTimeEditor {...this.props} />;
      case 'Decimal':
        return <DecimalEditor {...this.props} />;
      case 'Quantity':
        return <QuantityEditor {...this.props} />;
      case 'String':
        return <StringEditor {...this.props} />;
      case 'Time':
        return <TimeEditor {...this.props} />;
      case 'Interval<Integer>':
        return <IntervalOfIntegerEditor {...this.props} />;
      case 'Interval<DateTime>':
        return <IntervalOfDateTimeEditor {...this.props} />;
      case 'Interval<Decimal>':
        return <IntervalOfDecimalEditor {...this.props} />;
      case 'Interval<Quantity>':
        return <IntervalOfQuantityEditor {...this.props} />;
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
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
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
    let uri = null;
    let code = null;
    let display = null;

    switch (evt.target.name) {
      case 'system':
        system = _.get(evt, 'target.value', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'uri':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(evt, 'target.value', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'code':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(evt, 'target.value', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'display':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if (system || uri || code || display) {
      const str = `Code '${code}' from "${system}" display '${display}'`;
      return { system, uri, code, display, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>System:</label>
            <input
              id={id}
              name="system"
              type="text"
              value={ _.get(value, 'system', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>System URI:</label>
            <input
              id={id}
              name="uri"
              type="text"
              value={ _.get(value, 'uri', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Code:</label>
            <input
              id={id}
              name="code"
              type="text"
              value={ _.get(value, 'code', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Display:</label>
            <input
              id={id}
              name="display"
              type="text"
              value={ _.get(value, 'display', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
    let uri = null;
    let code = null;
    let display = null;

    switch (evt.target.name) {
      case 'system':
        system = _.get(evt, 'target.value', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'uri':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(evt, 'target.value', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'code':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(evt, 'target.value', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'display':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if (system || uri || code || display) {
      const str = `Concept { Code '${code}' from "${system}" } display '${display}'`;
      return { system, uri, code, display, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>System:</label>
            <input
              id={id}
              name="system"
              type="text"
              value={ _.get(value, 'system', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>System URI:</label>
            <input
              id={id}
              name="uri"
              type="text"
              value={ _.get(value, 'uri', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Code:</label>
            <input
              id={id}
              name="code"
              type="text"
              value={ _.get(value, 'code', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Display:</label>
            <input
              id={id}
              name="display"
              type="text"
              value={ _.get(value, 'display', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
    // read the value as an int, then convert it to a string
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
            value={(value || value === 0) ? value : ''}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
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
      case 'date':
        date = evt != null ? evt.format('YYYY-MM-DD') : null;
        time = _.get(this, 'props.value.time', null);
        break;
      case 'time':
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
      return { date, time, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Date: <DatePicker
            id={id}
            selected={
              moment(_.get(value, 'date', null), 'YYYY-MM-DD').isValid()
              ? moment(value.date, 'YYYY-MM-DD')
              : null}
            dateFormat="L"
            onChange={ (e) => {
updateInstance({ name, type, value: this.assignValue(e, 'date') });
            }}
          />
          Time: <TimePicker
            id={id}
            defaultValue={
              moment(_.get(value, 'time', null), 'HH:mm:ss').isValid()
              ? moment(value.time, 'HH:mm:ss')
              : null}
            onChange={ (e) => {
 updateInstance({ name, type, value: this.assignValue(e, 'time') });
            }}
          />
        </label>
      </div>
    );
  }
}

class DecimalEditor extends Component {
  assignValue(evt) {
    let decimal = null;
    let str = null;

    decimal = _.get(evt, 'target.value', null);
    if (decimal != null) { decimal = parseFloat(decimal, 10); }

    if (decimal || decimal === 0) {
      if (Number.isInteger(decimal)) {
        str = `${decimal}.0`;
      } else {
        str = `${decimal}`;
      }
      return { decimal, str };
    }
    return null;
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
            value={
              (_.get(value, 'decimal', null) || _.get(value, 'decimal', null) === 0)
              ? _.get(value, 'decimal')
              : '' }
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
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
    let str = null;

    switch (evt.target.name) {
      case 'quantity':
        quantity = _.get(evt, 'target.value', null);
        if (quantity != null) { quantity = parseFloat(quantity, 10); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        quantity = _.get(this, 'props.value.quantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if ((quantity || quantity === 0) || unit) {
      if (Number.isInteger(quantity)) {
        str = `${quantity}.0 '${unit}'`;
      } else {
        str = `${quantity} '${unit}'`;
      }
      return { quantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>Quantity:</label>
            <input
              id={id}
              name="quantity"
              type="number"
              value={
                (_.get(value, 'quantity', null) || _.get(value, 'quantity', null) === 0)
                ? _.get(value, 'quantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <label htmlFor={formId}>Unit:</label>
            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
            value={value ? value.replace(/'/g, '') : ''}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
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
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
            }}
          />
        </label>
      </div>
    );
  }
}

class IntervalOfIntegerEditor extends Component {
  assignValue(evt) {
    let firstInteger = null;
    let secondInteger = null;

    switch (evt.target.name) {
      case 'firstInteger':
        firstInteger = _.get(evt, 'target.value', null);
        if (firstInteger != null) { firstInteger = parseInt(firstInteger, 10); }
        secondInteger = _.get(this, 'props.value.secondInteger', null);
        break;
      case 'secondInteger':
        firstInteger = _.get(this, 'props.value.firstInteger', null);
        secondInteger = _.get(evt, 'target.value', null);
        if (secondInteger != null) { secondInteger = parseInt(secondInteger, 10); }
        break;
      default:
        break;
    }

    if ((firstInteger != null) || (secondInteger != null)) {
      const str = `Interval[${firstInteger},${secondInteger}]`;
      return { firstInteger, secondInteger, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>First Integer:</label>
            <input
              id={id}
              name="firstInteger"
              type="number"
              value={
                (_.get(value, 'firstInteger', null) || _.get(value, 'firstInteger', null) === 0)
                ? _.get(value, 'firstInteger')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <label htmlFor={formId}>Second Integer:</label>
            <input
              id={id}
              name="secondInteger"
              type="number"
              value={
                (_.get(value, 'secondInteger', null) || _.get(value, 'secondInteger', null) === 0)
                ? _.get(value, 'secondInteger')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
    let firstDate = null;
    let firstTime = null;
    let secondDate = null;
    let secondTime = null;
    let str = null;

    switch (name) {
      case 'firstDate':
        firstDate = evt != null ? evt.format('YYYY-MM-DD') : null;
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'firstTime':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = evt != null ? evt.format('HH:mm:ss') : null;
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'secondDate':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = evt != null ? evt.format('YYYY-MM-DD') : null;
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'secondTime':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = evt != null ? evt.format('HH:mm:ss') : null;
        break;
      default:
        break;
    }

    if (firstDate || secondDate || firstTime || secondTime) {
      if (firstTime) {
        if (secondTime) {
          str = `Interval[@${firstDate}T${firstTime},@${secondDate}T${secondTime}]`;
        } else {
          str = `Interval[@${firstDate}T${firstTime},@${secondDate}]`;
        }
      } else if (secondTime) {
        str = `Interval[@${firstDate},@${secondDate}T${secondTime}]`;
      } else {
        str = `Interval[@${firstDate},@${secondDate}]`;
      }
      return { firstDate, firstTime, secondDate, secondTime, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <label htmlFor={formId}>First Date:</label>
          <DatePicker
            id={id}
            selected={
              moment(_.get(value, 'firstDate', null), 'YYYY-MM-DD').isValid()
              ? moment(value.firstDate, 'YYYY-MM-DD')
              : null}
            dateFormat="L"
            onChange={ (e) => {
updateInstance({ name, type, value: this.assignValue(e, 'firstDate') });
            }}
          />
          <label htmlFor={formId}>First Time:</label>
          <TimePicker
            id={id}
            defaultValue={
              moment(_.get(value, 'firstTime', null), 'HH:mm:ss').isValid()
              ? moment(value.firstTime, 'HH:mm:ss')
              : null}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e, 'firstTime') });
            }}
          />
          <br/>
          <label htmlFor={formId}>Second Date:</label>
          <DatePicker
            id={id}
            selected={
              moment(_.get(value, 'secondDate', null), 'YYYY-MM-DD').isValid()
              ? moment(value.secondDate, 'YYYY-MM-DD')
              : null}
            dateFormat="L"
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e, 'secondDate') });
            }}
          />
          <label htmlFor={formId}>Second Time:</label>
          <TimePicker
            id={id}
            defaultValue={
              moment(_.get(value, 'secondTime', null), 'HH:mm:ss').isValid()
              ? moment(value.secondTime, 'HH:mm:ss')
              : null}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e, 'secondTime') });
            }}
          />
        </label>
      </div>
    );
  }
}

class IntervalOfDecimalEditor extends Component {
  assignValue(evt) {
    let firstDecimal = null;
    let secondDecimal = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstDecimal':
        firstDecimal = _.get(evt, 'target.value', null);
        if (firstDecimal != null) { firstDecimal = parseFloat(firstDecimal, 10); }
        secondDecimal = _.get(this, 'props.value.secondDecimal', null);
        break;
      case 'secondDecimal':
        firstDecimal = _.get(this, 'props.value.firstDecimal', null);
        secondDecimal = _.get(evt, 'target.value', null);
        if (secondDecimal != null) { secondDecimal = parseFloat(secondDecimal, 10); }
        break;
      default:
        break;
    }

    if ((firstDecimal || firstDecimal === 0) || (secondDecimal || secondDecimal === 0)) {
      if (Number.isInteger(firstDecimal)) {
        if (Number.isInteger(secondDecimal)) {
          str = `Interval[${firstDecimal}.0,${secondDecimal}.0]`;
        } else {
          str = `Interval[${firstDecimal}.0,${secondDecimal}]`;
        }
      } else if (Number.isInteger(secondDecimal)) {
        str = `Interval[${firstDecimal},${secondDecimal}.0]`;
      } else {
        str = `Interval[${firstDecimal},${secondDecimal}]`;
      }
      return { firstDecimal, secondDecimal, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>First Decimal:</label>
            <input
              id={id}
              name="firstDecimal"
              type="number"
              value={
                (_.get(value, 'firstDecimal', null) || _.get(value, 'firstDecimal', null) === 0)
                ? _.get(value, 'firstDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <label htmlFor={formId}>Second Decimal:</label>
            <input
              id={id}
              name="secondDecimal"
              type="number"
              value={
                (_.get(value, 'secondDecimal', null) || _.get(value, 'secondDecimal', null) === 0)
                ? _.get(value, 'secondDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
    let firstQuantity = null;
    let secondQuantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstQuantity':
        firstQuantity = _.get(evt, 'target.value', null);
        if (firstQuantity != null) { firstQuantity = parseFloat(firstQuantity, 10); }
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'secondQuantity':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(evt, 'target.value', null);
        if (secondQuantity != null) { secondQuantity = parseFloat(secondQuantity, 10); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if ((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0) || unit) {
      if (Number.isInteger(firstQuantity)) {
        if (Number.isInteger(secondQuantity)) {
          str = `Interval[${firstQuantity}.0 '${unit}',${secondQuantity}.0 '${unit}']`;
        } else {
          str = `Interval[${firstQuantity}.0 '${unit}',${secondQuantity} '${unit}']`;
        }
      } else if (Number.isInteger(secondQuantity)) {
        str = `Interval[${firstQuantity} '${unit}',${secondQuantity}.0 '${unit}']`;
      } else {
        str = `Interval[${firstQuantity} '${unit}',${secondQuantity} '${unit}']`;
      }
      return { firstQuantity, secondQuantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>First Quantity:</label>
            <input
              id={id}
              name="firstQuantity"
              type="number"
              value={
                (_.get(value, 'firstQuantity', null) || _.get(value, 'firstQuantity', null) === 0)
                ? _.get(value, 'firstQuantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <label htmlFor={formId}>Second Quantity:</label>
            <input
              id={id}
              name="secondQuantity"
              type="number"
              value={
                (_.get(value, 'secondQuantity', null) || _.get(value, 'secondQuantity', null) === 0)
                ? _.get(value, 'secondQuantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <label htmlFor={formId}>Unit:</label>
            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

export default ParameterEditor;
