export default function(req, res){
  let result = getResult();
  res.status(200).json({text: result});
}

function getResult(){
  return "Hello World";
}
