const path = require('path');
const multer = require('koa-multer');

const upload = (folder = '') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../public/${folder}`));
    },
    filename: (req, file, cb) => {
      const filename = file.originalname.split('.');
      const type = filename[filename.length - 1];
      const firstName = file.mimetype.split("/")[0] === "video"
        ? encodeURIComponent(filename[0])
        : filename[0];
      cb(null, `${firstName}-${Date.now().toString(16)}.${type}`);
    },
  });
  const limits = {
    fileSize: 1024 * 1024 * 30
  };
  const uploader = multer({ storage, limits });
  return uploader;
};
module.exports = { upload };
