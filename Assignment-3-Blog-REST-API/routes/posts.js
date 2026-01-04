const express = require("express");
const validatePost = require("../middleware/validate");
const auth = require("../middleware/auth");

const router = express.Router();

let posts = [];
let idCounter = 1;

router.post("/", auth, validatePost, (req, res) => {
  const post = {
    id: idCounter++,
    title: req.body.title,
    content: req.body.content
  };
  posts.push(post);
  res.status(201).json(post);
});

router.get("/", (req, res) => {
  res.json(posts);
});

router.get("/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

router.put("/:id", auth, validatePost, (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.title = req.body.title;
  post.content = req.body.content;
  res.json(post);
});

router.delete("/:id", auth, (req, res) => {
  const index = posts.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted successfully" });
});

module.exports = router;
