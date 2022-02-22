const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const Post = require("../models/post");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "_" + Date.now() + "." + ext);
  },
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentIndex = +req.query.page;
  let postData;
  postQuery = Post.find();
  if (pageSize && pageSize) {
    postQuery.skip(pageSize * (currentIndex - 1)).limit(pageSize);
  }
  const posts = postQuery
    .then((documents) => {
      postData = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.json({
        message: "Get post data api call successfully completed",
        posts: postData,
        postCount: count,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post successfully added",
        post: {
          ...createdPost,
          postId: createdPost._id,
        },
      });
    });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({ _id: id, creator: req.userData.userId }).then((result) => {
    if (result.n > 0) {
      res.status(201).json({
        message: "Deletetion Successfully",
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  });
});

router.get("/:id", (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId).then((document) => {
    if (document) {
      res.status(200).json({
        post: document,
      });
    } else {
      res.status(404).json({
        message: "Post not found",
      });
    }
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.image;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const postId = req.params.id;
    const post = new Post({
      _id: postId,
      title: req.body.title,
      description: req.body.description,
      imagePath: imagePath,
      creator: req.creator,
    });
    Post.updateOne({ _id: postId, creator: req.userData.userId }, post).then(
      (response) => {
        if (response.nModified > 0) {
          res.status(201).json({
            message: "Post Updated",
          });
        } else {
          res.status(401).json({
            message: "Not authorized",
          });
        }
      }
    );
  }
);
module.exports = router;
