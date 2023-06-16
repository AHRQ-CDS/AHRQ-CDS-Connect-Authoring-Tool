const mm = require('migrate-mongo');
const config = require('./migrate-mongo-config');

module.exports = async function migrate() {
  mm.config.set(config);
  return mm.database
    .connect()
    .then(({ db, client }) => {
      return mm.status(db).then(status => {
        const pending = status.filter(s => s.appliedAt === 'PENDING');
        console.log(`Previously applied migrations: ${status.length - pending.length}`);
        if (pending.length) {
          console.log('Pending migrations:');
          pending.forEach(({ fileName }) => console.log(`  - ${fileName}`));
          console.log('Applying pending migrations...');
        } else {
          console.log('Pending migrations: 0');
        }
        return { db, client };
      });
    })
    .then(({ db, client }) => {
      return mm.up(db, client);
    })
    .then(migrated => {
      migrated.forEach(fileName => console.log('Migrated:', fileName));
      if (migrated.length) {
        console.log(`Newly applied migrations: ${migrated.length}`);
      }
    });
};
