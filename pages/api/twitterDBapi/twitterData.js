import connection from '../../../db/connection.js';
import twitterDB from '../../../db/twitterDB.js';
import NodeGeocoder from 'node-geocoder';

export default async function (req, res) {
  let geocodeTransform = req.query.transform == 'true';

  const db = await twitterDB(connection);
  let twitterData = await db.list({ include_docs: true });
  twitterData = twitterData.rows;
  //transform geodata into
  if (geocodeTransform) {
    let geocoder = NodeGeocoder({ provider: 'openstreetmap' });
    for (let i = 0; i < twitterData.length; i++) {
      let doc = twitterData[i].doc;
      let promises = [];
      if (doc.coordinates != null) {
        continue;
      } else if (doc.geo != null) {
        doc.coordinates = {
          type: 'Point',
          coordinates: [doc.geo.coordinates[1], doc.geo.coordinates[0]],
        };
      } else {
        let geocodePromise = geocode(geocoder, doc);
        promises.push(geocodePromise);
      }
      await Promise.all(promises);
    }
  }

  res.status(200).json(twitterData);
}

async function geocode(geocoder, doc) {
  let placename =
    doc.place != null
      ? doc.place.full_name
      : doc.user != null && doc.user.location != null
      ? doc.user.location
      : '';
  if (placename.length <= 0) return;

  let result;
  try {
    result = await geocoder.geocode({q: placename, limit: 1, addressdetails: 1, countrycodes:['AU']}); //limit it to Australia only
  } catch (e) {
    result = null;
  }
  if (result != null && result.length > 0) {
    //console.log(result[0]);
    doc.coordinates = {
      type: 'Point',
      coordinates: [result[0].longitude, result[0].latitude],
    };
  }
}
