/**
 * In Winter 2023, the VSAC FHIR API started appending "-{version}" to the end
 * of resource ids in search results. VSAC is actually violating the requirements
 * of a RESTful server by changing these ids to include the version. There
 * has been some discussion on Zulip about this topic, but ultimately the ids
 * should not include the version. The full discussion is here:
 * https://chat.fhir.org/#narrow/stream/179202-terminology/topic/VSAC.20Appending.20Version.20to.20ID
 * Since we prefer non-version-specific value sets anyway, this migration
 * strips the version suffix from the id.
 */
'use strict';

module.exports.id = 'clean-vs-ids-feb2023';

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
          if (vs.oid && vs.oid.indexOf('-') !== -1) {
            vs.oid = vs.oid.slice(0, vs.oid.lastIndexOf('-'));
            updated = true;
          }
        });
      }
    });
  }
  return updated;
}

module.exports.up = function (done) {
  this.log('Migrating: clean-vs-ids-feb2023');
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
