import Validators from '../validators';

describe('or validator', () => {
  it('should pass when fields have strings', () => {
    expect(Validators.or.check(['test'])).toEqual(true);
  });
  it('should pass when only one field has values', () => {
    expect(Validators.or.check(['test', null])).toEqual(true);
  });
  it('should pass when all fields have values', () => {
    expect(Validators.or.check(['test', 'test'])).toEqual(true);
  });
  it('should pass when fields have numbers', () => {
    expect(Validators.or.check([1])).toEqual(true);
    expect(Validators.or.check([0])).toEqual(true);
    expect(Validators.or.check([-1])).toEqual(true);
  });
  it('should fail when fields are empty', () => {
    expect(Validators.or.check([null])).toEqual(false);
    expect(Validators.or.check([undefined])).toEqual(false);
    expect(Validators.or.check([''])).toEqual(false);
  });
  it('should provide a good warning message', () => {
    expect(Validators.or.warning(['MyField'])).toEqual('You should provide at least one of the following: MyField.');
  });
});

describe('and validator', () => {
  it('should pass when fields have strings', () => {
    expect(Validators.and.check(['test'])).toEqual(true);
  });
  it('should fail when only one field has values', () => {
    expect(Validators.and.check(['test', null])).toEqual(false);
    expect(Validators.and.check([null, 'test'])).toEqual(false);
  });
  it('should pass when all fields have values', () => {
    expect(Validators.and.check(['test', 'test'])).toEqual(true);
  });
  it('should pass when fields have numbers', () => {
    expect(Validators.and.check([1])).toEqual(true);
    expect(Validators.and.check([0])).toEqual(true);
    expect(Validators.and.check([-1])).toEqual(true);
  });
  it('should fail when fields are empty', () => {
    expect(Validators.and.check([null])).toEqual(false);
    expect(Validators.and.check([undefined])).toEqual(false);
    expect(Validators.and.check([''])).toEqual(false);
    expect(Validators.and.check([NaN])).toEqual(false);
  });
  it('should provide a good warning message', () => {
    expect(Validators.and.warning(['MyField'])).toEqual('You should provide all of the following: MyField.');
  });
});

describe('require validator', () => {
  it('should pass when fields have strings', () => {
    expect(Validators.require.check(['test'])).toEqual(true);
  });
  it('should fail when only one field has values', () => {
    expect(Validators.require.check(['test', null])).toEqual(false);
    expect(Validators.require.check([null, 'test'])).toEqual(false);
  });
  it('should pass when all fields have values', () => {
    expect(Validators.require.check(['test', 'test'])).toEqual(true);
  });
  it('should pass when fields have numbers', () => {
    expect(Validators.require.check([1])).toEqual(true);
    expect(Validators.require.check([0])).toEqual(true);
    expect(Validators.require.check([-1])).toEqual(true);
  });
  it('should fail when fields are empty', () => {
    expect(Validators.require.check([null])).toEqual(false);
    expect(Validators.require.check([undefined])).toEqual(false);
    expect(Validators.require.check([''])).toEqual(false);
  });
  it('should provide a good warning message', () => {
    expect(Validators.require.warning(['MyField'])).toEqual('The following fields are required: MyField.');
  });
});

describe('ifThenAll validator', () => {
  it('should fail when the first field has a value and not the second one', () => {
    expect(Validators.ifThenAll.check(['test', null])).toEqual(false);
  });
  it('should fail when the first field has a value and all following', () => {
    expect(Validators.ifThenAll.check(['test', 'test2', null])).toEqual(false);
  });
  it('should pass when all fields have values', () => {
    expect(Validators.ifThenAll.check(['test', 'test'])).toEqual(true);
    expect(Validators.ifThenAll.check(['test', 'test', 'test'])).toEqual(true);
  });
  it('should provide a good warning message', () => {
    expect(Validators.ifThenAll.warning(['MyField', 'MyOtherField'])).toEqual(
      'You must specify MyOtherField if you specify MyField.'
    );
  });
});

describe('regex validator', () => {
  it('should fail when values fail regex', () => {
    expect(Validators.regex.check(['test'], ['[0-9]+'])).toEqual(false);
    expect(Validators.regex.check(['test', 'test'], ['[0-9]+'])).toEqual(false);
    expect(Validators.regex.check(['0', 'test'], ['[0-9]+'])).toEqual(false);
  });
  it('should pass when values pass regex', () => {
    expect(Validators.regex.check(['0'], ['[0-9]+'])).toEqual(true);
    expect(Validators.regex.check(['2', '5'], ['[0-9]+'])).toEqual(true);
  });
  it('should provide a good warning message', () => {
    expect(Validators.regex.warning(['MyField'], ['[0-9]+'])).toEqual('MyField must conform to the pattern /[0-9]+/.');
  });
});

describe('requiredIfThenOne validator', () => {
  it('should fail when the field only has first value', () => {
    expect(Validators.requiredIfThenOne.check(['test'])).toEqual(false);
    expect(Validators.requiredIfThenOne.check(['test', null])).toEqual(false);
    expect(Validators.requiredIfThenOne.check(['test', null, null])).toEqual(false);
  });
  it('should pass when the field has a value and one of the arguments has a value', () => {
    expect(Validators.requiredIfThenOne.check(['test', 'test2', null])).toEqual(true);
    expect(Validators.requiredIfThenOne.check(['test', null, 'test2'])).toEqual(true);
    expect(Validators.requiredIfThenOne.check(['test', 'test', 'test'])).toEqual(true);
  });
  it('should provide a good warning message', () => {
    expect(Validators.requiredIfThenOne.warning(['MyField', 'MySecondField', 'MyThirdField'])).toEqual(
      'You must specify MyField and one of MySecondField, MyThirdField.'
    );
  });
});
