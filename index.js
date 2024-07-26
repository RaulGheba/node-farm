const fs = require("fs"); //file system
const http = require("http"); //gives us networking capabilities
const path = require("path");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate"); //dot means current location of this module
///////////////////////////////////////////
// FILES

// fs.readFile("txt/start.txt", "utf-8", (err, data1) => {
//   console.log(data1);
//   fs.readFile(`txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("txt/final.txt", data1 + data2, "utf-8", (err) =>
//         console.log("s o facut")
//       );
//     });
//   });
// });

// // open up start.txt, then read-this.txt, then append.txt, then WRITE to final.txt
// console.log("Will read file!");

///////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  // we can do it synchronously because this is always at the top level, so executed each time we load up the app
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);


console.log(slugify("Fresh Avocados", { lower: true }));
const server = http.createServer((req, res) => {
  //this callback is called each time a new request is received by the server
  const { query, pathname } = url.parse(req.url, true); //parses the variables out of the url. our url is product?id=0 if the id is 0 for example. the query string is ?id=0,
  //  and that's what we parse. pathname is product. THESE ARE IN EACH URL EVER, BY DEFAULT
 
  console.log(pathname);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); //replaceTemplate takes the card html, and the current object from it, aka el from the mapping we did. then we join the array returned into an html string
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output); // This method must be called on each response. Essentially, it ends the response process.

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = dataObj[query.id]; //dataObj is an array. we retrieve the element coming at the position of the query's id (query is also an object from our url)
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      res.writeHead(200, { "Content-type": "application/json" }); //200 stands for ok, we send a new json header in that case. for json its application/json, for html text/html. writeHead
      // is essential to set the status code and responseheaders for an HTTP response.
      res.end(data);
    });

    // NOT FOUND
  } else {
    res.writeHead(404, {
      //in case of an error
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    }); //this can also send headers (piece of info about the response we are sending back). we can also make our own headers
    res.end("<h1>NU MERE</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
}); //accepts the port and the host. in this case localhost, aka 127... and an optional argument, a callback function, which runs as soon as the server starts listening
