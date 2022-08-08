/**
 * In Summer 2022, the VSAC FHIR API started appending "|{version}" to the end
 * of resource ids in search results. This is not actually a valid FHIR id, and
 * it causes problems because other parts of the VSAC API don't accept it as an
 * id. Since we prefer non-version-specific value sets anyway, this migration
 * strips the version suffix from the id.
 */
'use strict';

module.exports.id = 'clean-vs-ids';

function updateTree(element) {
  let updated = false;
  if (element && element.childInstances) {
    element.childInstances.forEach(child => {
      if ('childInstances' in child) {
        updated = updateTree(child) || updated;
      } else {
        updated = updateElement(child) || updated;
      }
    });
  }
  return updated;
}

function updateElement(element) {
  let updated = false;
  if (element && element.fields) {
    element.fields.forEach(field => {
      if (field.valueSets) {
        field.valueSets.forEach(vs => {
          if (vs.oid && vs.oid.indexOf('|') !== -1) {
            vs.oid = vs.oid.slice(0, vs.oid.indexOf('|'));
            updated = true;
          }
        });
      }
    });
  }
  return updated;
}

module.exports.up = function (done) {
  this.log('Migrating: clean-vs-ids');
  var coll = this.db.collection('artifacts');
  // Since db operations are asynchronous, use promises to ensure all updates happen before we call done().
  // The promises array collects all the promises which must be resolved before we're done.
  const promises = [];
  coll.find().forEach(
    artifact => {
      let updated = false;
      if (artifact.expTreeInclude) {
        updated = updateTree(artifact.expTreeInclude) || updated;
      }
      if (artifact.expTreeExclude) {
        updated = updateTree(artifact.expTreeExclude) || updated;
      }
      artifact.subpopulations.forEach(subpopulation => {
        if (!subpopulation.special) {
          updated = updateTree(subpopulation) || updated;
        }
      });
      artifact.baseElements.forEach(baseElement => {
        if (baseElement.childInstances) {
          updated = updateTree(baseElement) || updated;
        } else {
          updated = updateElement(baseElement) || updated;
        }
      });

      if (updated) {
        const p = new Promise((resolve, reject) => {
          // Update the artifact with all the changes made
          coll.updateOne({ _id: artifact._id }, { $set: artifact }, (err, result) => {
            if (err) {
              this.log(`${artifact._id}: error:`, err);
              reject(err);
            } else {
              this.log(`${artifact._id} (${artifact.name}): successfully updated.`);
              resolve(result);
            }
          });
        });
        promises.push(p);
      }
    },
    err => {
      if (err) {
        this.log('Migration Error:', err);
        done(err);
      } else {
        Promise.all(promises)
          .then(results => {
            this.log(`Migrated ${results.length} artifacts (only applicable artifacts are counted)`);
            done();
          })
          .catch(err => {
            this.log('Migration Error:', err);
            done(err);
          });
      }
    }
  );
};

module.exports.down = function (done) {
  done();
};
