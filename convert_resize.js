const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rename = promisify(fs.rename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

async function convertImagesInDirectory(directoryPath, width, height) {
  const files = await readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await convertImagesInDirectory(filePath, width, height);
    } else {
      const extension = path.extname(file).toLowerCase();

      if (IMAGE_EXTENSIONS.includes(extension)) {
        const isJPEG = extension === '.jpg' || extension === '.jpeg';

        if (!isJPEG) {
          // Convert image to JPEG
          const newFilePath = filePath.replace(extension, '.jpg');
          await sharp(filePath).jpeg().toFile(newFilePath);
          await rename(newFilePath, filePath);
        }

        // Resize image
        await sharp(filePath).resize(width, height).toBuffer()
          .then(async (data) => {
            await fs.promises.writeFile(filePath, data);
          })
          .catch((err) => {
            console.error(`Error resizing image ${filePath}: ${err}`);
          });
      }
    }
  }
}

convertImagesInDirectory('./images', 224, 224)
  .then(() => console.log('All images converted and resized.'))
  .catch((err) => console.error(`Error converting and resizing images: ${err}`));

