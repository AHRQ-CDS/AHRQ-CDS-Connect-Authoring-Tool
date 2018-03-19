export default {
  or: {
      check: (values, args=[]) => values.some((el) => el ),
      warning: (fields, args) => `You should provide at least one of the following: ${fields.join(", ")}.`
  },
  and: {
      check: (values, args=[]) => values.every((el) => el ),
      warning: (fields, args) => `You should provide all of the following: ${fields.join(", ")}.`
  },
  regex: {
      check: (values, args=[]) => {
        let regex = RegExp(args[0]);
        return values.every((el) => regex.test(el))
      },
      warning: (fields, args) => `${fields.join(", ")} must conform to the pattern ${RegExp(args[0])}`
  },
  ifThen: {
    check: (values, args=[]) => {
      if(values[0])
        return values.every((el) => el)
      return true;
    },
    warning: (fields, args) => `You must specify ${fields.slice(1).join(", ")} if you specify ${fields[0]}`
  }
}
