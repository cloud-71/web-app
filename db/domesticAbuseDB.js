import connection from './connection.js';

async function graphDB(connection) {
  try {
    await connection.db.create('domestic_violence_vic');
    return connection.use('domestic_violence_vic');
  } catch {
    return connection.use('domestic_violence_vic');
  }
}

export default graphDB;
