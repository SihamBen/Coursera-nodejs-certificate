const express = require("express");
const favoriteRouter = express.Router();
const bodyParser = require("body-parser");
const Favorites = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

favoriteRouter.use(bodyParser.json());

//@route GET /favorites
//@desc Get favorite dishes
//@access Private

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user.id })
      .populate("user")
      .populate("dishes")
      .then(
        (favorite) => {
          if (favorite != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          } else {
            err = new Error("Favorite  not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//@route POST /favorites/
//@desc  Add a dish to favorites
//@access Private
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.findOne({ user: req.user.id }).then(
      (favorite) => {
        if (favorite != null) {
          req.body.forEach((dish) => {
            if (!favorite.dishes.includes(dish.id)) {
                favorite.dishes.push(dish.id);
            } 
          });
          favorite.save().then(
            (favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            },
            (err) => next(err)
          );
        } else {
          Favorites.create({ user: req.user._id, dishes: req.body })
            .then(
              (favorite) => {
                console.log("Added to favorite ");
                res.status(200).setHeader("content-Type", "Application/json");
                res.json(favorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      },
      (err) => next(err)
    );
  });

//@route PUT /favorites/
//@desc not supported
//@access Private
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  });

//@route DELETE /favorites/
//@desc Delete all favorites
//@access Private
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (res, req) => {
    res.sendStatus(200);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    console.log(req.user.id);
    Favorites.deleteOne({ user: req.user._id })
      .then(
        (resp) => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//@route GET /favorite/:dishId
//@desc Not supported
//@access Private
favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites/:dishId");
  });

//@route POST /favorite/:dishId
//@desc Add dish to favorite list
//@access Private
favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.findOne({ user: req.user.id }).then(
      (favorite) => {
        if (favorite != null) {
          if (favorite.dishes.includes(req.params.dishId)) {
            res.statusCode = 403;
            res.end(
              "Dish " + req.params.dishId + " is already in the favorite list"
            );
          } else {
            favorite.dishes.push(req.dishId);
            favorite.save().then(
              (favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              },
              (err) => next(err)
            );
          }
        } else {
          Favorites.create({ user: req.user.id, dishes: [req.params.dishId] })
            .then(
              (favorite) => {
                console.log("Added to favorite !!");
                res.status(200).setHeader("content-Type", "Application/json");
                res.json(favorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      },
      (err) => next(err)
    );
  });

//@route PUT /favorite/:dishId
//@desc not supported
//@access Private
favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/:dishId");
  });
//@route DELETE /favorite/:dishtId
//@desc Delete a dish from favorite
//@access Private
favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (res, req) => {
    res.sendStatus(200);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          if (favorite != null && favorite.dishes.includes(req.params.dishId)) {
            Favorites.update(
              { user: req.user.id },
              { $pullAll: { dishes: [req.params.dishId] } }
            );
            favorite.save().then(
              (favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              },
              (err) => next(err)
            );
          } else if (favorite == null) {
            err = new Error("favorites not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error(
              "Dish " + req.params.dishId + " was not found in favorites"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
