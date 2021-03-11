import { sortByDateEdited, sortByDateCreated, sortByName, sortByVersion } from '../artifactSort';
import getProperty from '../getProperty';

const createMockArtifact = (name, version, lastEdited, created) => {
  return {
    name: name,
    version: version,
    updatedAt: lastEdited,
    createdAt: created
  };
};

/* Returns a chronological sequence of dates */
const createDateSequence = numDates => {
  let dates = [];
  for (let dateIndex = 0; dateIndex < numDates; dateIndex++) {
    let now = new Date();
    now.setHours(dateIndex);
    dates.push(now.toISOString());
  }
  return dates;
};

describe('artifactSort', () => {
  describe('sortByDateEdited: Do later dates come first?', () => {
    const dates = createDateSequence(5);
    dates.reverse();

    it('should sort artifacts in order of their edited date (IN-ORDER)', () => {
      let artifacts = dates.map((date, index) => {
        return createMockArtifact(index.toString(), '', date, '');
      });

      artifacts = artifacts.sort(sortByDateEdited);

      expect(getProperty(artifacts[0], 'name')).toEqual('0');
      expect(getProperty(artifacts[1], 'name')).toEqual('1');
      expect(getProperty(artifacts[2], 'name')).toEqual('2');
      expect(getProperty(artifacts[3], 'name')).toEqual('3');
      expect(getProperty(artifacts[4], 'name')).toEqual('4');
    });
    it('should sort artifacts in order of their edited date (REVERSE)', () => {
      let artifacts = dates.map((date, index) => {
        return createMockArtifact(index.toString(), '', date, '');
      });

      artifacts.reverse();
      artifacts = artifacts.sort(sortByDateEdited);

      expect(getProperty(artifacts[0], 'name')).toEqual('0');
      expect(getProperty(artifacts[1], 'name')).toEqual('1');
      expect(getProperty(artifacts[2], 'name')).toEqual('2');
      expect(getProperty(artifacts[3], 'name')).toEqual('3');
      expect(getProperty(artifacts[4], 'name')).toEqual('4');
    });
  });

  describe('sortByDateCreated: Do later dates come first?', () => {
    const dates = createDateSequence(5);
    dates.reverse();

    it('should sort artifacts in order of their creation date (IN-ORDER)', () => {
      let artifacts = dates.map((date, index) => {
        return createMockArtifact(index.toString(), '', '', date);
      });

      artifacts = artifacts.sort(sortByDateCreated);

      expect(getProperty(artifacts[0], 'name')).toEqual('0');
      expect(getProperty(artifacts[1], 'name')).toEqual('1');
      expect(getProperty(artifacts[2], 'name')).toEqual('2');
      expect(getProperty(artifacts[3], 'name')).toEqual('3');
      expect(getProperty(artifacts[4], 'name')).toEqual('4');
    });

    it('should sort artifacts in order of their creation date (REVERSE)', () => {
      let artifacts = dates.map((date, index) => {
        return createMockArtifact(index.toString(), '', '', date);
      });

      artifacts.reverse();
      artifacts = artifacts.sort(sortByDateCreated);

      expect(getProperty(artifacts[0], 'name')).toEqual('0');
      expect(getProperty(artifacts[1], 'name')).toEqual('1');
      expect(getProperty(artifacts[2], 'name')).toEqual('2');
      expect(getProperty(artifacts[3], 'name')).toEqual('3');
      expect(getProperty(artifacts[4], 'name')).toEqual('4');
    });
  });

  describe('sortByName: Does alphabetical sorting work?', () => {
    const names = ['a', 'aa', 'banana', 'calligraphy', 'dogma'];

    it('should sort artifacts lexicographically based on their name (IN-ORDER)', () => {
      let artifacts = names.map((name, index) => {
        return createMockArtifact(name, index.toString(), '', '');
      });

      artifacts = artifacts.sort(sortByName);
      expect(getProperty(artifacts[0], 'version')).toEqual('0');
      expect(getProperty(artifacts[1], 'version')).toEqual('1');
      expect(getProperty(artifacts[2], 'version')).toEqual('2');
      expect(getProperty(artifacts[3], 'version')).toEqual('3');
      expect(getProperty(artifacts[4], 'version')).toEqual('4');
    });

    it('should sort artifacts lexicographically based on their name (REVERSE)', () => {
      let artifacts = names.map((name, index) => {
        return createMockArtifact(name, index.toString(), '', '');
      });
      artifacts.reverse();
      artifacts = artifacts.sort(sortByName);
      expect(getProperty(artifacts[0], 'version')).toEqual('0');
      expect(getProperty(artifacts[1], 'version')).toEqual('1');
      expect(getProperty(artifacts[2], 'version')).toEqual('2');
      expect(getProperty(artifacts[3], 'version')).toEqual('3');
      expect(getProperty(artifacts[4], 'version')).toEqual('4');
    });
  });

  describe('sortByVersion: Greater APR Precedes Lesser APR', () => {
    const orderedVersions = [
      '1.1.0',
      '1.0.1',
      '1.0.0',
      '0.1.0',
      '0.0.1',
      '0.0.0',
      'alphabet',
      'balloons',
      'cats',
      'dylan',
      'jacob',
      'xylem',
      'zebras',
      ''
    ];

    //eslint-disable-next-line
    it('should sort artifacts by APR version strings (IN-ORDER),\
         then default to STRING comparison, then to EMPTY strings', () => {
      let artifacts = orderedVersions.map((version, index) => {
        return createMockArtifact(index.toString(), version, '', '');
      });

      artifacts = artifacts.sort(sortByVersion);
      expect(JSON.stringify(artifacts.map(a => a.version))).toEqual(JSON.stringify(orderedVersions));
    });

    //eslint-disable-next-line
    it('should sort artifacts by APR version strings (REVERSE),\
         then default to STRING comparison, then to EMPTY strings', () => {
      let unorderedVersions = orderedVersions.map(v => v).reverse();

      let artifacts = unorderedVersions.map((version, index) => {
        return createMockArtifact(index.toString(), version, '', '');
      });

      artifacts = artifacts.sort(sortByVersion);
      expect(JSON.stringify(artifacts.map(a => a.version))).toEqual(JSON.stringify(orderedVersions));
    });
  });
});
