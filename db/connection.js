import Nano from 'nano';

const connection = (function connect() {
  const host = process.env['COUCHDB_HOST'] || 'localhost:5984';
  const username = process.env['COUCHDB_USERNAME'] || 'admin';
  const password = process.env['COUCHDB_PASSWORD'] || 'admin';
  return Nano(`http://${username}:${password}@${host}`);
})();

export default connection;
