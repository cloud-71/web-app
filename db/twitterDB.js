import connection from './connection.js';

async function twitterDB(connection) {
  const database_name =
    process.env['COUCHDB_DATABASE_TWITTER'] || 'twitter_test';
  try {
    await connection.db.create(database_name);
    return connection.use(database_name);
  } catch {
    return connection.use(database_name);
  }
}

export default twitterDB;
