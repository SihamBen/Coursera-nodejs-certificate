const express = require("express");
const dishRouter = express.Router();
const bodyParser = require("body-parser");
const Dishes = require("../models/dishes");
const authenticate = require("../authenticate");

dishRouter.use(bodyParser.json());

//@route GET /dishes
//@desc Get all dishes
//@access Public

dishRouter.route("/").get((req, res, next) => {
  Dishes.find({})
    .populate("comments.author")
    .then(
      dishes => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dishes);
      },
      err => next(err)
    )
    .catch(err => next(err));
});

//@route POST /dishes
//@desc Add a dish
//@access Private Admin only

dishRouter
  .route("/")
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        dish => {
          console.log("Dish created");
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

//@route PUT /dishes
//@desc not supported
//@access Private Admin only

dishRouter
  .route("/")
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  });

//@route Delete /dishes
//@desc delete all dishes
//@access Private Admin only

dishRouter
  .route("/")
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dishes.remove({})
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
    }
  );

//@route GET /dishes/:dishId
//@desc Get a specific dish
//@access Public

dishRouter.route("/:dishId").get((req, res, next) => {
  Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(
      dish => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      },
      err => next(err)
    )
    .catch(err => next(err));
});

//@route POST /dishes/:dishId
//@desc not supported
//@access Private Admin only

dishRouter
  .route("/:dishId")
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  });

//@route PUT /dishes/:dishId
//@desc Update a specific dish
//@access Private Admin only

dishRouter
  .route("/:dishId")
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
      { new: true }
    )
      .then(
        dish => {
          res.status(200).setHeader("content-Type", "Application/json");
          res.json(dish);
        },
        err => next(err)
      )
      .catch(err => {
        next(err);
      });
  });

//@route DELETE /dishes/:dishId
//@desc Delete a specific dish
//@access Private Admin only

dishRouter
  .route("/:dishId")
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dishes.findByIdAndRemove(req.params.dishId)
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
    }
  );

//@route GET /dishes/:dishId/comments
//@desc Get a comments of a specific dish
//@access Public

dishRouter.route("/:dishId/comments").get((req, res, next) => {
  Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(
      dish => {
        if (dish != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish.comments);
        } else {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      err => next(err)
    )
    .catch(err => next(err));
});

//@route POST /dishes/:dishId/comments
//@desc Get Add a comment
//@access Private

dishRouter
  .route("/:dishId/comments")
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then(
              dish => {
                Dishes.findById(dish._id)
                  .populate("comments.author")
                  .then(dish => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                  });
              },
              err => next(err)
            );
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

//@route PUT /dishes/:dishId/comments
//@desc not supported
//@access Private

dishRouter
  .route("/:dishId/comments")
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  });

//@route DELETE /dishes/:dishId/comments
//@desc Delete all comments
//@access Private Admin only

dishRouter
  .route("/:dishId/comments")
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dishes.findById(req.params.dishId)
        .then(
          dish => {
            if (dish != null) {
              for (var i = dish.comments.length - 1; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
              }
              dish.save().then(
                dish => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(dish);
                },
                err => next(err)
              );
            } else {
              err = new Error("Dish " + req.params.dishId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          err => next(err)
        )
        .catch(err => next(err));
    }
  );

//@route GET /dishes/:dishId/comments/:commentId
//@desc Get a specific comment
//@access Public

dishRouter.route("/:dishId/comments/:commentId").get((req, res, next) => {
  Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(
      dish => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
          err = new Error("Dish " + req.params.dishId + " not found");
          err.status = 404;
          return next(err);
        } else {
          err = new Error("Comment " + req.params.commentId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      err => next(err)
    )
    .catch(err => next(err));
});

//@route POST /dishes/:dishId/comments/:commentId
//@desc not supported
//@access Private

dishRouter
  .route("/:dishId/comments/:commentId")
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments/" +
        req.params.commentId
    );
  });

//@route PUT /dishes/:dishId/comments/:commentId
//@desc Update a comment
//@access Private Author only

dishRouter
  .route("/:dishId/comments/:commentId")
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null &&
            dish.comments.id(req.params.commentId) != null) {
            if (dish.comments.author.equals(req.user.id)
              
            ) {
              if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment =
                  req.body.comment;
              }
              dish.save().then(
                dish => {
                  Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then(dish => {
                      res.statusCode = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(dish);
                    });
                },
                err => next(err)
              );
            } else if (dish == null) {
              err = new Error("Dish " + req.params.dishId + " not found");
              err.status = 404;
              return next(err);
            } else {
              err = new Error("Not authorized");
            err.status = 404;
            return next(err);
              
            }
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
              err.status = 404;
              return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

//@route DELETE /dishes/:dishId/comments/:commentId
//@desc Delete a comment
//@access Private Author only

dishRouter
  .route("/:dishId/comments/:commentId")
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dishes.findById(req.params.dishId)
        .then(
          dish => {
            if ( dish != null &&
              dish.comments.id(req.params.commentId) != null) {
              if (dish.comments.author.equals(req.user.id)
               
              ) {
                dish.comments.id(req.params.commentId).remove();
                dish.save().then(
                  dish => {
                    Dishes.findById(dish._id)
                      .populate("comments.author")
                      .then(dish => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(dish);
                      });
                  },
                  err => next(err)
                );
              } else if (dish == null) {
                err = new Error("Dish " + req.params.dishId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error("Not authorized");
                err.status = 404;
                return next(err);
              }
            } else {
              err = new Error(
                "Comment " + req.params.commentId + " not found"
              );
              err.status = 404;
              return next(err);
              
            }
          },
          err => next(err)
        )
        .catch(err => next(err));
    }
  );
module.exports = dishRouter;
