let ReactLeaflet, TileLayer, Map, Circle, Rectangle, Tooltip, GeoJSON;
import ColorInterpolate from 'color-interpolate';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayYear: '2015-2016',
      domVioData: [],
      geometryData: [],
      mapCoordinateData: {}
    };
  }

  async componentDidMount() {
    //you can't use import with ReactLeaflet because leaflet needs to be instantiated on client
    //while nextjs compiles the modules on server
    //This is a workaround
    ReactLeaflet = await require('react-leaflet');
    Map = await ReactLeaflet.Map;
    TileLayer = await ReactLeaflet.TileLayer;
    Circle = await ReactLeaflet.Circle;
    Rectangle = await ReactLeaflet.Rectangle;
    Tooltip = await ReactLeaflet.Tooltip;
    GeoJSON = await ReactLeaflet.GeoJSON;
    this.forceUpdate();

    //fetch AURIN data
    this.fetchAurinData();
  }

  async fetchAurinData(){
    let data = await fetch('/api/domesticViolence');
    data = await data.json();
    this.setState({...data});
  }

  render() {
    let data = this.state.domVioData;//this.incidentsYearLocation(this.state.domVioData);
    let geoJSONData = this.state.geometryData;//this.GeoJSONData(this.state.domVioData);
    let incidentsPerLocation = (data && data[this.state.displayYear]) || {};
    let yearButtons = ['2015-2016', '2016-2017', '2017-2018'].map((year) => (
      <input
        type="button"
        value={year}
        onClick={() => this.setState({ displayYear: year })}
      />
    ));
    let mapCoordinates = this.state.mapCoordinateData;//this.mapCoordinates(this.state.domVioData);

    //uses color as marks. Blue = low # of violence, red = high.
    let palette = ColorInterpolate(['blue', 'yellow', 'red', 'maroon']);

    let geoJSONMarkers = Object.keys(incidentsPerLocation).map(
      (locationName) => (
        //Spectrum is hard coded, had something to find maximum
        <GeoJSON
          data={geoJSONData[locationName]}
          color={
            incidentsPerLocation[locationName] < 4000
              ? palette(incidentsPerLocation[locationName] / 4000)
              : '#000000'
          }
          weight={1.5}
          opacity={0.75}
        >
          <Tooltip>
            {locationName}: {incidentsPerLocation[locationName]}
          </Tooltip>
        </GeoJSON>
      ),
    );
    return (
      <div>
        <div>
          {yearButtons}
        </div>
        {Map ? (
          <Map
            maxBounds={mapCoordinates.boundary}
            center={mapCoordinates.center}
            zoom={7}
            style={{ height: '500px' }}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoJSONMarkers}
          </Map>
        ) : (
          JSON.stringify(incidentsPerLocation)
        )}
      </div>
    );
  }
}

//I can't get server-side rendering to work, so for now I'm using client-side data fetching.
/*export async function getStaticProps(){
  console.log("hi")
  let domViodata = await fetch("/api/domesticViolence");
  domViodata = await domViodata.json();
  console.log(domVioData);

  return {
    props: {
      domVioData
    }
  }
}*/
