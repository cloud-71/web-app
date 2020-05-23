import connection from '../../db/connection.js';
import twitterDB from '../../db/twitterDB.js';

export default async function (req, res) {
  const db = await twitterDB(connection);
  let twitterData = await db.list({ include_docs: true });
  const result = twitterData.rows;
  res.status(200).json(result);
}
