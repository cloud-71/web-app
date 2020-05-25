import connection from '../../db/connection.js';
import twitterDB from '../../db/twitterDB.js';

/*export default async function (req, res) {
  const db = await twitterDB(connection);
  let twitterData = await db.list({ include_docs: true });
  const result = twitterData.rows;
  res.status(200).json(result);
}*/

export default async function (req, res) {
  const db = await twitterDB(connection);
  let wordCount = await db.view('views', 'sum_words', { group_level: 1 });
  wordCount = wordCount.rows;

  let twitterData = await db.list({ include_docs: true });
  twitterData = twitterData.rows;

  const result = { twitterData, wordCount };
  res.status(200).json(result);
}
