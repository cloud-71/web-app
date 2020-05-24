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
      data: {},
      twitterData: [],
      loading: false,
    };
    this.mapRef = React.createRef();
    this.graphRef = React.createRef();
    this.cloudRef = React.createRef();
  }

  async componentDidMount() {
    //fetch AURIN data
    this.fetchAurinData();
    this.fetchTweetData();
  }

  async fetchAurinData() {
    this.setState({ loading: true });
    let data = await fetch('/api/domesticViolence');
    data = await data.json();
    this.setState({ data });
    this.setState({ loading: false });
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
    let ref = this.mapRef;
    if (element == 'graph') ref = this.graphRef;
    if (element == 'word-cloud') ref = this.cloudRef;
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
          <Nav.Link href="#" onSelect={() => this.scrollTo('word-cloud')}>
            Word Cloud
          </Nav.Link>
        </Navbar>
        <Container fluid>
          <Row ref={this.mapRef}>
            <Col>
              <h3>Map</h3>
              <DomesticAbuseMap
                height={'500px'}
                loading={this.state.loading}
                domVioData={this.state.data.domVioData}
                geometryData={this.state.data.geometryData}
                mapCoordinateData={this.state.data.mapCoordinateData}
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
          <Row ref={this.cloudRef}>
            <Col>
              <h3>Word Cloud</h3>
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
