function updateTree(element, down = false) {
  let updated = false;
  if (element && element.childInstances) {
    element.childInstances.forEach(child => {
      if ('childInstances' in child) {
        updated = updateTree(child, down) || updated;
      } else {
        updated = updateElement(child, down) || updated;
      }
    });
  }
  return updated;
}

function updateElement(element, down = false) {
  let updated = false;
  if (element && element.modifiers) {
    element.modifiers.forEach(modifier => {
      if (modifier.id === 'LookBackMedicationRequest' || modifier.id === 'LookBackMedicationStatement') {
        if (down) {
          delete modifier.validator;
          if (modifier.values && modifier.values.value == null && modifier.values.unit == null) {
            delete modifier.values;
          }
          updated = true;
        } else if (modifier.validator == null) {
          modifier.validator = { type: 'require', fields: ['value', 'unit'], args: null };
          if (modifier.values == null || (modifier.values && Object.keys(modifier.values).length === 0)) {
            modifier.values = { value: undefined, unit: undefined };
          }
          updated = true;
        }
      }
    });
  }
  return updated;
}

module.exports = {
  async up(db, client) {
    console.log(
      'This migration adds the validator to LookBack modifiers on MedicationRequests and MedicationStatements ' +
        'and adds back the modifier values if they were left blank'
    );
    const allArtifacts = await db.collection('artifacts').find({}).toArray();
    const artifactsToUpdate = allArtifacts
      .map(artifact => {
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
          return artifact; // return updated artifact
        }
        return null; // if artifact doesn't need to be updated, don't return anything
      })
      .filter(a => a);

    let migrateCount = 0;
    for (const artifact of artifactsToUpdate) {
      await db.collection('artifacts').updateOne({ _id: artifact._id }, { $set: artifact });
      console.log(`${artifact._id} (${artifact.name}) successfully updated`);
      migrateCount = migrateCount + 1;
    }
    console.log(`Migrated UP ${migrateCount} artifacts (only applicable artifacts are counted).`);
  },

  async down(db, client) {
    console.log(
      'This migration removes the validator to LookBack modifiers on MedicationRequests and MedicationStatements'
    );
    const allArtifacts = await db.collection('artifacts').find({}).toArray();
    const artifactsToUpdate = allArtifacts
      .map(artifact => {
        let updated = false;
        if (artifact.expTreeInclude) {
          updated = updateTree(artifact.expTreeInclude, true) || updated;
        }
        if (artifact.expTreeExclude) {
          updated = updateTree(artifact.expTreeExclude, true) || updated;
        }
        artifact.subpopulations.forEach(subpopulation => {
          if (!subpopulation.special) {
            updated = updateTree(subpopulation, true) || updated;
          }
        });
        artifact.baseElements.forEach(baseElement => {
          if (baseElement.childInstances) {
            updated = updateTree(baseElement, true) || updated;
          } else {
            updated = updateElement(baseElement, true) || updated;
          }
        });

        if (updated) {
          return artifact; // return updated artifact
        }
        return null; // if artifact doesn't need to be updated, don't return anything
      })
      .filter(a => a);

    let migrateCount = 0;
    for (const artifact of artifactsToUpdate) {
      await db.collection('artifacts').updateOne({ _id: artifact._id }, { $set: artifact });
      console.log(`${artifact._id} (${artifact.name}) successfully reverted`);
      migrateCount = migrateCount + 1;
    }
    console.log(`Migrated DOWN ${migrateCount} artifacts (only applicable artifacts are counted).`);
  }
};
