import Nano from 'nano';

async function graphDB(connection) {
  try {
    await connection.db.create('graph');
    return connection.use('graph');
  } catch {
    return connection.use('graph');
  }
}

const connection = (function connect() {
  const host = process.env['COUCHDB_HOST'] || 'localhost:5984';
  const username = process.env['COUCHDB_USERNAME'] || 'admin';
  const password = process.env['COUCHDB_PASSWORD'] || 'admin';
  return Nano(`http://${username}:${password}@${host}`);
})()

export { connection };
export default graphDB;
