const express = require('express');
const router = express.Router();
const fs = require('fs');
const showdown = require('showdown')

router.use(function (req, res) {
  let filename = req.originalUrl;
  console.log(filename);
  filename = filename.split('_')[1];
  filename = `recipes/${filename}.md`;
  console.log(filename)

  let recipe = fs.readFileSync(filename, 'utf-8');
  let converter = new showdown.Converter()
  recipe = converter.makeHtml(recipe);
  console.log(recipe);
  res.send(recipe);
  })



module.exports = router