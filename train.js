// Training Test
(async function(){
  const AI = require('./functions/main.js')
  console.log(
    await AI.train_model(AI.model_dir)
  )
})()

