let ReactLeaflet, TileLayer, Map, Tooltip, GeoJSON, Control, Marker, Popup;
let L;
import ColorInterpolate from 'color-interpolate';
import Card from 'react-bootstrap/Card';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';

export default class DomesticAbuseMap extends React.Component {
  constructor(props) {
    //props: domVioData, geometryData, mapCoordinateData, tweetData, loading, tweetLoading, height, onRequestMoreTweets
    super(props);
    this.state = { displayYear: '2015-2016', redIcon:null};
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
    Marker = await ReactLeaflet.Marker;
    Popup = await ReactLeaflet.Popup;
    //marker icons don't show up unless you do this
    L = await require('leaflet');
    L.Icon.Default.imagePath = 'images/';

    let redIcon = Object.assign({}, L.Icon.Default.prototype.options);
    redIcon.iconUrl = 'images/marker-icon-red.png';
    redIcon.shadowUrl = "images/" + redIcon.shadowUrl;
    redIcon.iconRetinaUrl = null;
    redIcon.shadowRetinaUrl = null;
    this.setState({
      redIcon: L.icon(redIcon)
    })
    this.forceUpdate();
  }

  yearButtons(years) {
    let buttons = years.map((year) => (
      <ToggleButton
        variant="outline-secondary"
        size="sm"
        value={year}
        key={year}
      >
        {year}
      </ToggleButton>
    ));

    return (
      <ToggleButtonGroup
        className="float-right"
        type="radio"
        name="displayYear"
        value={this.state.displayYear}
        onChange={(value) => this.setState({ displayYear: value })}
      >
        {buttons}
      </ToggleButtonGroup>
    );
  }

  mapHeader() {
    let yearButtons = this.yearButtons(['2015-2016', '2016-2017', '2017-2018']);
    return Control ? (
      <Control position="topright">
        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <Card.Title className="float-right">
              Rates of Domestic Violence in Victoria for Every 100,000
              Population
            </Card.Title>
            {yearButtons}
            <Button variant="outline-secondary" size="sm"
              disabled={this.props.tweetLoading}
              onClick={this.props.onRequestMoreTweets}>
                More Tweets
            </Button>
          </Card.Body>
        </Card>
      </Control>
    ) : (
      <div />
    );
  }

  tweetLocations(twitterData) {
    let obj = {
      coordinates: {},
      tweet: {},
      user: {},
    };
    twitterData.filter(d => d.key[0] == 'coordinates')
      .forEach(d => {
        obj['coordinates'][d.value.id] = [
          d.key[1][1],
          d.key[1][0],
        ];
        obj['tweet'][d.value.id] = d.value.full_text; //d.extended_tweet.full_text;
        obj['user'][d.value.id] = d.value.user_name;
      })
    return obj;
  }

  twitterMarkers() {
    if (!this.props.twitterData) return;

    let twitterData = this.tweetLocations(this.props.twitterData);
    let containsCovid = function(words){
      return words.toLowerCase().includes("covid") ||
             words.toLowerCase().includes("corona virus") ||
             words.toLowerCase().includes("coronavirus");
    }

    return Object.keys(twitterData['coordinates']).map((tweet) => (
      containsCovid(twitterData['tweet'][tweet]) ?
        <Marker
          icon={this.state.redIcon}
          draggable={false}
          position={twitterData['coordinates'][tweet]}
          key={tweet}
        >
          <Popup>
            @{twitterData['user'][tweet]}
            <br />
            {twitterData['tweet'][tweet]}
          </Popup>
        </Marker>
        :
        <Marker
          draggable={false}
          position={twitterData['coordinates'][tweet]}
          key={tweet}
        >
          <Popup>
            @{twitterData['user'][tweet]}
            <br />
            {twitterData['tweet'][tweet]}
          </Popup>
        </Marker>
    ));
  }

  geoJSONMarkers() {
    if (!this.props.domVioData || !this.props.geometryData) return;

    let data = this.props.domVioData;
    let geoJSONData = this.props.geometryData;
    let incidentsPerLocation = (data && data[this.state.displayYear]) || {};
    //uses color as marks. Blue = low # of violence, red = high.
    let palette = ColorInterpolate(['blue', 'yellow', 'red', 'maroon']);

    return Object.keys(incidentsPerLocation).map((locationName) => (
      //Spectrum is hard coded, had something to find maximum
      <GeoJSON
        key={locationName}
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
    ));
  }

  mapComponent() {
    let header = this.mapHeader();
    let mapCoordinates = this.props.mapCoordinateData || {};
    let geoJSONMarkers = this.geoJSONMarkers();
    let tweetMarkers = this.twitterMarkers();

    return (
      <Map
        maxBounds={mapCoordinates.boundary}
        center={mapCoordinates.center}
        zoom={7}
        style={{ height: this.props.height }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {header}
        {geoJSONMarkers}
        {tweetMarkers}
      </Map>
    );
  }

  loadingComponent() {
    return (
      <Jumbotron fluid style={{ height: this.props.height }}>
        <Spinner
          animation="border"
          variant="dark"
          style={{ top: '50%', right: '50%', position: 'absolute' }}
        />
      </Jumbotron>
    );
  }

  render() {
    return (
      <div>
        {Map && !this.props.loading
          ? this.mapComponent()
          : this.loadingComponent()}
      </div>
    );
  }
}
