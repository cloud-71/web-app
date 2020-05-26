import connection from '../../../db/connection.js';
import twitterDB from '../../../db/twitterDB.js';

export default async function (req, res) {
  const db = await twitterDB(connection);
  let wordCount = await db.view('views', 'sum_words', { group_level: 1 });
  wordCount = wordCount.rows;

  res.status(200).json(wordCount);
}
