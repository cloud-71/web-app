let ReactLeaflet, TileLayer, Map, Tooltip, GeoJSON;
import ColorInterpolate from 'color-interpolate';

export default class DomesticAbuseMap extends React.Component {
  constructor(props) {
    //props: domVioData, geometryData, mapCoordinateData
    super(props);
    this.state = {displayYear: '2015-2016'}
  }

  async componentDidMount() {
    //you can't use import with ReactLeaflet because leaflet needs to be instantiated on client
    //while nextjs compiles the modules on server
    //This is a workaround
    ReactLeaflet = await require('react-leaflet');
    Map = await ReactLeaflet.Map;
    TileLayer = await ReactLeaflet.TileLayer;
    Tooltip = await ReactLeaflet.Tooltip;
    GeoJSON = await ReactLeaflet.GeoJSON;
    this.forceUpdate();
  }

  yearButton(year){
    return  <input
        type="button"
        value={year}
        onClick={() => this.setState({ displayYear: year })}
      />
  }

  geoJSONMarkers(){
    if (!this.props.domVioData || !this.props.geometryData)
      return;

    let data = this.props.domVioData;
    let geoJSONData = this.props.geometryData;
    let incidentsPerLocation = (data && data[this.state.displayYear]) || {};
    //uses color as marks. Blue = low # of violence, red = high.
    let palette = ColorInterpolate(['blue', 'yellow', 'red', 'maroon']);

    return Object.keys(incidentsPerLocation).map(
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
  }

  render() {
    let yearButtons = ['2015-2016', '2016-2017', '2017-2018'].map(this.yearButton);
    let mapCoordinates = this.props.mapCoordinateData || {};
    let geoJSONMarkers = this.geoJSONMarkers();

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
          "Now Loading"
        )}
      </div>
    );
  }
}
