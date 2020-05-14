import HelloButton from '../components/helloButton.js';
import GraphButton from '../components/graphButton.js';
import TestGraph from '../components/testGraph.js';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.handleGraphDataUpdate = this.handleGraphDataUpdate.bind(this);
    this.saveGraphData = this.saveGraphData.bind(this);
    this.fetchGraphData = this.fetchGraphData.bind(this);
    this.state = { graphs: [], graphData: [] };
  }

  async componentDidMount() {
    this.fetchGraphs();
  }

  handleGraphDataUpdate(graphData) {
    this.setState(
      { graphData } /*, () => alert(JSON.stringify(this.state['graphData']))*/,
    );
  }

  async fetchGraphs() {
    let res = await fetch('/api/graphdb');
    res = await res.json();
    this.setState({ graphs: res });
  }

  async fetchGraphData(graphId) {
    let graph = await (await fetch('/api/graphdb/' + graphId)).json();
    this.setState({ graphData: graph.graphData });
  }

  async saveGraphData() {
    let graphData = this.state.graphData;
    if (graphData.id != null) {
      alert('already saved');
    }
    await fetch('/api/graphdb', {
      method: 'POST',
      body: JSON.stringify(graphData),
      headers: { 'Content-Type': 'application/json' },
    });
    this.fetchGraphs();
  }

  render() {
    return <div>Placeholder</div>
  }
}
