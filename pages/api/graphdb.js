import graphDB from '../../db/graphdb.js';

export default async function (req, res) {
  //console.log(graphDB);
  if (req.method == 'GET') {
    let graphs = await graphDB.list();
    console.log(graphs);
    let result = graphs.rows;
    res.status(200).json(result);
  } else if (req.method == 'POST') {
    let graphData = req.body;
    let result = await graphDB.insert({ graphData });
    res.status(200).json(result.id);
  }
}
