import connection from '../../db/connection.js';
import domesticAbuseDB from '../../db/domesticAbuseDB.js';

export default async function(req, res){
  const db = await domesticAbuseDB(connection);
  let domVioData = await db.list({include_docs: true});
  const result = domVioData.rows;
  res.status(200).json(result);
}
