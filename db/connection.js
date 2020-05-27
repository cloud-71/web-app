import Nano from 'nano';

const connection = (function connect() {
  const host = process.env['COUCHDB_HOST'] || 'localhost:5984';
  const username = process.env['COUCHDB_USERNAME'] || 'admin';
  const password = process.env['COUCHDB_PASSWORD'] || 'admin';

  console.log(
    `Connecting to CouchDB ${host}, username: ${username}, password ${password}`,
  );
  return Nano(`http://${username}:${password}@${host}`);
})();

export default connection;
