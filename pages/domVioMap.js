import DomesticAbuseMap from '../components/domesticAbuseMap.js';
import WordCloud from '../components/word-cloud';
import DomesticAbuseGraphs from '../components/domesticAbuseGraphs.js';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import pointInPolygon from 'point-in-polygon';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: {},
      domVioData: {},
      twitterData: [],
      twitterDataFetchLimit: 5,
      twitterDataSkip: 0,
      wordCount: null,
      covidOccurence: null,
      loading: false,
    };
    this.mapRef = React.createRef();
    this.graphRef = React.createRef();
    this.cloudRef = React.createRef();
    this.homeRef = React.createRef();
    this.onRequestMoreTweets = this.onRequestMoreTweets.bind(this);
  }

  async componentDidMount() {
    //fetch AURIN data
    this.fetchAurinData();
    this.fetchTweetData();
  }

  async fetchAurinData() {
    //define an async function to fetch domestic violence data
    let fetchDomVioData = async function () {
      let domVioData = await fetch('/api/domesticViolence/year-location-view');
      domVioData = await domVioData.json();
      this.setState({ domVioData });
    }.bind(this);
    //define an async function to fetch domestic violence data, this is for the graphs
    let fetchDomVioDataGraph = async function () {
      let domVioDataGraph = await fetch(
        '/api/domesticViolence/location-year-view',
      );
      domVioDataGraph = await domVioDataGraph.json();
      this.setState({ domVioDataGraph });
    }.bind(this);

    //define an async function to fetch map data
    let fetchMapData = async function () {
      //use promises instead of async/await for concurrent fetching
      let geoPromise = fetch(
        '/api/domesticViolence/mapGeometry',
      ).then((geodata) => geodata.json());
      let coordPromise = fetch(
        '/api/domesticViolence/mapCoordinate',
      ).then((coordata) => coordata.json());
      //set state when both fetching are complete
      Promise.all([
        geoPromise,
        coordPromise,
      ]).then(([geometryData, mapCoordinateData]) =>
        this.setState({ mapData: { geometryData, mapCoordinateData } }),
      );
    }.bind(this);

    this.setState({ loading: true });
    //run the fetching async functions, then when they're all completed set loading to false
    Promise.all([
      fetchDomVioData(),
      fetchDomVioDataGraph(),
      fetchMapData(),
    ]).then(() => this.setState({ loading: false }));

    //old fetching
    /*let data = await fetch('/api/domesticViolence');
    data = await data.json();
    this.setState({ ...data });
    this.setState({ loading: false });*/
  }

  async fetchTweetData() {
    //this.setState({ loading: true });

    //define an async function to fetch wordcloud data
    let fetchWordCountData = async function () {
      let wordCount = await fetch('/api/twitterDBapi/wordCount');
      wordCount = await wordCount.json();
      this.setState({ wordCount });
    }.bind(this);
    //define an async function to fetch wordcloud data
    let fetchCovidOccData = async function () {
      let covidOccurence = await fetch('/api/twitterDBapi/covidOccurence');
      covidOccurence = await covidOccurence.json();
      this.setState({ covidOccurence });
    }.bind(this);

    this.fetchTwitterData(true);
    fetchWordCountData();
    fetchCovidOccData();
    //this.setState({ loading: false });
  }

  //define an async function to fetch domestic violence data
  async fetchTwitterData(initial) {
    this.setState({tweetLoading: true});
    let limit = this.state.twitterDataFetchLimit;
    let skip = this.state.twitterDataSkip;
    let twitterData;
    let refetch;
    try {
      let optionString = initial ?
          ('withCoordinatesOnly='+initial ) :
          ('skip=' + skip + '&limit=' + limit + '&useGeocoding=true');
      twitterData = await fetch('/api/twitterDBapi/twitterData?' + optionString);
      if (twitterData.ok){
        twitterData =  await twitterData.json();
        refetch = initial || twitterData.length == limit;
      } else {
        twitterData = [];
        refetch = true;
      }
    } catch(e){
      twitterData = [];
      refetch = true;
    }
    let newSkip = initial ? 0 : skip + limit;
    this.setState(
      state => ({
        twitterDataSkip: newSkip,
        twitterData: state.twitterData.concat(twitterData),
        tweetLoading: false
      }),
      //after setting state is done, fetch again if there are more data
      () => {
        if (refetch){
          this.fetchTwitterData(false);
        }
      });
  };

  countOfTweetsPerArea(){
    let res = {};
    const geoData = this.state.mapData.geometryData;
    const tweets = this.state.twitterData;
    if (geoData == null || tweets == null) return;

    for (let locationName in geoData){
      res[locationName] = 0;
      //get the polygon that defines an area's boundaries
      const polygon = geoData[locationName].coordinates[0][0];
      for (let tweet of tweets.filter(t => t.key[0] == 'coordinates')){
        const point = tweet.key[1];
        //check if the tweet's location in inside the area
        if (point != null && pointInPolygon(point, polygon)){
          res[locationName] += 1;
        }
      }
    }
    return res;
  }

  scrollTo(element) {
    let refs = {
      map: this.mapRef,
      home: this.homeRef,
      graph: this.graphRef,
      cloud: this.cloudRef,
    };
    let ref = refs[element];
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  onRequestMoreTweets(){
    this.fetchTwitterData();
  }

  render() {
    //console.log('domVioData', this.state.domVioData);
    //console.log('geometryData', this.state.geometryData);
    //console.log('mapCoordinate', this.state.mapCoordinateData);
    //console.log('graphData', this.state.domVioDataGraph);
    let amount = 0;
    let total = 0;
    if (this.state.covidOccurence) {
      amount = this.state.covidOccurence.find(c => c.key == 'relevant').value;
      total = this.state.covidOccurence.find(c => c.key == 'total').value
    }
    let covid_ratio = amount + ' of ' + total + ' tweets mention Covid-19';
    if (total == 0) covid_ratio = '';
    //<h2>{this.state.twitterData.covidOccurance[0].value}</h2>
    return (
      <>
        <Navbar sticky="top" variant="dark" bg="dark">
          <Navbar.Brand>Group 71</Navbar.Brand>
          <Nav.Link href="#" onSelect={() => this.scrollTo('home')}>
            Home
          </Nav.Link>
          <Nav.Link href="#" onSelect={() => this.scrollTo('map')}>
            Map
          </Nav.Link>
          <Nav.Link href="#" onSelect={() => this.scrollTo('cloud')}>
            Word Cloud
          </Nav.Link>
          <Nav.Link href="#" onSelect={() => this.scrollTo('graph')}>
            Graphs
          </Nav.Link>
        </Navbar>
        <Container fluid>
          <Row ref={this.homeRef}>
            <Col>
              <Jumbotron>
                <h1>COMP90024 Cluster and Cloud Computing</h1>
                <p>Group 71</p>
                <p>
                  There have been concerns raised over the increased possibility
                  and severity for domestic violence, due to the increased time
                  spent with family members, economic stressors, lack of
                  ‘escape’ opportunities etc. As a result, we wished to
                  investigate rates of domestic violence and abuse in Australian
                  cities and compare this with public awareness to the issue.
                </p>

                <h2>{covid_ratio}</h2>
              </Jumbotron>
            </Col>
          </Row>
          <Row ref={this.mapRef}>
            <Col>
              <h3>Map</h3>
              <Navbar>
                <Navbar.Text>
                  Sourced from AURIN datasets in order to capture the historical
                  rates of known domestic violence cases.
                </Navbar.Text>
              </Navbar>
              <DomesticAbuseMap
                height={'500px'}
                loading={this.state.loading}
                tweetLoading={this.state.tweetLoading}
                twitterData={this.state.twitterData}
                domVioData={this.state.domVioData}
                geometryData={this.state.mapData.geometryData}
                mapCoordinateData={this.state.mapData.mapCoordinateData}
                onRequestMoreTweets={this.onRequestMoreTweets}
              />
            </Col>
          </Row>
          <Row ref={this.cloudRef}>
            <Col>
              <h3>Word Cloud</h3>
              <WordCloud data={this.state.wordCount} topK={60} />
              <br></br>
            </Col>
            <Col></Col>
          </Row>
          <Row ref={this.graphRef}>
            <Col>
              <h3>Graphs</h3>
              <DomesticAbuseGraphs
                domVioData={this.state.domVioDataGraph}
                countOfTweetsPerArea={this.countOfTweetsPerArea()}
                loading={this.state.loading}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
