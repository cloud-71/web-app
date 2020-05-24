import domesticAbuseDB from '../../../db/domesticAbuseDB.js';
import connection from '../../../db/connection.js';

export default async function(req, res){
  const db = await domesticAbuseDB(connection);
  let mapCoordinateData = await db.view('views', 'map-coordinate-view');
  mapCoordinateData = mapCoordinateData.rows[0].value;

  return res.status(200).json(mapCoordinateData);
}
