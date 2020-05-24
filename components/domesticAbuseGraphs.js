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

    let cards = Object.keys(data).map(locationName => {
      return <Card key={locationName}>
        <Card.Body>
          <Card.Title>{locationName}</Card.Title>
          <DomesticAbuseGraph data={data[locationName]} />
        </Card.Body>
      </Card>
    })

    let cardGroups = [];
    for (let i = 0; i < cards.length; i+=3){
      let includedCards = cards.slice(i, i+3);
      let cardGroup = <CardGroup>{includedCards}</CardGroup>
      cardGroups.push(cardGroup);
    }
    return cardGroups;
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
