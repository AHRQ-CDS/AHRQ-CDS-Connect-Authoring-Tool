import getProperty from '../../utils/getProperty';

describe('getProperty', () => {
  describe('simple properties', () => {
    const weightObs = {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [
          { system: 'http://loinc.org', code: '3141-9', display: 'Weight Measured' },
          { system: 'http://snomed.info/sct', code: '27113001', display: 'Body weight' }
        ]
      },
      valueQuantity: { value: 185, unit: 'lbs', system: 'http://unitsofmeasure.org', code: '[lb_av]' }
    };

    it('should get a simple top-level property', () => {
      expect(getProperty(weightObs, 'status')).toEqual('final');
    });

    it('should get a simple nested property', () => {
      expect(getProperty(weightObs, 'valueQuantity.value')).toEqual('185');
    });

    it('should get a simple property using firstObject', () => {
      expect(getProperty(weightObs, 'code.coding.firstObject.code')).toEqual('3141-9');
    });
  });

  describe('property parsers', () => {
    // Note: There's nothing in the code that requires these to be valid FHIR objects
    // so we're using simple objects for testing purposes.

    it('should get a Coding property', () => {
      const obj = {
        foo: { system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus (disorder)' }
      };
      expect(getProperty(obj, 'Coding:foo')).toEqual('Diabetes mellitus (disorder)');
    });

    it('should get a CodeableConcept property', () => {
      const obj = {
        foo: {
          coding: [{ system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus (disorder)' }],
          text: 'Diabetes'
        }
      };
      expect(getProperty(obj, 'CodeableConcept:foo')).toEqual('Diabetes');
    });

    it('should get a Quantity property', () => {
      const obj = {
        foo: { value: 4.5, system: 'ttp://unitsofmeasure.org', code: 'a', unit: 'year' }
      };
      expect(getProperty(obj, 'Quantity:foo')).toEqual('4.5 a');
    });

    it('should get a Range property', () => {
      const obj = {
        foo: {
          low: { value: 2, system: 'ttp://unitsofmeasure.org', code: 'wk' },
          high: { value: 6, system: 'ttp://unitsofmeasure.org', code: 'wk' }
        }
      };
      expect(getProperty(obj, 'Range:foo')).toEqual('2 wk - 6 wk');
    });

    it('should get a Ratio property', () => {
      const obj = {
        foo: {
          numerator: { value: 120, system: 'ttp://unitsofmeasure.org', code: 'ml' },
          denominator: { value: 4, system: 'ttp://unitsofmeasure.org', code: 'd' }
        }
      };
      expect(getProperty(obj, 'Ratio:foo')).toEqual('120 ml / 4 d');
    });

    it('should get a Period property', () => {
      const obj = {
        foo: {
          start: '2001-01-01',
          end: '2003-05-12'
        }
      };
      expect(getProperty(obj, 'Period:foo')).toEqual('2001-01-01 - 2003-05-12');
    });

    it('should get an Identifier property', () => {
      const obj = {
        foo: { use: 'official', system: 'urn:oid:2.16.840.1.113883.16.4.3.2.5', value: '123' }
      };
      expect(getProperty(obj, 'Identifier:foo')).toEqual('123');
    });

    it('should get a HumanName property', () => {
      const obj = {
        foo: { text: 'Bob Smith', family: ['Smith'], given: ['Robert'] }
      };
      expect(getProperty(obj, 'HumanName:foo')).toEqual('Bob Smith');
    });

    it('should get an Annotation property', () => {
      const obj = {
        foo: { text: 'Don\'t worry. Everything is fine.' }
      };
      expect(getProperty(obj, 'Annotation:foo')).toEqual('Don\'t worry. Everything is fine.');
    });

    it('should get an Address property', () => {
      const obj = {
        foo: {
          line: ['1050 W Wishard Blvd'],
          city: 'Indianapolis',
          state: 'IN',
          postalCode: '46240',
          country: 'USA'
        }
      };
      expect(getProperty(obj, 'Address:foo')).toEqual('Indianapolis, IN, USA');
    });

    it('should get an ContactPoint property', () => {
      const obj = {
        foo: { system: 'phone', value: '555-555-1212' }
      };
      expect(getProperty(obj, 'ContactPoint:foo')).toEqual('555-555-1212');
    });

    it('should get a Reference property', () => {
      const obj = {
        foo: { reference: 'Practitioner/123', display: 'Dr. Jones' }
      };
      expect(getProperty(obj, 'Reference:foo')).toEqual('Dr. Jones');
    });

    it('should get a SampledData property', () => {
      const obj = {
        foo: {
          origin: { value: 0, system: 'ttp://unitsofmeasure.org', code: 'uV' },
          period: 2,
          factor: 2.5,
          dimensions: 1,
          value: '-4 -13 -18 -18 -18 -17 -16 -16 -16 -16 -16 -17 -18 -18 -18'
        }
      };
      expect(getProperty(obj, 'SampledData:foo')).toEqual('<sampled data>');
    });

    it('should get an Attachment property', () => {
      const obj = {
        foo: { contentType: 'application/pdf', language: 'en', data: '<data-goes-here>', title: 'Sample PDF' }
      };
      expect(getProperty(obj, 'Attachment:foo')).toEqual('<attachment>');
    });

    it('should get a Timing property', () => {
      const obj = {
        foo: { repeat: { frequency: 2, period: 1, periodUnits: 'd' } }
      };
      expect(getProperty(obj, 'Timing:foo')).toEqual('<timing>');
    });

    it('should get a Signature property', () => {
      const obj = {
        foo: {
          type: [{ system: 'http://hl7.org/fhir/valueset-signature-type', code: '1.2.840.10065.1.12.1.1', display: 'AuthorID' }],
          when: '2001-01-01T10:30:00.0-05:00',
          whoUri: 'urn:oid:1.2.3.4.5',
          contentType: 'application/pdf',
          bob: '<signature blob>'
        }
      };
      expect(getProperty(obj, 'Signature:foo')).toEqual('<signature>');
    });
  });

  describe('choices', () => {
    // Note: There's nothing in the code that requires these to be valid FHIR objects
    // so we're using simple objects for testing purposes.

    // First simple data types

    it('should get a string property', () => {
      const obj = {
        fooString: 'Caution'
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Caution');
    });

    it('should get a date property', () => {
      const obj = {
        fooDate: '2001-01-01'
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('2001-01-01');
    });

    it('should get a dateTime property', () => {
      const obj = {
        fooDateTime: '2001-01-01T00:00:00.0'
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('2001-01-01T00:00:00.0');
    });

    it('should get a time property', () => {
      const obj = {
        fooTime: '00:00:00.0'
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('00:00:00.0');
    });

    it('should get a boolean property', () => {
      const obj = {
        fooBoolean: false
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('false');
    });

    it('should get an integer property', () => {
      const obj = {
        fooInteger: 123
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('123');
    });

    it('should get a decimal property', () => {
      const obj = {
        fooDecimal: 1.23
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('1.23');
    });

    // Then complex data types

    it('should get a Coding property', () => {
      const obj = {
        fooCoding: { system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus (disorder)' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Diabetes mellitus (disorder)');
    });

    it('should get a CodeableConcept property', () => {
      const obj = {
        fooCodeableConcept: {
          coding: [{ system: 'http://snomed.info/sct', code: '73211009', display: 'Diabetes mellitus (disorder)' }],
          text: 'Diabetes'
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Diabetes');
    });

    it('should get a Quantity property', () => {
      const obj = {
        fooQuantity: { value: 4.5, system: 'ttp://unitsofmeasure.org', code: 'a', unit: 'year' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('4.5 a');
    });

    it('should get a Range property', () => {
      const obj = {
        fooRange: {
          low: { value: 2, system: 'ttp://unitsofmeasure.org', code: 'wk' },
          high: { value: 6, system: 'ttp://unitsofmeasure.org', code: 'wk' }
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('2 wk - 6 wk');
    });

    it('should get a Ratio property', () => {
      const obj = {
        fooRatio: {
          numerator: { value: 120, system: 'ttp://unitsofmeasure.org', code: 'ml' },
          denominator: { value: 4, system: 'ttp://unitsofmeasure.org', code: 'd' }
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('120 ml / 4 d');
    });

    it('should get a Period property', () => {
      const obj = {
        fooPeriod: {
          start: '2001-01-01',
          end: '2003-05-12'
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('2001-01-01 - 2003-05-12');
    });

    it('should get an Identifier property', () => {
      const obj = {
        fooIdentifier: { use: 'official', system: 'urn:oid:2.16.840.1.113883.16.4.3.2.5', value: '123' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('123');
    });

    it('should get a HumanName property', () => {
      const obj = {
        fooHumanName: { text: 'Bob Smith', family: ['Smith'], given: ['Robert'] }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Bob Smith');
    });

    it('should get an Annotation property', () => {
      const obj = {
        fooAnnotation: { text: 'Don\'t worry. Everything is fine.' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Don\'t worry. Everything is fine.');
    });

    it('should get an Address property', () => {
      const obj = {
        fooAddress: {
          line: ['1050 W Wishard Blvd'],
          city: 'Indianapolis',
          state: 'IN',
          postalCode: '46240',
          country: 'USA'
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Indianapolis, IN, USA');
    });

    it('should get an ContactPoint property', () => {
      const obj = {
        fooContactPoint: { system: 'phone', value: '555-555-1212' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('555-555-1212');
    });

    it('should get a Reference property', () => {
      const obj = {
        fooReference: { reference: 'Practitioner/123', display: 'Dr. Jones' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('Dr. Jones');
    });

    it('should get a SampledData property', () => {
      const obj = {
        fooSampledData: {
          origin: { value: 0, system: 'ttp://unitsofmeasure.org', code: 'uV' },
          period: 2,
          factor: 2.5,
          dimensions: 1,
          value: '-4 -13 -18 -18 -18 -17 -16 -16 -16 -16 -16 -17 -18 -18 -18'
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('<sampled data>');
    });

    it('should get an Attachment property', () => {
      const obj = {
        fooAttachment: { contentType: 'application/pdf', language: 'en', data: '<data-goes-here>', title: 'Sample PDF' }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('<attachment>');
    });

    it('should get a Timing property', () => {
      const obj = {
        fooTiming: { repeat: { frequency: 2, period: 1, periodUnits: 'd' } }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('<timing>');
    });

    it('should get a Signature property', () => {
      const obj = {
        fooSignature: {
          type: [{ system: 'http://hl7.org/fhir/valueset-signature-type', code: '1.2.840.10065.1.12.1.1', display: 'AuthorID' }],
          when: '2001-01-01T10:30:00.0-05:00',
          whoUri: 'urn:oid:1.2.3.4.5',
          contentType: 'application/pdf',
          bob: '<signature blob>'
        }
      };
      expect(getProperty(obj, 'foo[x]')).toEqual('<signature>');
    });
  });
});
