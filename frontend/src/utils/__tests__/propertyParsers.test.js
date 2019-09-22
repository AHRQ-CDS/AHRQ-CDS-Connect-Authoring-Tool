import * as p from '../propertyParsers';

describe('propertyParsers', () => {
  describe('Coding', () => {
    it('should return the display when it is present', () => {
      const coding = {
        system: 'http://snomed.info/sct',
        code: '73211009',
        display: 'Diabetes mellitus (disorder)'
      };
      expect(p.coding(coding)).toEqual('Diabetes mellitus (disorder)');
    });

    it('should return the code when display is not present', () => {
      const coding = {
        system: 'http://snomed.info/sct',
        code: '73211009'
      };
      expect(p.coding(coding)).toEqual('73211009');
    });

    it('should return empty string when coding is undefined', () => {
      expect(p.coding(undefined)).toEqual('');
    });
  });

  describe('CodeableConcept', () => {
    it('should return the text when it is present', () => {
      const concept = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '73211009',
          display: 'Diabetes mellitus (disorder)'
        }],
        text: 'Diabetes'
      };
      expect(p.codeableConcept(concept)).toEqual('Diabetes');
    });

    it('should return the coding display when text is not present', () => {
      const concept = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '73211009',
          display: 'Diabetes mellitus (disorder)'
        }]
      };
      expect(p.codeableConcept(concept)).toEqual('Diabetes mellitus (disorder)');
    });

    it('should return the first non-blank display when text is not present', () => {
      const concept = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '44054006'
        }, {
          system: 'http://snomed.info/sct',
          code: '73211009',
          display: 'Diabetes mellitus (disorder)'
        }]
      };
      expect(p.codeableConcept(concept)).toEqual('Diabetes mellitus (disorder)');
    });

    it('should return the first code when text and displays are not present', () => {
      const concept = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: '44054006'
        }, {
          system: 'http://snomed.info/sct',
          code: '73211009'
        }]
      };
      expect(p.codeableConcept(concept)).toEqual('44054006');
    });

    it('should return empty string when concept has no text or codings', () => {
      const concept = {
        coding: []
      };
      expect(p.codeableConcept(concept)).toEqual('');
    });

    it('should return empty string when concept is undefined', () => {
      expect(p.codeableConcept(undefined)).toEqual('');
    });
  });

  describe('Quantity', () => {
    it('should return the value and coded unit', () => {
      const quantity = {
        value: 4.5,
        system: 'ttp://unitsofmeasure.org',
        code: 'a',
        unit: 'year'
      };
      expect(p.quantity(quantity)).toEqual('4.5 a');
    });

    it('should return the value and string unit when coded unit is not present', () => {
      const quantity = {
        value: 4.5,
        unit: 'year'
      };
      expect(p.quantity(quantity)).toEqual('4.5 year');
    });

    it('should return only the value when no unit is present', () => {
      const quantity = {
        value: 4.5
      };
      expect(p.quantity(quantity)).toEqual('4.5');
    });

    it('should return empty string when quantity is undefined', () => {
      expect(p.quantity(undefined)).toEqual('');
    });
  });

  describe('Range', () => {
    it('should return low - high for full range', () => {
      const range = {
        low: { value: 2, system: 'ttp://unitsofmeasure.org', code: 'wk' },
        high: { value: 6, system: 'ttp://unitsofmeasure.org', code: 'wk' }
      };
      expect(p.range(range)).toEqual('2 wk - 6 wk');
    });

    it('should return min for low-only range', () => {
      const range = {
        low: { value: 2, system: 'ttp://unitsofmeasure.org', code: 'wk' }
      };
      expect(p.range(range)).toEqual('min: 2 wk');
    });

    it('should return max for high-only range', () => {
      const range = {
        high: { value: 6, system: 'ttp://unitsofmeasure.org', code: 'wk' }
      };
      expect(p.range(range)).toEqual('max: 6 wk');
    });

    it('should return empty string when no low or high is defined', () => {
      expect(p.range({})).toEqual('');
    });

    it('should return empty string when range is undefined', () => {
      expect(p.range(undefined)).toEqual('');
    });
  });

  describe('Ratio', () => {
    it('should return num / denom for full ratio', () => {
      const ratio = {
        numerator: { value: 120, system: 'ttp://unitsofmeasure.org', code: 'ml' },
        denominator: { value: 4, system: 'ttp://unitsofmeasure.org', code: 'd' }
      };
      expect(p.ratio(ratio)).toEqual('120 ml / 4 d');
    });

    it('should return <missing> / denom for denom-only ratio', () => {
      const ratio = {
        denominator: { value: 4, system: 'ttp://unitsofmeasure.org', code: 'd' }
      };
      expect(p.ratio(ratio)).toEqual('<missing> / 4 d');
    });

    it('should return num / <missing> for num-only ratio', () => {
      const ratio = {
        numerator: { value: 120, system: 'ttp://unitsofmeasure.org', code: 'ml' }
      };
      expect(p.ratio(ratio)).toEqual('120 ml / <missing>');
    });

    it('should return empty string when no num or denom is defined', () => {
      expect(p.ratio({})).toEqual('');
    });

    it('should return empty string when ratio is undefined', () => {
      expect(p.ratio(undefined)).toEqual('');
    });
  });

  describe('Period', () => {
    it('should return start - end for full period', () => {
      const period = {
        start: '2001-01-01',
        end: '2003-05-12'
      };
      expect(p.period(period)).toEqual('2001-01-01 - 2003-05-12');
    });

    it('should return start for start-only period', () => {
      const period = {
        start: '2001-01-01'
      };
      expect(p.period(period)).toEqual('start: 2001-01-01');
    });

    it('should return end for end-only period', () => {
      const period = {
        end: '2003-05-12'
      };
      expect(p.period(period)).toEqual('end: 2003-05-12');
    });

    it('should return empty string when no start or end is defined', () => {
      expect(p.period({})).toEqual('');
    });

    it('should return empty string when period is undefined', () => {
      expect(p.period(undefined)).toEqual('');
    });
  });

  describe('Identifier', () => {
    it('should return the value', () => {
      const identifier = {
        use: 'official',
        system: 'urn:oid:2.16.840.1.113883.16.4.3.2.5',
        value: '123'
      };
      expect(p.identifier(identifier)).toEqual('123');
    });

    it('should return empty string when no value is defined', () => {
      expect(p.identifier({})).toEqual('');
    });

    it('should return empty string when identifier is undefined', () => {
      expect(p.identifier(undefined)).toEqual('');
    });
  });

  describe('HumanName', () => {
    it('should return the text if present', () => {
      const name = {
        text: 'Bob Smith',
        family: ['Smith'],
        given: ['Robert']
      };
      expect(p.humanName(name)).toEqual('Bob Smith');
    });

    it('should return the given and family if text is not present', () => {
      const name = {
        family: ['Smith'],
        given: ['Robert']
      };
      expect(p.humanName(name)).toEqual('Robert Smith');
    });

    it('should return just the given if text and family is not present', () => {
      const name = {
        given: ['Robert']
      };
      expect(p.humanName(name)).toEqual('Robert');
    });

    it('should return just the family if text and given is not present', () => {
      const name = {
        family: ['Smith']
      };
      expect(p.humanName(name)).toEqual('Smith');
    });

    it('should return empty string when no components are defined', () => {
      expect(p.humanName({})).toEqual('');
    });

    it('should return empty string when humanName is undefined', () => {
      expect(p.humanName(undefined)).toEqual('');
    });
  });

  describe('Annotation', () => {
    it('should return the text if present', () => {
      const annotation = {
        text: 'Don\'t worry. Everything is fine.'
      };
      expect(p.annotation(annotation)).toEqual('Don\'t worry. Everything is fine.');
    });

    it('should return truncated text if long', () => {
      const annotation = {
        text: 'Four score and seven years ago our fathers brought forth on this continent, a new nation, ' +
        'conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are ' +
        'engaged in a great civil war, testing whether that nation, or any nation so conceived and so ' +
        'dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate ' +
        'a portion of that field, as a final resting place for those who here gave their lives that that ' +
        'nation might live. It is altogether fitting and proper that we should do this.'
      };
      expect(p.annotation(annotation)).toEqual('Four score and seven years ago our fathers brou...');
    });

    it('should return empty string when no text is defined', () => {
      expect(p.annotation({})).toEqual('');
    });

    it('should return empty string when annotation is undefined', () => {
      expect(p.annotation(undefined)).toEqual('');
    });
  });

  describe('Address', () => {
    it('should return the city, state, and country if present', () => {
      const address = {
        line: ['1050 W Wishard Blvd'],
        city: 'Indianapolis',
        state: 'IN',
        postalCode: '46240',
        country: 'USA'
      };
      expect(p.address(address)).toEqual('Indianapolis, IN, USA');
    });

    it('should return the city and state if country is not present', () => {
      const address = {
        line: ['1050 W Wishard Blvd'],
        city: 'Indianapolis',
        state: 'IN',
        postalCode: '46240'
      };
      expect(p.address(address)).toEqual('Indianapolis, IN');
    });

    it('should return the city and country if state is not present', () => {
      const address = {
        line: ['1050 W Wishard Blvd'],
        city: 'Indianapolis',
        country: 'USA'
      };
      expect(p.address(address)).toEqual('Indianapolis, USA');
    });

    it('should return just the city if state and country are not present', () => {
      const address = {
        line: ['1050 W Wishard Blvd'],
        city: 'Indianapolis',
      };
      expect(p.address(address)).toEqual('Indianapolis');
    });

    it('should return the state and country if city is not present', () => {
      const address = {
        state: 'IN',
        country: 'USA'
      };
      expect(p.address(address)).toEqual('IN, USA');
    });

    it('should return just the state if city and country are not present', () => {
      const address = {
        state: 'IN'
      };
      expect(p.address(address)).toEqual('IN');
    });

    it('should return just the country if city and state are not present', () => {
      const address = {
        country: 'USA'
      };
      expect(p.address(address)).toEqual('USA');
    });

    it('should return empty string when no components are defined', () => {
      expect(p.address({})).toEqual('');
    });

    it('should return empty string when address is undefined', () => {
      expect(p.address(undefined)).toEqual('');
    });
  });

  describe('ContactPoint', () => {
    it('should return the value', () => {
      const contact = {
        system: 'phone',
        value: '555-555-1212'
      };
      expect(p.contactPoint(contact)).toEqual('555-555-1212');
    });

    it('should return empty string when no value is defined', () => {
      expect(p.contactPoint({})).toEqual('');
    });

    it('should return empty string when contact point is undefined', () => {
      expect(p.contactPoint(undefined)).toEqual('');
    });
  });

  describe('Reference', () => {
    it('should return the display if it is present', () => {
      const reference = {
        reference: 'Practitioner/123',
        display: 'Dr. Jones'
      };
      expect(p.reference(reference)).toEqual('Dr. Jones');
    });

    it('should return the reference if display is not present', () => {
      const reference = {
        reference: 'Practitioner/123'
      };
      expect(p.reference(reference)).toEqual('Practitioner/123');
    });

    it('should return empty string when no components are defined', () => {
      expect(p.reference({})).toEqual('');
    });

    it('should return empty string when reference is undefined', () => {
      expect(p.reference(undefined)).toEqual('');
    });
  });

  // Note: We don't try to parse sampled data. We just indicate it is sampled data.
  describe('SampledData', () => {
    it('should return <sampled data> for any SampleData', () => {
      const sd = {
        origin: { value: 0, system: 'ttp://unitsofmeasure.org', code: 'uV' },
        period: 2,
        factor: 2.5,
        dimensions: 1,
        value: '-4 -13 -18 -18 -18 -17 -16 -16 -16 -16 -16 -17 -18 -18 -18'
      };
      expect(p.sampledData(sd)).toEqual('<sampled data>');
    });

    it('should return empty string when sampled data is undefined', () => {
      expect(p.sampledData(undefined)).toEqual('');
    });
  });

  // Note: We don't try to parse attachment. We just indicate it is an attachment.
  describe('Attachment', () => {
    it('should return <attachment> for any Attachment', () => {
      const a = {
        contentType: 'application/pdf',
        language: 'en',
        data: '<data-goes-here>',
        title: 'Sample PDF'
      };
      expect(p.attachment(a)).toEqual('<attachment>');
    });

    it('should return empty string when sampled data is undefined', () => {
      expect(p.attachment(undefined)).toEqual('');
    });
  });

  // Note: We don't try to parse timing. We just indicate it is a timing.
  describe('Timing', () => {
    it('should return <timing> for any Timing', () => {
      const t = {
        repeat: { frequency: 2, period: 1, periodUnits: 'd' }
      };
      expect(p.timing(t)).toEqual('<timing>');
    });

    it('should return empty string when timing is undefined', () => {
      expect(p.timing(undefined)).toEqual('');
    });
  });

  // Note: We don't try to parse signature. We just indicate it is a signature.
  describe('Signature', () => {
    it('should return <signature> for any Signature', () => {
      const s = {
        type: [{ system: 'http://hl7.org/fhir/valueset-signature-type', code: '1.2.840.10065.1.12.1.1', display: 'AuthorID' }],
        when: '2001-01-01T10:30:00.0-05:00',
        whoUri: 'urn:oid:1.2.3.4.5',
        contentType: 'application/pdf',
        bob: '<signature blob>'
      };
      expect(p.signature(s)).toEqual('<signature>');
    });

    it('should return empty string when signature is undefined', () => {
      expect(p.signature(undefined)).toEqual('');
    });
  });
});
