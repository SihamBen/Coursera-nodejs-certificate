const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../models/leaders");
const leaderRouter = express.Router();

const authenticate=require('../authenticate')
leaderRouter.use(bodyParser.json());
const cors = require("./cors");


leaderRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    Leaders.find({})
      .then(
        leaders => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(leaders);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  })
  .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then(
        leader => {
          console.log("Leaders created");
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(leader);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
      .then(
        resp => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  });

leaderRouter
  .route("/:leaderId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,(req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        leader => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(leader);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  })
  .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      { $set: req.body },
      { new: true }
    )
      .then(
        leader => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(leader);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(
        resp => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  });
module.exports = leaderRouter;
