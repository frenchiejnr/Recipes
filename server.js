const path = require('path');
const port = 8000;
const fs = require('fs');
const parse = require('node-html-parser').parse;
var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '/')));

let directory = "recipes"
let newHtml = "";
let files = fs.readdir(directory, (err, fileList) => {
    let listOfRecipes = '';
    let listOfLetters = '';
    let prevLetter = '';
    
    fileList.forEach(file => {
        let url = file;
        if (url === '_blank.md') {
            return;
        }
        let anchor = url.replace('.md', '');
        let name = anchor.split('-').join(' ');
        let firstLetter = name.charAt(0).toUpperCase();
        if (firstLetter !== prevLetter) {
            listOfRecipes += `<li id="${firstLetter}">`;
            listOfLetters += `<a href="#${firstLetter}">${firstLetter}</a>`;
        }
        else {
            listOfRecipes += `<li>`;
        }
        listOfRecipes += `<a href=recipe.js#${anchor}">${name}</a></li>`;
        prevLetter = firstLetter;
    })
    let data = fs.readFileSync('main.html','utf-8');
    const html = parse(data)
    let toc = html.querySelector('#toc ul');
    let navigation = html.querySelector('#navigation');
    toc.appendChild(listOfRecipes);
    navigation.appendChild(listOfLetters);
    newHtml = html.innerHTML;
});


app.get('/', function(req, res){   
    res.send(newHtml)
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})