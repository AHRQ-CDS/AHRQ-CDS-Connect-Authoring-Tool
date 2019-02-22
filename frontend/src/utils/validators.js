const exists = el => el !== undefined && el !== '' && el !== null && !Number.isNaN(el);

export default {
  or: {
    check: (values, args = []) => values.some(exists),
    warning: (fields, args) => `You should provide at least one of the following: ${fields.join(', ')}.`
  },
  and: {
    check: (values, args = []) => values.every(exists),
    warning: (fields, args) => `You should provide all of the following: ${fields.join(', ')}.`
  },
  // Ok, this is more or less the exact same thing as 'and' but the warning is different
  require: {
    check: (values, args = []) => values.every(exists),
    warning: (fields, args) => `The following fields are required: ${fields.join(', ')}.`
  },
  regex: {
    check: (values, args = []) => {
      const regex = RegExp(args[0]);
      return values.every(el => regex.test(el));
    },
    warning: (fields, args) => `${fields.join(', ')} must conform to the pattern ${RegExp(args[0])}.`
  },
  ifThenAll: {
    check: (values, args = []) => {
      if (exists(values[0])) { return values.every(exists); }
      return true;
    },
    warning: (fields, args) => `You must specify ${fields.slice(1).join(', ')} if you specify ${fields[0]}.`
  },
  requiredIfThenOne: {
    check: (values, args = []) => {
      if (exists(values[0]) && values.length > 0) { return values.slice(1).some(exists); }
      return false;
    },
    warning: (fields, args = []) => `You must specify ${fields[0]} and one of ${fields.slice(1).join(', ')}.`
  }
};
