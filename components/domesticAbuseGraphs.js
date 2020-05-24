import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import DomesticAbuseGraph from './DomesticAbuseGraph';

export default class DomesticAbuseGraphs extends React.Component {
  constructor(props){
    //props: domVioData, loading
    super(props);
    this.state = {}
  }

  graphs(){
    let data = this.props.domVioData;
    if (data == null)
      return;

    let cols = Object.keys(data).map(locationName => {
      return <Col lg={4} md={3} sm={2} xs={1}>
          <Card.Title>{locationName}</Card.Title>
          <DomesticAbuseGraph data={data[locationName]} />
        </Col>
    })
    return cols;
  }

  render(){
    let graphs = this.graphs();

    return (<>
      <Row>
        <Navbar sticky="top">
          <Navbar.Text>Graphs</Navbar.Text>
        </Navbar>
      </Row>
      <Row>
        {!this.props.loading ?
          graphs:
          ""}
      </Row>
    </>)
  }
}
