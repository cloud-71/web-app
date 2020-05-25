import connection from './connection.js';

async function domesticAbuseDB(connection) {
  console.log(process.env['COUCHDB_DATABASE_AURIN']);
  const database_name =
    process.env['COUCHDB_DATABASE_AURIN'] || 'domestic_violence_vic';
  try {
    await connection.db.create(database_name);
    return connection.use(database_name);
  } catch {
    return connection.use(database_name);
  }
}

export default domesticAbuseDB;
