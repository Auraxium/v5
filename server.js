const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
p = (s) => console.log(s)

const path = String.raw`C:\Users\Lemond Wyatt\Desktop\MEWWs\This 
is not The Ashen Demon (Embers + Inferno) from the FE 3 Hopes OST (320 kbps).mp3`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/load", (req, res) => {
  res.sendFile(__dirname + "/test.json");
});

app.post("/save", (req, res) => {
  fs.writeFile("test.json", JSON.stringify(req.body), "utf8", (err) => {
    if (err) {
      console.log("An error occured while writing JSON Object to File: " + err);
      return console.log("ERROR: Failed to save: " + err);
    }
  });
  console.log("File Saved to directory");
  return res.end("File saved.");
});

app.get("/song/:path", (req, res) => {
	var song_path = req.params.path.replace(/KJTGGTKGJ/g, "\\")
	res.sendFile(song_path, (err) => {
		if(err) {
			console.log("ERROR: " + err);
			return res.end("ERROR: " + err);
		}
	})
	p('File Sent Successfully')
})

app.listen(8000, null, () => console.log("Running"));