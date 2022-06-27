var http = require("http");
var fs = require("fs");
//const path = String.raw("C:\Users\Lemond Wyatt\Desktop\index.html")

console.log("we did it");

onRequest = (request, response) => {
  //response.writeHead(200, {'ContentType': 'text/plain'});
  //response.write('Hello World');
  fs.readFile("./index.html", null, (err, data) => {
    response.write(data);
    response.end();
  });
};

http.createServer(onRequest).listen(8000);
