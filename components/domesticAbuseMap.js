let ReactLeaflet, TileLayer, Map, Tooltip, GeoJSON, Control;
import ColorInterpolate from 'color-interpolate';
import Card from 'react-bootstrap/Card';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

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
    Control = await require('react-leaflet-control').default;
    ReactLeaflet = await require('react-leaflet');
    Map = await ReactLeaflet.Map;
    TileLayer = await ReactLeaflet.TileLayer;
    Tooltip = await ReactLeaflet.Tooltip;
    GeoJSON = await ReactLeaflet.GeoJSON;
    this.forceUpdate();
  }

  yearButtons(years){
    let buttons =  years.map(year =>
      <ToggleButton
        variant="outline-secondary"
        size="sm"
        value={year}>
        {year}
      </ToggleButton>);

    return <ToggleButtonGroup
              className="float-right"
              type="radio"
              name="displayYear"
              value={this.state.displayYear}
              onChange={(value) => this.setState({displayYear: value})}>
              {buttons}
            </ToggleButtonGroup>
  }

  mapHeader(){
    let yearButtons = this.yearButtons(['2015-2016', '2016-2017', '2017-2018']);
    return Control ?
    <Control position="topright">
      <Card style={{width: '25rem'}}>
        <Card.Body>
          <Card.Title className="float-right">Rates of Domestic Violence in Victoria for Every 100,000 Population</Card.Title>
          {yearButtons}
        </Card.Body>
      </Card>
    </Control>
    : <div/>
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
    let header = this.mapHeader();
    let mapCoordinates = this.props.mapCoordinateData || {};
    let geoJSONMarkers = this.geoJSONMarkers();

    return (
      <div>
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
            {header}
            {geoJSONMarkers}
          </Map>
        ) : (
          "Now Loading"
        )}
      </div>
    );
  }
}
