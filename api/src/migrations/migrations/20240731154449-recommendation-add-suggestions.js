module.exports = {
  async up(db, client) {
    console.log('This migration adds an empty suggestions array to each recommendation');
    const allArtifacts = await db.collection('artifacts').find({}).toArray();
    let migrateCount = 0;
    for (const artifact of allArtifacts) {
      artifact.recommendations.forEach(recommendation => {
        if (!recommendation.suggestions) {
          recommendation.suggestions = [];
        }
      });
      await db.collection('artifacts').updateOne({ _id: artifact._id }, { $set: artifact });
      console.log(`${artifact._id} (${artifact.name}) successfully updated`);
      migrateCount = migrateCount + 1;
    }
    console.log(`Migrated UP ${migrateCount} artifacts (only applicable artifacts are counted).`);
  },

  async down(db, client) {
    console.log(
      'The DOWN functionality has not been implemented for this migration as we do not expect' +
        ' a need to rollback this functionality.'
    );
  }
};
