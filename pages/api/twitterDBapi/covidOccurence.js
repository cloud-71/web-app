import connection from '../../../db/connection.js';
import twitterDB from '../../../db/twitterDB.js';

export default async function (req, res) {
  const db = await twitterDB(connection);
  let covidOccurance = await db.view('views', 'covid_occurance', {
    group_level: 1,
  });
  covidOccurance = covidOccurance.rows;
  res.status(200).json(covidOccurance);
}
