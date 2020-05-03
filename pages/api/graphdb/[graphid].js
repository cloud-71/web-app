import graphDB from '../../../db/graphdb.js'

export default async function(req, res){
  let graphId = req.query.graphid;
  let result = await graphDB.get(graphId);
  res.status(200).json(result);
}
