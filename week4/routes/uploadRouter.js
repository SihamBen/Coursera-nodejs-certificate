const express = require("express");
const uploadRouter = express.Router();
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const multer = require("multer");
const cors = require("./cors");

uploadRouter.use(bodyParser.json());
const storage = multer.diskStorage({
  desrination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png|gif|jpeg)$/)) {
    cb(new error("you can only upload images"));
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

uploadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Get operation not supported on /dishes");
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Delete operation not supported on /dishes");
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, upload.single("imageFile"), (req, res) => {
    res.status = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
  });

module.exports = uploadRouter;
