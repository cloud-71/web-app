import RandomGraphs from './randomgraphs.js';
import DomVioMap from './domVioMap.js';

export default class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {page: 'graphs'}
  }

  render(){
    let page = false;
    switch(this.state.page){
      case 'graphs': page = <RandomGraphs />; break;
      case 'domVioMap': page = <DomVioMap />; break;
    };
    return (<div>
      <input type="button" value="Graphs" onClick={() => this.setState({page: 'graphs'})} />
      <input type="button" value="Map" onClick={() => this.setState({page: 'domVioMap'})} />
      {page}
    </div>)
  }
}
