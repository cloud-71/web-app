class GraphButton extends React.Component {
  async getNumbersFromAPI(e){
    let response = await fetch("api/numbers");
    response = await response.json();
    this.props.onGraphDataUpdate(response);
  }

  render(){
    return <input type="button" value="Generate Random Graph" onClick={() => this.getNumbersFromAPI()}></input>
  }

}

export default GraphButton;
