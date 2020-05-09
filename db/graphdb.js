import * as Nano from 'nano';

function graphDB() {
  let n = Nano(
    process.env['COUCHDB_URL'] || 'http://admin:admin@localhost:5984',
  ); //https://username:password@url

  let graphDB = n.db.use('graphs');
  if (graphDB == null) {
    //graphDB = await n.db.create("graphs");
    //graphDB = n.db.use("graphs");
  }
  //console.log(graphDB);
  return graphDB;
}

export default graphDB();
