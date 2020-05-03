class HelloButton extends React.Component {
  async getTextFromAPI(e){
    let response = await fetch("api/hello");
    response = await response.json();
    alert(response['text']);
  }

  render(){
    return <input type="button" value="Hello" onClick={this.getTextFromAPI}></input>
  }

}

export default HelloButton;
