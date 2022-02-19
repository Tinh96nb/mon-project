const path = require('path');
const Jimp = require('jimp');

/**
 * 
 * @param {String} fileName 
 * @returns {String}
 */
function getFileNameWithoutExtension(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}

function getDestPath(filePath) {
  const extensionFile = filePath.split('.').pop();
  return `${getFileNameWithoutExtension(filePath)}-thumbnail.${extensionFile}`;
}

/**
 * Resize + optimize images.
 *
 * @param Object options Customizable Options.
 * @param Array images An array of images paths.
 * @param Number width A number value of width e.g. 1920.
 * @param Number height Optional number value of height e.g. 1080.
 * @param Number quality Optional number value of quality of the image e.g. 90.
 */
async function optimizeImage(options = {}) {
  const defaultOptions = {
    imgPath: "",
    imgFileName: "",
    width: 640,
    height: Jimp.AUTO,
    quality: 90,
  };

  const opt = { ...defaultOptions, ...options };
  const filePath = getDestPath(opt.imgFileName);
  const absolutePath = path.resolve(__dirname + "../../../public/upload" + filePath);
  const image = await Jimp.read(opt.imgPath);
  await image.resize(opt.width, opt.height);
  await image.quality(opt.quality);
  await image.writeAsync(absolutePath);
  return filePath;
};

/**
 * 
 * @param {Object} file
 * @returns {String}
 */
async function makeThumbnail(file) {
  try {
    if (file.mimetype === "image/gif") {
      return ""
    }
    const filePath = "/nft/" + file.filename;
    const absolutePath = path.resolve(__dirname + "../../../public/upload" + filePath);
    if (file.mimetype.startsWith("image/")) {
      return optimizeImage({
        imgPath: absolutePath,
        imgFileName: filePath,
      })
    }
    if (file.mimetype.startsWith("video/")) {
      return "";
    }
  } catch (error) {
    console.error(error);
  }
  return ""
}

module.exports = {
  optimizeImage,
  getFileNameWithoutExtension,
  makeThumbnail,
}