import graphDB, { connection } from '../../db/graphdb.js';

export default async function (req, res) {
  const db = await graphDB(connection);

  if (req.method == 'GET') {
    const graphs = await db.list();
    console.log(graphs);
    const result = graphs.rows;
    res.status(200).json(result);
  } else if (req.method == 'POST') {
    const graphData = req.body;
    const result = await db.insert({ graphData });
    res.status(200).json(result.id);
  }
}
