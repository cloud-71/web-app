import { VictoryBar, VictoryChart } from 'victory';
import ColorInterpolate from 'color-interpolate';

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

    if (data.length > 0) {
      let palette = ColorInterpolate(['blue', 'yellow', 'red', 'maroon']);
      return (
        <VictoryChart
          categories={{x: data.map(d => d.x)}}
          domain={{y:[0, 4000]}}
          domainPadding={[40, 0]}>
          <VictoryBar
            data={data}
            style={{data: {fill: ({datum}) => datum.y < 4000 ? palette(datum.y/4000) : "#000000"}}}
            />
        </VictoryChart>
      );
    } else {
      return <div></div>;
    }
  }
}
