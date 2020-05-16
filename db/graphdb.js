import connection from './connection.js';

async function graphDB(connection) {
  try {
    await connection.db.create('graph');
    return connection.use('graph');
  } catch {
    return connection.use('graph');
  }
}

export default graphDB;
