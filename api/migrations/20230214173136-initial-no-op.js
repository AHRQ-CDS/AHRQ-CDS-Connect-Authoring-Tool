module.exports = {
  async up(db, client) {
    const count = await db.collection('artifacts').estimatedDocumentCount();
    console.log('This is a no-op migration to test migrate-mongo UP. It has no side-effects.');
    console.log(`Found an estimated ${count} documents in the artifacts collection.`);
  },

  async down(db, client) {
    const count = await db.collection('artifacts').estimatedDocumentCount();
    console.log('This is a no-op migration to test migrate-mongo DOWN. It has no side-effects.');
    console.log(`Found an estimated ${count} documents in the artifacts collection.`);
  }
};
