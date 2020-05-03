export default function(req, res){
  let n = Math.random() * 10;
  let arr = []
  for (let i = 0; i < n; i++){
    arr[i] = {x :i + 1, y: Math.random() * 10};
  }
  res.status(200).json(arr);
}
