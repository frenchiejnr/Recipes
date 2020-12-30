const express = require('express');
const router = express.Router();
const fs = require('fs');

router.use(function (req, res) {
  let filename = req.originalUrl;
  console.log(filename);
  filename = filename.split('_')[1];
  filename = `recipes/${filename}.md`;
  console.log(filename)

  let recipe = fs.readFileSync(filename, 'utf-8');
  // recipe = md.makeHtml(recipe);
  console.log(recipe);
  })



module.exports = router