import HelloButton from '../components/helloButton.js';
import GraphButton from '../components/graphButton.js';
import TestGraph from '../components/testGraph.js';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.handleGraphDataUpdate = this.handleGraphDataUpdate.bind(this);
    this.state = { graphData: [] };
  }

  handleGraphDataUpdate(graphData) {
    this.setState(
      { graphData } /*, () => alert(JSON.stringify(this.state['graphData']))*/,
    );
  }

  render() {
    return (
      <>
        <div>
          <HelloButton />
        </div>
        <div>
          <GraphButton onGraphDataUpdate={this.handleGraphDataUpdate} />
        </div>
        <div style={{ width: '500px', height: '500px' }}>
          <TestGraph data={this.state.graphData} />
        </div>
      </>
    );
  }
}
