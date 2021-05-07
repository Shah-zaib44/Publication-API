"use strict";
const http = require("http");
var morgan = require("morgan");
const fs = require("fs");
const express = require("express");
const app = express();
app.use(morgan("combined"));
let rawdata = fs.readFileSync("server/db.json");
let publications = JSON.parse(rawdata);

const server = http.createServer(function (req, res) {
  // Question 0
  if (req.method == "GET" && req.url == "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(`Hi listening to the port number ${process.argv[2]}`);
    res.end();
  }
  if (req.method == "GET" && req.url == "/exit") {
    res.statusCode = 200;
    process.exit();
  }
  if (req.method == "GET" && req.url == "/restore") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(`db.json reloaded`);
    res.end();
  }

  // Question 1
  if (req.method == "GET" && req.url == "/countpapers") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(`${publications.length}`);
    res.end();
  }

  // Question 2
  if (req.method == "GET" && req.url == req.url.match(/\/authoredby\/.+/)) {
    req.url = req.url.replace(/%20+/g, " ");
    req.url = req.url.split("/")[2];

    let count = 0;
    for (let i = 0; i < publications.length; i++) {
      for (let j = 0; j < publications[i].authors.length; j++) {
        if (
          publications[i].authors[j]
            .toLowerCase()
            .indexOf(req.url.toLowerCase()) > -1
        ) {
          count++;
        }
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");

    res.write(JSON.stringify(count));
    res.end();
  }

  // Question 3
  if (req.method == "GET" && req.url == req.url.match(/\/descriptors\/.+/)) {
    req.url = req.url.replace(/%20+/g, " ");
    req.url = req.url.split("/")[2];

    let authors = [];
    let k = 0;
    for (let i = 0; i < publications.length; i++) {
      for (let j = 0; j < publications[i].authors.length; j++) {
        if (
          publications[i].authors[j]
            .toLowerCase()
            .indexOf(req.url.toLowerCase()) > -1
        ) {
          authors[k] = publications[i];
          k++;
        }
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify(authors));
    res.end();
  }

  // Question 4
  if (req.method == "GET" && req.url == req.url.match(/\/titles\/.+/)) {
    req.url = req.url.replace(/%20+/g, " ");
    req.url = req.url.split("/")[2];

    let titles = [];
    let k = 0;
    for (let i = 0; i < publications.length; i++) {
      for (let j = 0; j < publications[i].authors.length; j++) {
        if (
          publications[i].authors[j]
            .toLowerCase()
            .indexOf(req.url.toLowerCase()) > -1
        ) {
          titles[k] = publications[i].title;
          k++;
        }
      }
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify(titles));
    res.end();
  }

  // Question 5
  if (req.method == "GET" && req.url == req.url.match(/\/publication\/.+/)) {
    req.url = req.url.replace(/%20+/g, " ");
    req.url = req.url.split("/")[2];

    for (let i = 0; i < publications.length; i++) {
      if (publications[i].key == req.url) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");

        res.write(JSON.stringify(publications[i]));
        res.end();
      }
    }
  }
  // Question 6
  if (req.method == "DELETE" && req.url == req.url.match(/\/publication\/.+/)) {
    req.url = req.url.replace(/%20+/g, " ");
    req.url = req.url.split("/")[2];

    publications = publications.filter((user) => {
      return user.key !== req.url;
    });
    fs.writeFileSync(
      "server/db.json",
      JSON.stringify(publications, null, 2),
      function (err) {
        if (err) throw err;
        res.json(true);
      }
    );
  }
});

server.listen(process.argv[2], () =>
  console.log(`Hi listening to the port number ${process.argv[2]}`)
);
