import connection from './connection.js';

async function twitterDB(connection) {
  try {
    await connection.db.create('twitter_test');
    return connection.use('twitter_test');
  } catch {
    return connection.use('twitter_test');
  }
}

export default twitterDB;
