import connection from '../../../db/connection.js';
import twitterDB from '../../../db/twitterDB.js';
import NodeGeocoder from 'node-geocoder';

export default async function (req, res) {
  //let geocodeTransform = req.query.transform == 'true';
  let {withCoordinatesOnly, skip, limit} = req.query;
  withCoordinatesOnly = withCoordinatesOnly == 'true';

  const db = await twitterDB(connection);
  let options = {
    include_docs: true,
  }
  if (skip != null && limit != null)
    Object.assign(options, {limit, skip});
  if (withCoordinatesOnly){
    Object.assign(options, {
      startkey: ['coordinates'],
      endkey: ['coordinates', {}]
    })
  }

  let twitterData = await db.view('views', 'group_by_location', options);
  twitterData = twitterData.rows;
  //transform geodata into
  if (!withCoordinatesOnly) {
    let geocoder = NodeGeocoder({ provider: 'openstreetmap' });
    let promises = [];

    for (let data of twitterData.filter(d => d.key[0] == 'place_name')) {
      await geocode(geocoder, data, db);
    };
  }

  res.status(200).json(twitterData);
}

async function geocode(geocoder, doc, db) {
  let placename = doc.key[1];
  if (placename.length <= 0) return;

  try {
     //find from cache
    let cacheResult = await db.get(placename);
    if (cacheResult.coordinates == null) return;  //null coordinates mean it couldn't be geocoded

    doc.key = ['coordinates', cacheResult.coordinates];
  } catch (e){
    //use geocoder
    let result;
    try {
      result = await geocoder.geocode({q: placename, limit: 1, addressdetails: 1, countrycodes:['AU']}); //limit it to Australia only
    } catch (e) {
      console.log(e);
      result = null;
    }
    if (result != null && result.length > 0) {
      let coordinates = [result[0].longitude, result[0].latitude]
      db.insert({_id: placename, coordinates, type:'placename_cache'}); //insert into cache
      doc.key = ['coordinates', coordinates]
    } else if (result.length == 0){
       //insert into cache to determine it couldn't be found before
      db.insert({_id: placename, coordinates: null, type:'placename_cache'});
    }
  }

}
