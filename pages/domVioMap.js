//import HelloButton from '../components/helloButton.js';
//import GraphButton from '../components/graphButton.js';
//import TestGraph from '../components/testGraph.js';
//import connection from '../db/connection.js';
//import domesticAbuseDB from '../db/domesticAbuseDB.js';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {displayYear: "2015", domVioData: []};
  }

  async componentDidMount(){
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

  locationCenter(domVioData){
    if (domVioData == null || domVioData.length == 0)
      return {};

    let locations = domVioData.map(d => d.doc.properties).map(p => ({
                          name: p.lga_name11,
                          center: [(p.bbox[0] + p.bbox[2]/2), (p.bbox[1] + p.bbox[3]/2)]
                        }));
    return locations;
  }


  render() {
    let data = this.incidentsYearLocation(this.state.domVioData);
    let displayData = data[this.state.displayYear];
    let yearButtons = ["2015", "2016", "2017"].map(year => <input type="button" value={year} onClick={ ()=> this.setState({displayYear: year})} />)
    let locations = this.locationCenter(this.state.domVioData);
    //let xx = this.state.domVioData.length > 0 ? this.state.domVioData[0].doc.properties: "";
    //console.log(xx);
    return <div>
      <div>
        {yearButtons}
      </div>
      {JSON.stringify(displayData)}
      {JSON.stringify(locations)}
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
