import DomesticAbuseMap from '../components/domesticAbuseMap.js';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: {},
      domVioData: {},
      twitterData: [],
      loading: false,
    };
    this.mapRef = React.createRef();
    this.graphRef = React.createRef();
  }

  async componentDidMount() {
    //fetch AURIN data
    this.fetchAurinData();
    this.fetchTweetData();
  }

  async fetchAurinData() {
    //define an async function to fetch domestic violence data
    let fetchDomVioData = async function(){
      let domVioData = await fetch('/api/domesticViolence/year-location-view');
      domVioData = await domVioData.json();
      this.setState({ domVioData });
    }.bind(this)

    //define an async function to fetch map data
    let fetchMapData = async function(){
      //use promises instead of async/await for concurrent fetching
      let geoPromise = fetch('/api/domesticViolence/mapGeometry').then(geodata => geodata.json());
      let coordPromise = fetch('/api/domesticViolence/mapCoordinate').then(coordata => coordata.json());
      //set state when both fetching are complete
      Promise.all([geoPromise, coordPromise])
            .then(([geometryData, mapCoordinateData]) => this.setState({mapData: {geometryData, mapCoordinateData}}));
    }.bind(this);

    this.setState({ loading: true });
    //run the fetching async functions, then when they're all completed set loading to false
    Promise.all([fetchDomVioData(), fetchMapData()])
        .then(() => this.setState({loading: false}));

    //old fetching
    /*let data = await fetch('/api/domesticViolence');
    data = await data.json();
    this.setState({ ...data });
    this.setState({ loading: false });*/
  }

  async fetchTweetData() {
    this.setState({ loading: true });
    let twitterData = await fetch('/api/twitterDBapi');
    console.log(twitterData);
    twitterData = await twitterData.json();
    this.setState({ twitterData });
    this.setState({ loading: false });
  }

  scrollTo(element) {
    let ref = element == 'map' ? this.mapRef : this.graphRef;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  render() {
    return (
      <>
        <Navbar sticky="top" variant="dark" bg="dark">
          <Navbar.Brand>Group 71</Navbar.Brand>
          <Nav.Link href="#" onSelect={() => this.scrollTo('map')}>
            Map
          </Nav.Link>
          <Nav.Link href="#" onSelect={() => this.scrollTo('graph')}>
            Graphs
          </Nav.Link>
        </Navbar>
        <Container fluid>
          <Row ref={this.mapRef}>
            <Col>
                <h3>Map</h3>
                <DomesticAbuseMap
                  height={'500px'}
                  loading={this.state.loading}
                  domVioData={this.state.domVioData}
                  geometryData={this.state.mapData.geometryData}
                  mapCoordinateData={this.state.mapData.mapCoordinateData}
                  twitterData={this.state.twitterData}
                />
            </Col>
          </Row>
          <Row ref={this.graphRef}>
            <Col>
              <h3>Graphs</h3>
              <div style={{ height: '1000px' }}></div>
            </Col>
          </Row>
        </Container>
      </>
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
