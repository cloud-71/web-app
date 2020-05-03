import {VictoryBar, VictoryChart} from 'victory';

export default class TestGraph extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    const data = this.props.data;
    console.log(data);
    if (data.length > 0){
      return(
        <VictoryChart domainPadding={20}>
          <VictoryBar data={data}/>
        </VictoryChart>
      )
    }else {
      return <div></div>
    }
  }
}
