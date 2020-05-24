import domesticAbuseDB from '../../../db/domesticAbuseDB.js';
import connection from '../../../db/connection.js';

export default async function (req, res) {
  const db = await domesticAbuseDB(connection);
  let { view_name, key } = req.query;

  let param = key ? { startkey: [key], endkey: [key, {}] } : null;
  let domVioD = await db.view('views', view_name, param);

  //turn from   [{'key': [k11, k21], 'value': v1}, {'key': [k11, k22], 'value': v2}]
  //into        {k11: {k21: v1, k22: v2}}
  let domVioData = {};
  domVioD.rows.forEach((d) => {
    let year = d.key[0];
    let location = d.key[1];
    if (domVioData[d.key[0]] == null) domVioData[d.key[0]] = {};
    domVioData[d.key[0]][d.key[1]] = d.value;
  });

  return res.status(200).json(domVioData);
}
