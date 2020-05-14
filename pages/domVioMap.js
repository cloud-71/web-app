let ReactLeaflet, TileLayer, Map, Circle, Rectangle, Tooltip;
import ColorInterpolate from 'color-interpolate';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayYear: "2015", domVioData: [], useCircle: true};
  }

  async componentDidMount(){
    ReactLeaflet = await require('react-leaflet');
    Map = await ReactLeaflet.Map;
    TileLayer = await ReactLeaflet.TileLayer;
    Circle = await ReactLeaflet.Circle;
    Rectangle = await ReactLeaflet.Rectangle;
    Tooltip = await ReactLeaflet.Tooltip;
    this.forceUpdate();
    //Map = ReactLeaflet.Map;
    //Circle = ReactLeaflet.Circle

    let domVioData = await fetch("/api/domesticViolence");
    domVioData = await domVioData.json();
    console.log(domVioData);
    this.setState({domVioData})
  }

  incidentsYearLocation(domVioData){
    if (domVioData == null || domVioData.length == 0)
      return {}

    let obj = {
      "2015": {},
      "2016": {},
      "2017": {}
    };
    domVioData.map(d => d.doc.properties).forEach(d => {
      obj["2015"][d.lga_name11] = d.number_family_incidents_2015_16;
      obj["2016"][d.lga_name11] = d.number_family_incidents_2016_17;
      obj["2017"][d.lga_name11] = d.number_family_incidents_2017_18;
    });
    return obj;
  }

  locations(domVioData){
    if (domVioData == null || domVioData.length == 0)
      return {};

    let obj = {}
    domVioData.map(d => d.doc.properties).forEach(p =>
      obj[p.lga_name11]= {
        center: [(p.bbox[1] + p.bbox[3])/2, (p.bbox[0] + p.bbox[2])/2],
        boundary: [[p.bbox[1], p.bbox[0]], [p.bbox[3], p.bbox[2]]],
        apprRadius: (Math.abs(p.bbox[0]-p.bbox[2]) + Math.abs(p.bbox[1]-p.bbox[3]))/2
      }
    );
    return obj;
  }

  mapCoordinates(domVioData){
    if (domVioData == null || domVioData.length == 0)
      return {};

    let maxX = -9999999999999;
    let maxY = -9999999999999;
    let minX = 9999999999999;
    let minY = 9999999999999;
    domVioData.map(d => d.doc.properties).forEach(p =>{
      minX = Math.min(minX, p.bbox[0]);
      minY = Math.min(minY, p.bbox[1]);
      maxX = Math.max(maxX, p.bbox[2]);
      maxY = Math.max(maxY, p.bbox[3]);
      console.log(maxX + "," + maxY + "," + minX + "," + minY)
    });
    let obj = {
      boundary: [[minY, minX], [maxY, maxX]],
      center: [(minY + maxY)/2, (minX + maxX)/2]
    };
    return obj;
  }


  render() {
    let data = this.incidentsYearLocation(this.state.domVioData);
    let incidentsPerLocation = data && data[this.state.displayYear] || {};
    let yearButtons = ["2015", "2016", "2017"].map(year => <input type="button" value={year} onClick={ ()=> this.setState({displayYear: year})} />)
    let locationCenters = this.locations(this.state.domVioData) ;
    let mapCoordinates = this.mapCoordinates(this.state.domVioData)
    //let xx = this.state.domVioData.length > 0 ? this.state.domVioData[0].doc.properties: "";
    //console.log(xx);
    let palette = ColorInterpolate(['blue', 'yellow', 'red']);
    let circleMarkers = Object.keys(incidentsPerLocation).map(locationName =>
      <Circle
        center={locationCenters[locationName].center}
        radius={locationCenters[locationName].apprRadius*40000}
        color={incidentsPerLocation[locationName] < 5000? palette(incidentsPerLocation[locationName]/5000) : "#000000"}
        weight={1} opacity={0.5}>
        <Tooltip>{locationName}: {incidentsPerLocation[locationName]}</Tooltip>
      </Circle>
    )
    let rectMarkers = Object.keys(incidentsPerLocation).map(locationName =>
      <Rectangle
        bounds={locationCenters[locationName].boundary}
        color={incidentsPerLocation[locationName] < 5000? palette(incidentsPerLocation[locationName]/5000) : "#000000"}
        weight={1} opacity={0.5}>
        <Tooltip>{locationName}: {incidentsPerLocation[locationName]}</Tooltip>
      </Rectangle>
    )
    return <div>
      <div>
        {yearButtons}
        <input type="button" value={this.state.useCircle?"Circle":"Rectangles"} onClick={() => this.setState((state) => ({useCircle: !state.useCircle}))} />
      </div>
      {(Map) ?
        <Map maxBounds={mapCoordinates.boundary} center={mapCoordinates.center} zoom={7} style={{height:"500px"}}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.useCircle? circleMarkers: rectMarkers}
        </Map>
        /*<Map center={[51.505, -0.09]} zoom={13} style={{height:"500px"}}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle center={[51.505, -0.09]} fillColor="blue" radius={200} />
        </Map>*/
        :
        JSON.stringify(incidentsPerLocation)
      }
    </div>
  }
}

//I can't get this to work
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
