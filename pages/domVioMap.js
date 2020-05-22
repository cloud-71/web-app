let ReactLeaflet, TileLayer, Map, Tooltip, GeoJSON;
import ColorInterpolate from 'color-interpolate';
import DomesticAbuseMap from '../components/domesticAbuseMap.js';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  async componentDidMount() {
    //fetch AURIN data
    this.fetchAurinData();
  }

  async fetchAurinData(){
    this.setState({loading:true});
    let data = await fetch('/api/domesticViolence');
    data = await data.json();
    this.setState({data});
    this.setState({loading:false});
  }

  render() {
    return this.state.loading || !this.state.data ?
      "Now Loading" :
      <DomesticAbuseMap
        domVioData={this.state.data.domVioData}
        geometryData={this.state.data.geometryData}
        mapCoordinateData={this.state.data.mapCoordinateData}
        />
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
