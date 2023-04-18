// Import required libraries
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const countries = require('../resources/countries.js')
const races = require('../resources/races.js')

// Find Race Key By Country
async function findKeyByArrayValue(obj, searchValue) {
  return new Promise((resolve, reject) => {
    let keys = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].includes(searchValue)) {
          keys.push(key);
        }
      }
    }
    resolve(keys);
  });
}

// Define constants
const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;
const NUM_CHANNELS = 3;
const NUM_CLASSES = 3;
const BATCH_SIZE = 8;  // == total_images / 2 , 16 /2 = 8
const NUM_EPOCHS = 50;

// Define function to load images and labels from directory
function loadImagesFromDir(dirPath) {
  const imagePaths = [];
  const labels = [];
  const labelMap = {};
  let labelIndex = 0;
  
  // Read directory contents
  const files = fs.readdirSync(dirPath);
  
  // Loop through folders and assign labels
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      labelMap[file] = labelIndex;
      labelIndex++;
    }
  }
  
  // Loop through files and add to imagePaths and labels arrays
  for (const label in labelMap) {
    const labelPath = path.join(dirPath, label);
    const files = fs.readdirSync(labelPath);
    for (const file of files) {
      const filePath = path.join(labelPath, file);
      if (path.extname(filePath) === '.jpg') {
        imagePaths.push(filePath);
        labels.push(labelMap[label]);
      }
    }
  }

  // Shuffle the images and labels
  const indices = Array.from(Array(labels.length).keys());
  tf.util.shuffle(indices);
  const shuffledImagePaths = indices.map(i => imagePaths[i]);
  const shuffledLabels = indices.map(i => labels[i]);

  return { imagePaths: shuffledImagePaths, labels: shuffledLabels };
}
// Define function to preprocess images
function preprocessImage(image) {
  // Convert JPEG image buffer to tensor
  const tensor = tf.node.decodeImage(image, NUM_CHANNELS);
  // Resize image to required dimensions
  const resized = tf.image.resizeBilinear(tensor, [IMAGE_HEIGHT, IMAGE_WIDTH]);
  // Normalize pixel values to range [-1, 1]
  const normalized = resized.div(127.5).sub(1);
  return normalized;
}

// Define function to load and preprocess batch of images
async function loadBatch(batchPaths, labels) {
  const batchImages = [];
  for (const imagePath of batchPaths) {
    const imageBuffer = fs.readFileSync(imagePath);
    const preprocessed = preprocessImage(imageBuffer);
    batchImages.push(preprocessed);
  }
  const batchXs = tf.stack(batchImages);
  const batchYs = tf.oneHot(tf.tensor1d(labels, 'int32'), NUM_CLASSES);
  return { xs: batchXs, ys: batchYs };
}

// Define function to create and compile model
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_HEIGHT, IMAGE_WIDTH, NUM_CHANNELS],
    kernelSize: 3,
    filters: 32,
    activation: 'relu'
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: NUM_CLASSES, activation: 'softmax' }));
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  return model;
}

async function train_model(save_model_path, batchLength = BATCH_SIZE){
  // Load images and labels from directory
  const { imagePaths, labels } = loadImagesFromDir('./images');
  // Create and compile model
  const model = createModel();
  // Train model
  const numBatches = Math.ceil(imagePaths.length / batchLength);
  for (let epoch = 0; epoch < NUM_EPOCHS; epoch++) {
    console.log(`Epoch ${epoch + 1}/${NUM_EPOCHS}`);
    for (let i = 0; i < numBatches; i++) {
      const batchStart = i * batchLength;
      const batchEnd = Math.min(batchStart + batchLength, imagePaths.length);
      const batchPaths = imagePaths.slice(batchStart, batchEnd);
      const batchLabels = labels.slice(batchStart, batchEnd);
      const { xs, ys } = await loadBatch(batchPaths, batchLabels);
      const history = await model.fit(xs, ys, { batchSize: batchLength });
      tf.dispose([xs, ys]);
      console.log(`Batch ${i + 1}/${numBatches}: loss=${history.history.loss[0]}, acc=${history.history.acc[0]}`);
    }
  }
  // Save model
  fs.mkdirSync('./models', { recursive: true });
  await model.save(save_model_path);
  return { status : "Tranied & Saved!" }
}

async function predict(saved_model_path,test_image_path){
  // Load saved model
  const loadedModel = await tf.loadLayersModel(saved_model_path);
  // Read image file
  const imageBuffer = fs.readFileSync(test_image_path);
  // Preprocess image
  const preprocessed = preprocessImage(imageBuffer);
  // Reshape tensor to match model input shape
  const inputTensor = tf.reshape(preprocessed, [1, IMAGE_HEIGHT, IMAGE_WIDTH, NUM_CHANNELS]);
  // Make prediction
  const prediction = loadedModel.predict(inputTensor);
  // Get class with highest probability
  const predictedClass = tf.argMax(prediction, axis=1).dataSync()[0];
  // Get confidence of prediction
  const confidence = Number(prediction.max().dataSync()[0] * 100).toFixed(2) + "%";
  const classified = countries[predictedClass]
  const possible_race = await findKeyByArrayValue(races,classified)
  return {predictedClass,confidence,classified,possible_race}
}

const model_dir = `file://${process.cwd()}/models`
const model_path = `file://${process.cwd()}/models/model.json`

// Get Directory Information
async function dir_crawl(dir) {
  let dirCount = 0;
  let fileCount = 0;
  let directoryNames = [];
  let fileLinks = [];

  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      dirCount++;
      directoryNames.push(file);
      const results = await dir_crawl(filePath);
      dirCount += results[0];
      fileCount += results[1];
      directoryNames = directoryNames.concat(results[2]);
      fileLinks = fileLinks.concat(results[3]);
    } else {
      fileCount++;
      fileLinks.push(filePath.replace(/.*\/images/g,'/images'));
    }
  }

  const directory_and_files = []

  directoryNames.forEach((name) => {
    const dir = []
    const files = []
    fileLinks.forEach((link) => {
      if(link.includes(name)){
	files.push(link)
      }
    })

    dir.push({ dir : name, files : files })

    directory_and_files.push(dir)

  })

  return [dirCount, fileCount, directoryNames, fileLinks, directory_and_files];
}

async function countDirAndFiles(dir){
  const data = await dir_crawl(dir)
  return {
   total_dir: data[0],
   total_files: data[1],
   dir_and_files : data[4] 
  }
}

module.exports = { train_model , predict, model_path, model_dir, countDirAndFiles }
