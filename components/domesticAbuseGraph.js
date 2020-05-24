import { VictoryBar, VictoryChart } from 'victory';

export default class DomesticAbuseGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  graphData(){
    return Object.entries(this.props.data)
                .map( ([year, domVioRate]) => ({
                      x: year,
                      y: domVioRate
                    })
                );
  }

  render() {
    const data = this.graphData();
    console.log(data);
    if (data.length > 0) {
      return (
        <VictoryChart
          categories={{x: data.map(d => d.x)}}
          domain={{y:[0, 4000]}}
          domainPadding={[40, 0]}>
          <VictoryBar data={data}/>
        </VictoryChart>
      );
    } else {
      return <div></div>;
    }
  }
}
