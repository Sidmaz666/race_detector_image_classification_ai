const express = require('express');
const fs = require('fs');
const path = require('path');
const { predict, train_model , model_dir, model_path , countDirAndFiles }  = require('../functions/main.js')
const credentials = require('./credentials.json')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const countries = require('../resources/countries.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'image/*', limit: '5mb' }));
app.use('/images',express.static(path.join(__dirname.replaceAll('/api','/images').replaceAll('\\api','\\images'))))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser());

// Authorize ADMIN
function authenticate(req,res,next){
  const cookie = req.cookies?.user;
  // Check if the cookie exists
  if (!cookie) {
    res.status(401).send({ 'error' : 'User Not Authorized!' });
    return;
  }
  const {username, password} = JSON.parse(decodeURIComponent(cookie));
  credentials.admin.forEach((e) => {
  if (e.username == username && e.password === password) {
    next();
  } else {
    res.status(401).send({ 'error' : 'User Not Authorized!' });
  }
  })
}

// FRONT-END

app.get('/',(req,res) => {
  res
    .status(200)
    .sendFile(
      path.join(
	__dirname,'site','guest','index.html'
      )
    )
})

app.get('/admin', (req,res) => {
 const user_cookie = req.cookies?.user;
 if (user_cookie) {
    const cookie_data = JSON.parse(decodeURIComponent(user_cookie))
    const user = credentials.admin.find(u => u.username === cookie_data.username && u.password === cookie_data.password);
    if (user) {
      return res.status(200).sendFile(path.join(__dirname,'site','admin','index.html'));
    } 
  }
     return res.status(200).sendFile(path.join(__dirname,'site','admin','login.html'));
})

// API
app.get('/api',(req,res) => {
  return res.status(200).json({
    "message" : "Welcome To Race Detector API"
  })
})

app.get('/api/dataset', authenticate ,async (req,res) => {
	const dataset = await countDirAndFiles(path.join(__dirname.replaceAll('/api','/images').replaceAll('\\api','\\images')))
  	return res.status(200).json({dataset})
})

app.get('/api/classes', authenticate ,(req,res) => {
  return res.status(200).json(countries)
})

app.get('/api/train', authenticate ,async (req,res) => {
  const batch_size = req.query.batch_size || 8
  const train_status = await train_model(model_dir,batch_size)
  return res.status(200).json({
	"status" : "success",
    	 train_status
  })
})


app.post('/api/admin_login',(req,res) => {
  const  username = req.body.username;
  const  password = req.body.password;
  if(!username || !password){
    return res.status(200).json({ "status" : 'Provide username and password'});
  }
  const user = credentials.admin.find(u => u.username === username && u.password === password);
  if (user) {
    res.cookie('user', JSON.stringify({ "username" : username , "password" : password }) );
    return res.status(201).json({ "status" :'Authenticated'});
  } else {
    return res.status(200).json({ "status" : 'Invalid username or password'});
  }
    
})

app.post('/api/predict', async (req, res) => {
  const image = req.body;
  if (!image) {
      return res.status(200).json({ "status":'Provide Image To Predict'});
}
  const imageName = 'image.jpg';
  fs.writeFileSync(path.join(__dirname, imageName), image);
  const result = await predict(model_path,path.join(__dirname, imageName))
  fs.unlinkSync(path.join(__dirname, imageName));
  return res.status(201).json(result);
});

app.post('/api/add_image', authenticate ,async(req,res) => {
  const image = req.body;
  const classFolder = req.query.class_folder

  if (!classFolder || classFolder == "" || classFolder == null) {
    return res.status(400).json({"status":'Provide a Class For the Image!'});
  }

  if (!image) {
    return res.status(400).json({ "status":'Provide an Image'});
  }

  const imageName = `${Math.random().toString(36).slice(2, 50)}.jpg`;
  const upload_path = path.join(__dirname.replaceAll('/api','/images').replaceAll('\\api','\\images'), classFolder, imageName)

  try{
  fs.writeFileSync(upload_path,image);
    return res.status(201).json({
     "status" : `${imageName}, Uploaded Successfully to ${classFolder}!`
  });
  } catch(e){
       return res.status(400).json({
       "status" : `${imageName}, Upload unsuccessfull to ${classFolder}!`
   });
  }
})


app.get('/*',(req,res) => {
  res
    .status(400)
    .sendFile(
      path.join(
	__dirname,'public', 'html' ,'404.html'
      )
    )
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

