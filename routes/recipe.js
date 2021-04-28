const express = require('express');
const router = express.Router();
const fs = require('fs');
const { default: parse } = require('node-html-parser');
const showdown = require('showdown')
const path = require('path');

router.use(function (req, res) {
  // extract which recipe from url anchor
  let filename = req.originalUrl;
  filename = filename.split('_')[1];
  filename = `recipes/${filename}.md`;

  // load the recipe
  let recipe = fs.readFileSync(filename, 'utf-8');

  // convert markdown to html, split into sections
  let converter = new showdown.Converter()
  recipe = converter.makeHtml(recipe);
  let sections = recipe.split('<h');
  
  // iterate sections, add to body
  let foundTitle = false;
  let newData;

  let css = `<link href="stylesheet.css" rel="stylesheet" type="text/css">`;
  newData += css; 
  let initialHtml = `<body>
	<div id="wrapper" class="recipe">
		<p id="back">
			<a href="index.php">
				<!-- via: https://fontawesome.com/icons/arrow-left -->
				<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
					<path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
				</svg>
			</a>
		</p>
		<section id="title"></section>
		<section id="info"></section>
		<section id="ingredients"></section>
		<section id="steps"></section>
		<hr />
		<section id="notes"></section>
		<section id="help"></section>
		<section id="basedon"></section>
	</div>
</body>`
// newData += initialHtml;
  sections.forEach(section => {
    // get from array, add start of header tag back in
    section = `<h${section}`;

    // regex to get id from header (auto-added by
    // the markdown parser)
    let idPattern = new RegExp('id="(.*?)"');
    let id = idPattern.exec(section);

    // if no match (happens at the start of the file
    // for some reason), just skip
    if (id === null) {
      return;
    }


    // remove id from header (for css later)
    // section = section.replace(idPattern, '');

    // if this is the first non-null match,
    // add 'title' id instead of the recipe name
    let parsedHtml = parse(section);
    
    if (!foundTitle) {
      let heading = parsedHtml.querySelector(`#${id[1]}`);
      heading.setAttribute('id', 'title');
      parsedHtml.removeChild(heading);
      parsedHtml.appendChild(heading);
      newData += parsedHtml.outerHTML;
      foundTitle = true; 
      // change page title too
    }
    else
    {
      // for all others, get id from regex match
      id = id[1];
      newData += section;
    }
    console.log(id);
    html = parse(initialHtml);
    currentSection = html.querySelector(`#${id}`);
    if (currentSection == null) {
        return;
    }
    currentSection.innerHtml = section;
    html.removeChild(currentSection);
    html.appendChild(currentSection);
    newData+= currentSection;

  });



  // console.log("Done");
  res.send(newData);
})



module.exports = router