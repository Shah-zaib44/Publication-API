"use strict";
const express = require("express");
var morgan = require("morgan");
const fs = require("fs");
const app = express();
app.use(morgan("combined"));
let rawdata = fs.readFileSync("server/db.json");
let publications = JSON.parse(rawdata);
var multer = require("multer");
var upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static("public"));

//Question 7
app.post("/publication", function (req, res) {
  for (let i = 0; i < publications.length; i++) {
    publications[i].imaginary = req.body.imaginary;
  }
  try {
    fs.writeFileSync(
      "server/db.json",
      JSON.stringify(publications),
      console.log("File written successfully")
    );
  } catch (err) {
    console.error(err);
  }
});

//Question 8
app.put("/publication/:xxx", function (req, res) {
  for (let i = 0; i < publications.length; i++) {
    if (publications[i].key == req.params.xxx) {
      try {
        publications[i].title = req.body.title;
        fs.writeFileSync(
          "server/db.json",
          JSON.stringify(publications),
          console.log("File written successfully")
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
});
app.listen(process.argv[2], () =>
  console.log(`Hi listening to the port number ${process.argv[2]}`)
);
