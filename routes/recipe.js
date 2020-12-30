const express = require('express');
const router = express.Router();

router.use(function (req, res) {
  console.log("recipe");
  let filename = req.originalUrl;
  console.log(filename);
  filename = filename.split('_')[1];
  filename = `recipes/${filename}.md`;
  console.log(filename)
  })



module.exports = router