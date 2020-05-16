import graphDB from '../../../db/graphdb.js';
import connection from '../../../db/connection.js';

export default async function (req, res) {
  const db = await graphDB(connection);
  const graphId = req.query.graphid;
  const result = await db.get(graphId);
  res.status(200).json(result);
}
