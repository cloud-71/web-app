import connection from '../../../db/connection.js';
import domesticAbuseDB from '../../../db/domesticAbuseDB.js';

export default async function(req, res){
  const db = await domesticAbuseDB(connection);

  let domVioD = await db.view('views', 'year-location-view');
  let domVioData = {};
  domVioD.rows.forEach(d => {
    if (domVioData[d.key[0]] == null)
      domVioData[d.key[0]] = {};
    domVioData[d.key[0]][d.key[1]] = d.value;
  })
  //^ turn from   [{'key': [k11, k21], 'value': v1}, {'key': [k11, k22], 'value': v2}]
  //into          {k11: {k21: v1, k22: v2}}

  let geometryD = await db.view('views', 'geometry-view');
  let geometryData = {}
  geometryD.rows.forEach(d => geometryData[d.key] = d.value);
  //^ turn from   [{'key': k1, 'value': v1}, {'key': k2, 'value': v2}]
  //into          {k1: v1, k2: v2}

  let mapCoordinateData = await db.view('views', 'map-coordinate-view');
  mapCoordinateData = mapCoordinateData.rows[0].value;

  const result = {domVioData, mapData: {geometryData, mapCoordinateData}};
  res.status(200).json(result);
}
