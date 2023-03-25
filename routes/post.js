const router = require("express").Router();
const Post = require("../models/Post");
const { verifyToken } = require("./verifyToken")

//CREATE POST
router.post("/", verifyToken, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({ success: true, savedPost });
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.email === req.body.email) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json({ success: true, updatedPost });
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.email) {
      try {
        await post.delete();
        res.status(200).json({ success: true, message: "POST Deleted" });
      } catch (err) {
        res.status(500).json(err);
      }
    // } else {
    //   res.status(401).json("You can delete only your post!");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const email = req.query.email;
  const catName = req.query.cat;
  try {
    let posts;
    if (email) {
      posts = await Post.find({ email });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;