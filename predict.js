// Prediction Test usinng saved Model
(async function(){
  const AI = require('./functions/main.js')
  console.log(
  await AI.predict(AI.model_path,"./test.jpg")
  )
})()
