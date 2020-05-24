import domesticAbuseDB from '../../../db/domesticAbuseDB.js';
import connection from '../../../db/connection.js';

export default async function (req, res) {
  const db = await domesticAbuseDB(connection);
  let geometryD = await db.view('views', 'geometry-view');

  //turn from   [{'key': k1, 'value': v1}, {'key': k2, 'value': v2}]
  //into          {k1: v1, k2: v2}
  let geometryData = {};
  geometryD.rows.forEach((d) => (geometryData[d.key] = d.value));

  return res.status(200).json(geometryData);
}
